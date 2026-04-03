import { createElement, type ReactElement } from 'react';

import { siteConfig } from '@/config/site';
import { resendClient } from '@/libs/resend/resend-client';

const FROM_ADDRESS = siteConfig.email.from;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  success: boolean;
  data?: { id: string };
  error?: string;
}

/**
 * Send a React Email template via Resend.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, react, from = FROM_ADDRESS, replyTo, tags } = options;

  try {
    const { data, error } = await resendClient.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      replyTo,
      tags,
    });

    if (error) {
      console.error(`[Email] Failed to send "${subject}":`, error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent "${subject}" to ${Array.isArray(to) ? to.join(', ') : to} (id: ${data?.id})`);
    return { success: true, data: { id: data?.id ?? '' } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error(`[Email] Failed to send "${subject}":`, message);
    return { success: false, error: message };
  }
}

// ─── Typed convenience senders ───────────────────────────────────────────────

import { VerificationEmail } from '../verification-email';
import { PasswordResetEmail } from '../password-reset-email';
import { PaymentReceipt, type LineItem } from '../payment-receipt';
import { SubscriptionStarted } from '../subscription-started';
import { SubscriptionUpdated } from '../subscription-updated';
import { SubscriptionCanceled } from '../subscription-canceled';

export async function sendVerificationEmail(
  to: string,
  props: { userName?: string; verificationUrl: string; expiresInMinutes?: number }
) {
  return sendEmail({
    to,
    subject: 'Verify your email address',
    react: createElement(VerificationEmail, props),
    tags: [{ name: 'category', value: 'verification' }],
  });
}

export async function sendPasswordResetEmail(
  to: string,
  props: {
    userName?: string;
    resetUrl: string;
    expiresInMinutes?: number;
    ipAddress?: string;
  }
) {
  return sendEmail({
    to,
    subject: 'Reset your password',
    react: createElement(PasswordResetEmail, props),
    tags: [{ name: 'category', value: 'password-reset' }],
  });
}

export async function sendPaymentReceiptEmail(
  to: string,
  props: {
    userName?: string;
    invoiceNumber: string;
    invoiceDate: string;
    paymentMethod: string;
    lineItems: LineItem[];
    subtotal: number;
    tax?: number;
    total: number;
    currency?: string;
    billingPortalUrl: string;
  }
) {
  return sendEmail({
    to,
    subject: `Payment receipt #${props.invoiceNumber}`,
    react: createElement(PaymentReceipt, props),
    tags: [{ name: 'category', value: 'billing' }],
  });
}

export async function sendSubscriptionStartedEmail(
  to: string,
  props: {
    userName?: string;
    planName: string;
    billingInterval: 'month' | 'year';
    price: number;
    currency?: string;
    nextBillingDate: string;
    trialEndDate?: string;
    dashboardUrl: string;
    billingPortalUrl: string;
    features?: string[];
  }
) {
  return sendEmail({
    to,
    subject: `Welcome to ${props.planName}`,
    react: createElement(SubscriptionStarted, props),
    tags: [{ name: 'category', value: 'subscription' }],
  });
}

export async function sendSubscriptionUpdatedEmail(
  to: string,
  props: {
    userName?: string;
    previousPlan: string;
    newPlan: string;
    previousPrice: number;
    newPrice: number;
    currency?: string;
    billingInterval: 'month' | 'year';
    effectiveDate: string;
    nextBillingDate: string;
    prorationAmount?: number;
    billingPortalUrl: string;
  }
) {
  return sendEmail({
    to,
    subject: 'Your subscription has been updated',
    react: createElement(SubscriptionUpdated, props),
    tags: [{ name: 'category', value: 'subscription' }],
  });
}

export async function sendSubscriptionCanceledEmail(
  to: string,
  props: {
    userName?: string;
    planName: string;
    accessEndDate: string;
    feedbackUrl: string;
    resubscribeUrl: string;
  }
) {
  return sendEmail({
    to,
    subject: 'Your subscription has been canceled',
    react: createElement(SubscriptionCanceled, props),
    tags: [{ name: 'category', value: 'subscription' }],
  });
}
