import { Link, Section, Text } from '@react-email/components';

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

interface EmailFooterProps {
  unsubscribeUrl?: string;
}

export function EmailFooter({ unsubscribeUrl }: EmailFooterProps) {
  return (
    <Section className="mt-8 border-t border-slate-200 pt-6">
      <Text className="m-0 text-xs text-slate-400">
        You received this email because you have an account with YourApp.
      </Text>
      {unsubscribeUrl && (
        <Text className="m-0 mt-1 text-xs">
          <Link href={unsubscribeUrl} className="text-slate-400 underline">
            Unsubscribe from these emails
          </Link>
        </Text>
      )}
      <Text className="m-0 mt-1 text-xs">
        <Link href={baseUrl + '/account'} className="text-slate-400 underline">
          Manage notification settings
        </Link>
      </Text>
    </Section>
  );
}
