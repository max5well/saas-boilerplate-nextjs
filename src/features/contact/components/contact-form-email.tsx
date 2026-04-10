import { siteConfig } from '@/config/site';
import { Body, Container, Head, Hr,Html, Section, Text } from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactFormEmail({ name, email, message }: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f6f9fc' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '20px 0' }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            New contact form submission
          </Text>
          <Hr />
          <Section>
            <Text>
              <strong>Name:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Message:</strong>
            </Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>
          </Section>
          <Hr />
          <Text style={{ fontSize: '12px', color: '#999' }}>
            Sent from the {siteConfig.name} contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
