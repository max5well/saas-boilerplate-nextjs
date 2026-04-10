import { Body, Container, Head, Html, Link,Preview, Section, Text } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

import tailwindConfig from '../tailwind.config';

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview: string;
}

export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind config={tailwindConfig}>
        <Body className="mx-auto my-auto bg-slate-100 px-2 py-10 font-sans">
          <Container className="mx-auto w-[560px] overflow-hidden rounded-lg bg-white shadow-sm">
            {/* Header */}
            <Section className="border-b border-slate-200 px-8 py-5">
              <Text className="m-0 text-[20px] font-bold tracking-tight text-slate-900">
                Your<span className="text-blue-600">App</span>
              </Text>
            </Section>

            {/* Content */}
            <Section className="px-8 py-8">{children}</Section>
          </Container>

          {/* Footer */}
          <Container className="mx-auto mt-4 w-[560px]">
            <Section className="text-center">
              <Text className="m-0 text-xs text-slate-500">
                <Link className="text-slate-500 underline" href={baseUrl + '/privacy'}>
                  Privacy
                </Link>
                {' · '}
                <Link className="text-slate-500 underline" href={baseUrl + '/terms'}>
                  Terms
                </Link>
              </Text>
              <Text className="m-0 mt-1 text-xs text-slate-400">
                © {new Date().getFullYear()} YourApp. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
