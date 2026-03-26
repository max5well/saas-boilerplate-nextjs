import { Column, Heading, Hr, Row, Section, Text } from '@react-email/components';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailLayout } from './components/email-layout';

export interface LineItem {
  description: string;
  quantity?: number;
  total: number;
}

interface PaymentReceiptProps {
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

function formatCurrency(amountInCents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}

export function PaymentReceipt({
  userName = 'there',
  invoiceNumber = 'INV-0001',
  invoiceDate = 'January 1, 2026',
  paymentMethod = 'Visa •••• 4242',
  lineItems = [{ description: 'Pro Plan (monthly)', total: 2900 }],
  subtotal = 2900,
  tax,
  total = 2900,
  currency = 'USD',
  billingPortalUrl = 'https://example.com/billing',
}: PaymentReceiptProps) {
  return (
    <EmailLayout preview={`Payment receipt #${invoiceNumber}`}>
      <Heading as="h1" className="m-0 text-[24px] font-bold text-slate-900">
        Payment receipt
      </Heading>

      <Text className="mt-2 text-[14px] leading-6 text-slate-600">
        Hi {userName}, here&apos;s your receipt.
      </Text>

      {/* Invoice details */}
      <Section className="mt-4 rounded-md bg-slate-50 p-4">
        <Row>
          <Column className="text-[12px] text-slate-500">Invoice number</Column>
          <Column align="right" className="text-[12px] font-semibold text-slate-900">
            {invoiceNumber}
          </Column>
        </Row>
        <Row className="mt-1">
          <Column className="text-[12px] text-slate-500">Date</Column>
          <Column align="right" className="text-[12px] font-semibold text-slate-900">
            {invoiceDate}
          </Column>
        </Row>
        <Row className="mt-1">
          <Column className="text-[12px] text-slate-500">Payment method</Column>
          <Column align="right" className="text-[12px] font-semibold text-slate-900">
            {paymentMethod}
          </Column>
        </Row>
      </Section>

      {/* Line items */}
      <Section className="mt-6">
        <Row className="border-b border-slate-200 pb-2">
          <Column className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">
            Description
          </Column>
          <Column
            align="right"
            className="text-[12px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Amount
          </Column>
        </Row>

        {lineItems.map((item, index) => (
          <Row key={index} className="border-b border-slate-100 py-3">
            <Column className="text-[14px] text-slate-900">
              {item.description}
              {item.quantity && item.quantity > 1 && (
                <span className="text-slate-500"> × {item.quantity}</span>
              )}
            </Column>
            <Column align="right" className="font-mono text-[14px] text-slate-900">
              {formatCurrency(item.total, currency)}
            </Column>
          </Row>
        ))}
      </Section>

      {/* Totals */}
      <Section className="mt-4">
        <Row>
          <Column className="text-[14px] text-slate-500">Subtotal</Column>
          <Column align="right" className="font-mono text-[14px] text-slate-900">
            {formatCurrency(subtotal, currency)}
          </Column>
        </Row>
        {tax !== undefined && tax > 0 && (
          <Row className="mt-1">
            <Column className="text-[14px] text-slate-500">Tax</Column>
            <Column align="right" className="font-mono text-[14px] text-slate-900">
              {formatCurrency(tax, currency)}
            </Column>
          </Row>
        )}
        <Hr className="my-3 border-slate-900" />
        <Row>
          <Column className="text-[16px] font-bold text-slate-900">Total</Column>
          <Column align="right" className="font-mono text-[16px] font-bold text-slate-900">
            {formatCurrency(total, currency)}
          </Column>
        </Row>
      </Section>

      <Section className="mt-6 text-center">
        <EmailButton href={billingPortalUrl} variant="secondary">
          View Billing Portal
        </EmailButton>
      </Section>

      <Text className="mt-4 text-center text-[12px] text-slate-400">
        A PDF version of this invoice is available in your billing portal.
      </Text>

      <EmailFooter />
    </EmailLayout>
  );
}

export default PaymentReceipt;
