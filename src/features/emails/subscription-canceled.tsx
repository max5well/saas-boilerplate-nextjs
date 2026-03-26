import { Heading, Link, Section, Text } from '@react-email/components';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailLayout } from './components/email-layout';

interface SubscriptionCanceledProps {
  userName?: string;
  planName: string;
  accessEndDate: string;
  feedbackUrl: string;
  resubscribeUrl: string;
}

export function SubscriptionCanceled({
  userName = 'there',
  planName = 'Pro',
  accessEndDate = 'February 1, 2026',
  feedbackUrl = 'https://example.com/feedback',
  resubscribeUrl = 'https://example.com/pricing',
}: SubscriptionCanceledProps) {
  return (
    <EmailLayout preview="Your subscription has been canceled">
      <Heading as="h1" className="m-0 text-[24px] font-bold text-slate-900">
        Subscription canceled
      </Heading>

      <Text className="mt-2 text-[14px] leading-6 text-slate-600">
        Hi {userName}, we&apos;ve confirmed the cancellation of your {planName} plan. We&apos;re
        sorry to see you go.
      </Text>

      {/* Access end date notice */}
      <Section className="mt-4 rounded-md bg-amber-50 p-4">
        <Text className="m-0 text-[14px] leading-6 text-amber-800">
          You&apos;ll continue to have access to all {planName} features until{' '}
          <strong>{accessEndDate}</strong>. After that, your account will be downgraded to the free
          tier.
        </Text>
      </Section>

      {/* What happens next */}
      <Section className="mt-6">
        <Text className="m-0 text-[14px] font-semibold text-slate-900">What happens next:</Text>
        {[
          'Your data will be preserved',
          'Premium features will be disabled after the access period',
          'You can resubscribe at any time to restore full access',
        ].map((item, index) => (
          <Text key={index} className="m-0 mt-2 text-[14px] leading-5 text-slate-600">
            • {item}
          </Text>
        ))}
      </Section>

      {/* Feedback request */}
      <Section className="mt-6 rounded-md bg-slate-50 p-4">
        <Text className="m-0 text-[14px] font-semibold text-slate-900">Help us improve</Text>
        <Text className="m-0 mt-1 text-[14px] leading-6 text-slate-600">
          We&apos;d love to hear why you canceled. Your feedback helps us build a better product.
        </Text>
        <Text className="m-0 mt-2">
          <Link href={feedbackUrl} className="text-[14px] font-semibold text-blue-600 underline">
            Share your feedback (2 min)
          </Link>
        </Text>
      </Section>

      {/* Win-back hint */}
      <Section className="mt-4 rounded-md border border-blue-600 bg-blue-50 p-4">
        <Text className="m-0 text-[14px] leading-6 text-blue-800">
          Changed your mind? You can resubscribe anytime before {accessEndDate} and keep your
          current setup intact.
        </Text>
      </Section>

      <Section className="mt-6 text-center">
        <EmailButton href={resubscribeUrl}>Resubscribe</EmailButton>
      </Section>

      <EmailFooter />
    </EmailLayout>
  );
}

export default SubscriptionCanceled;
