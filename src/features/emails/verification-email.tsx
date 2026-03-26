import { Heading, Section, Text } from '@react-email/components';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailLayout } from './components/email-layout';

interface VerificationEmailProps {
  userName?: string;
  verificationUrl: string;
  expiresInMinutes?: number;
}

export function VerificationEmail({
  userName = 'there',
  verificationUrl = 'https://example.com/verify',
  expiresInMinutes = 60,
}: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Heading as="h1" className="m-0 text-[24px] font-bold text-slate-900">
        Verify your email
      </Heading>

      <Text className="mt-2 text-[14px] leading-6 text-slate-600">
        Hi {userName}, please verify your email address to get started.
      </Text>

      <Section className="my-6 text-center">
        <EmailButton href={verificationUrl}>Verify Email Address</EmailButton>
      </Section>

      <Text className="m-0 text-[12px] leading-5 text-slate-500">
        This link expires in {expiresInMinutes} minutes. If you didn&apos;t create an account, you
        can safely ignore this email.
      </Text>

      {/* Security note */}
      <Section className="mt-4 rounded-md bg-blue-50 p-4">
        <Text className="m-0 text-[12px] leading-5 text-blue-800">
          <strong>Security tip:</strong> We will never ask for your password via email. If you
          receive a suspicious email claiming to be from us, please report it.
        </Text>
      </Section>

      {/* Fallback URL */}
      <Text className="mt-6 break-all text-[12px] leading-5 text-slate-400">
        If the button doesn&apos;t work, copy and paste this URL into your browser:{' '}
        {verificationUrl}
      </Text>

      <EmailFooter />
    </EmailLayout>
  );
}

export default VerificationEmail;
