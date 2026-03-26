import { Heading, Section, Text } from '@react-email/components';

import { EmailButton } from './components/email-button';
import { EmailFooter } from './components/email-footer';
import { EmailLayout } from './components/email-layout';

interface PasswordResetEmailProps {
  userName?: string;
  resetUrl: string;
  expiresInMinutes?: number;
  ipAddress?: string;
}

export function PasswordResetEmail({
  userName = 'there',
  resetUrl = 'https://example.com/reset',
  expiresInMinutes = 30,
  ipAddress,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Heading as="h1" className="m-0 text-[24px] font-bold text-slate-900">
        Reset your password
      </Heading>

      <Text className="mt-2 text-[14px] leading-6 text-slate-600">
        Hi {userName}, we received a request to reset your password. Click the button below to
        choose a new one.
      </Text>

      <Section className="my-6 text-center">
        <EmailButton href={resetUrl}>Reset Password</EmailButton>
      </Section>

      {/* Expiry warning */}
      <Section className="rounded-md bg-amber-50 p-4">
        <Text className="m-0 text-[12px] leading-5 text-amber-800">
          This link expires in <strong>{expiresInMinutes} minutes</strong>. After that, you&apos;ll
          need to request a new password reset.
        </Text>
      </Section>

      {/* Didn't request this */}
      <Section className="mt-3 rounded-md bg-red-50 p-4">
        <Text className="m-0 text-[12px] leading-5 text-red-800">
          <strong>Didn&apos;t request this?</strong> If you didn&apos;t request a password reset,
          please ignore this email. Your account is safe — no changes have been made.
          {ipAddress && (
            <>
              {' '}
              This request was made from IP address{' '}
              <code className="rounded bg-red-100 px-1 py-0.5 font-mono text-[11px]">
                {ipAddress}
              </code>
              .
            </>
          )}
        </Text>
      </Section>

      {/* Fallback URL */}
      <Text className="mt-6 break-all text-[12px] leading-5 text-slate-400">
        If the button doesn&apos;t work, copy and paste this URL: {resetUrl}
      </Text>

      <EmailFooter />
    </EmailLayout>
  );
}

export default PasswordResetEmail;
