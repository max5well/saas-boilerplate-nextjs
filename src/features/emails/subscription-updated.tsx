import { Column, Heading, Row, Section, Text } from '@react-email/components';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailLayout } from './components/email-layout';

interface SubscriptionUpdatedProps {
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

function formatCurrency(amountInCents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}

export function SubscriptionUpdated({
  userName = 'there',
  previousPlan = 'Starter',
  newPlan = 'Pro',
  previousPrice = 900,
  newPrice = 2900,
  currency = 'USD',
  billingInterval = 'month',
  effectiveDate = 'January 15, 2026',
  nextBillingDate = 'February 1, 2026',
  prorationAmount,
  billingPortalUrl = 'https://example.com/billing',
}: SubscriptionUpdatedProps) {
  const isUpgrade = newPrice > previousPrice;
  const changeLabel = isUpgrade ? 'upgraded' : 'changed';
  const intervalLabel = billingInterval === 'year' ? 'yr' : 'mo';

  return (
    <EmailLayout preview={`Your subscription has been ${changeLabel}`}>
      <Heading as="h1" className="m-0 text-[24px] font-bold text-slate-900">
        Subscription {changeLabel}
      </Heading>

      <Text className="mt-2 text-[14px] leading-6 text-slate-600">
        Hi {userName}, your subscription has been {changeLabel}. Here&apos;s a summary.
      </Text>

      {/* Plan comparison */}
      <Section className="mt-6">
        <Row>
          {/* Previous plan */}
          <Column className="w-[46%] rounded-md bg-slate-50 p-4" valign="top">
            <Text className="m-0 text-[12px] font-semibold uppercase tracking-wider text-slate-400">
              Previous
            </Text>
            <Text className="m-0 mt-2 text-[18px] font-bold text-slate-400 line-through">
              {previousPlan}
            </Text>
            <Text className="m-0 mt-1 text-[14px] text-slate-400">
              {formatCurrency(previousPrice, currency)}/{intervalLabel}
            </Text>
          </Column>

          {/* Arrow */}
          <Column className="w-[8%] text-center text-[18px] text-slate-400" valign="middle">
            →
          </Column>

          {/* New plan */}
          <Column
            className="w-[46%] rounded-md border border-blue-600 bg-blue-50 p-4"
            valign="top"
          >
            <Text className="m-0 text-[12px] font-semibold uppercase tracking-wider text-blue-600">
              New plan
            </Text>
            <Text className="m-0 mt-2 text-[18px] font-bold text-slate-900">{newPlan}</Text>
            <Text className="m-0 mt-1 text-[14px] text-slate-900">
              {formatCurrency(newPrice, currency)}/{intervalLabel}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Billing details */}
      <Section className="mt-6 rounded-md bg-slate-50 p-4">
        <Row>
          <Column className="text-[12px] text-slate-500">Effective date</Column>
          <Column align="right" className="text-[14px] font-semibold text-slate-900">
            {effectiveDate}
          </Column>
        </Row>
        {prorationAmount !== undefined && (
          <Row className="mt-1">
            <Column className="text-[12px] text-slate-500">
              Proration {prorationAmount > 0 ? 'charge' : 'credit'}
            </Column>
            <Column
              align="right"
              className={`font-mono text-[14px] font-semibold ${prorationAmount > 0 ? 'text-slate-900' : 'text-green-600'}`}
            >
              {prorationAmount > 0 ? '' : '-'}
              {formatCurrency(Math.abs(prorationAmount), currency)}
            </Column>
          </Row>
        )}
        <Row className="mt-1">
          <Column className="text-[12px] text-slate-500">Next billing date</Column>
          <Column align="right" className="text-[14px] font-semibold text-slate-900">
            {nextBillingDate}
          </Column>
        </Row>
      </Section>

      <Section className="mt-6 text-center">
        <EmailButton href={billingPortalUrl} variant="secondary">
          View Billing Details
        </EmailButton>
      </Section>

      <EmailFooter />
    </EmailLayout>
  );
}

export default SubscriptionUpdated;
