import { Column, Heading, Row, Section, Text } from '@react-email/components';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailLayout } from './components/email-layout';

interface SubscriptionStartedProps {
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

function formatCurrency(amountInCents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}

export function SubscriptionStarted({
  userName = 'there',
  planName = 'Pro',
  billingInterval = 'month',
  price = 2900,
  currency = 'USD',
  nextBillingDate = 'February 1, 2026',
  trialEndDate,
  dashboardUrl = 'https://example.com/dashboard',
  billingPortalUrl = 'https://example.com/billing',
  features = [],
}: SubscriptionStartedProps) {
  return (
    <EmailLayout preview={`Welcome to ${planName} — your subscription is active`}>
      <Heading as="h1" className="m-0 text-[24px] font-bold text-slate-900">
        Welcome to {planName}
      </Heading>

      <Text className="mt-2 text-[14px] leading-6 text-slate-600">
        Hi {userName},{' '}
        {trialEndDate
          ? `your free trial of the ${planName} plan has started. Your trial ends on ${trialEndDate}.`
          : `your ${planName} subscription is now active. You're all set!`}
      </Text>

      {/* Plan details */}
      <Section className="mt-4 rounded-md bg-slate-50 p-4">
        <Row>
          <Column className="text-[12px] text-slate-500">Plan</Column>
          <Column align="right" className="text-[14px] font-bold text-blue-600">
            {planName}
          </Column>
        </Row>
        <Row className="mt-1">
          <Column className="text-[12px] text-slate-500">Billing</Column>
          <Column align="right" className="text-[14px] font-semibold text-slate-900">
            {formatCurrency(price, currency)} / {billingInterval === 'year' ? 'year' : 'month'}
          </Column>
        </Row>
        <Row className="mt-1">
          <Column className="text-[12px] text-slate-500">Next billing date</Column>
          <Column align="right" className="text-[14px] font-semibold text-slate-900">
            {nextBillingDate}
          </Column>
        </Row>
      </Section>

      {/* Features */}
      {features.length > 0 && (
        <Section className="mt-6">
          <Text className="m-0 text-[14px] font-semibold text-slate-900">
            What&apos;s included:
          </Text>
          {features.map((feature, index) => (
            <Text key={index} className="m-0 mt-2 text-[14px] leading-5 text-slate-700">
              ✓ {feature}
            </Text>
          ))}
        </Section>
      )}

      <Section className="mt-6 text-center">
        <EmailButton href={dashboardUrl}>Go to Dashboard</EmailButton>
      </Section>

      <Text className="mt-4 text-center text-[12px] text-slate-400">
        Manage your subscription in the{' '}
        <a href={billingPortalUrl} className="text-blue-600 underline">
          billing portal
        </a>
        .
      </Text>

      <EmailFooter />
    </EmailLayout>
  );
}

export default SubscriptionStarted;
