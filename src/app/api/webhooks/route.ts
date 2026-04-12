import Stripe from 'stripe';

import { upsertUserSubscription } from '@/features/account/controllers/upsert-user-subscription';
import {
  sendPaymentReceiptEmail,
  sendSubscriptionCanceledEmail,
  sendSubscriptionStartedEmail,
  sendSubscriptionUpdatedEmail,
} from '@/features/emails/utils/email-sender';
import { upsertPrice } from '@/features/pricing/controllers/upsert-price';
import { upsertProduct } from '@/features/pricing/controllers/upsert-product';
import { log } from '@/libs/logger/logger';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import * as Sentry from '@sentry/nextjs';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
]);

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return Response.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }
    event = stripeAdmin.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    log.error('Webhook signature verification failed', { error: (error as Error).message });
    return Response.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProduct(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPrice(event.data.object as Stripe.Price);
          break;
        case 'customer.subscription.created': {
          const createdSub = event.data.object as Stripe.Subscription;
          await upsertUserSubscription({
            subscriptionId: createdSub.id,
            customerId: createdSub.customer as string,
            isCreateAction: false,
          });
          await sendSubscriptionEmail(createdSub, 'created');
          break;
        }
        case 'customer.subscription.updated': {
          const updatedSub = event.data.object as Stripe.Subscription;
          await upsertUserSubscription({
            subscriptionId: updatedSub.id,
            customerId: updatedSub.customer as string,
            isCreateAction: false,
          });
          await sendSubscriptionEmail(updatedSub, 'updated', event.data.previous_attributes);
          break;
        }
        case 'customer.subscription.deleted': {
          const deletedSub = event.data.object as Stripe.Subscription;
          await upsertUserSubscription({
            subscriptionId: deletedSub.id,
            customerId: deletedSub.customer as string,
            isCreateAction: false,
          });
          await sendSubscriptionEmail(deletedSub, 'deleted');
          break;
        }
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          await sendInvoiceReceiptEmail(invoice);
          break;
        }
        case 'checkout.session.completed': {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await upsertUserSubscription({
              subscriptionId: subscriptionId as string,
              customerId: checkoutSession.customer as string,
              isCreateAction: true,
            });
          }
          break;
        }
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      Sentry.captureException(error, { tags: { source: 'stripe-webhook', eventType: event.type } });
      log.error('Webhook handler failed', { eventType: event.type, error: (error as Error).message });
      // Return 500 so Stripe retries on transient failures (DB down, API timeout, etc.)
      // Returning 400 tells Stripe the webhook is invalid and can disable the endpoint.
      return Response.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
  }
  return Response.json({ received: true });
}

// ─── Email notification helpers ──────────────────────────────────────────────

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripeAdmin.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return customer.email ?? null;
  } catch {
    return null;
  }
}

async function sendSubscriptionEmail(
  subscription: Stripe.Subscription,
  action: 'created' | 'updated' | 'deleted',
  previousAttributes?: Partial<Stripe.Subscription>,
) {
  try {
    const email = await getCustomerEmail(subscription.customer as string);
    if (!email) return;

    const userName = email.split('@')[0];
    const price = subscription.items.data[0]?.price;
    const planName = price?.nickname ?? price?.product?.toString() ?? 'Plan';
    const interval = (price?.recurring?.interval ?? 'month') as 'month' | 'year';
    const unitAmount = price?.unit_amount ?? 0;
    const currency = (subscription.currency ?? 'usd').toUpperCase();
    const periodEnd = subscription.current_period_end;

    if (action === 'created') {
      await sendSubscriptionStartedEmail(email, {
        userName,
        planName,
        billingInterval: interval,
        price: unitAmount,
        currency,
        nextBillingDate: formatDate(periodEnd),
        trialEndDate: subscription.trial_end ? formatDate(subscription.trial_end) : undefined,
        dashboardUrl: `${baseUrl}/account`,
        billingPortalUrl: `${baseUrl}/account`,
      });
    } else if (action === 'updated' && previousAttributes) {
      // Only send email if the plan/price actually changed
      const prevPriceId = (previousAttributes as any)?.items?.data?.[0]?.price?.id;
      if (!prevPriceId || prevPriceId === price?.id) return;

      await sendSubscriptionUpdatedEmail(email, {
        userName,
        previousPlan: 'Previous Plan',
        newPlan: planName,
        previousPrice: 0,
        newPrice: unitAmount,
        currency,
        billingInterval: interval,
        effectiveDate: formatDate(Math.floor(Date.now() / 1000)),
        nextBillingDate: formatDate(periodEnd),
        billingPortalUrl: `${baseUrl}/account`,
      });
    } else if (action === 'deleted') {
      await sendSubscriptionCanceledEmail(email, {
        userName,
        planName,
        accessEndDate: formatDate(periodEnd),
        feedbackUrl: `${baseUrl}/feedback`,
        resubscribeUrl: `${baseUrl}/pricing`,
      });
    }
  } catch (error) {
    log.error(`Failed to send subscription ${action} email`, { error: (error as Error).message });
  }
}

async function sendInvoiceReceiptEmail(invoice: Stripe.Invoice) {
  try {
    const customerEmail = invoice.customer_email;
    if (!customerEmail) return;

    const lineItems = (invoice.lines?.data ?? []).map((line) => ({
      description: line.description ?? 'Subscription',
      quantity: line.quantity ?? 1,
      total: line.amount ?? 0,
    }));

    await sendPaymentReceiptEmail(customerEmail, {
      userName: customerEmail.split('@')[0],
      invoiceNumber: invoice.number ?? invoice.id,
      invoiceDate: formatDate(invoice.created),
      paymentMethod: 'Card on file',
      lineItems,
      subtotal: invoice.subtotal ?? 0,
      tax: invoice.tax ?? undefined,
      total: invoice.total ?? 0,
      currency: (invoice.currency ?? 'usd').toUpperCase(),
      billingPortalUrl: `${baseUrl}/account`,
    });
  } catch (error) {
    log.error('Failed to send payment receipt email', { error: (error as Error).message });
  }
}
