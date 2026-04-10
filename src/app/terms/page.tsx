import { Container } from '@/components/container';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `Terms of Service — ${siteConfig.name}`,
  description: `Terms of service for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <Container className='flex flex-col gap-8 py-20'>
      <div className='m-auto max-w-2xl'>
        <h1 className='mb-4 text-4xl font-bold'>Terms of Service</h1>
        <p className='mb-8 text-sm text-muted-foreground'>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className='flex flex-col gap-6 text-muted-foreground'>
          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>1. Acceptance of Terms</h2>
            <p>
              By accessing or using {siteConfig.name}, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>2. Description of Service</h2>
            <p>
              {siteConfig.name} provides a software-as-a-service platform. We reserve the right to
              modify, suspend, or discontinue any aspect of the service at any time.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activities that occur under your account. You must notify us immediately of any
              unauthorized use.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>4. Payment and Billing</h2>
            <p>
              Paid subscriptions are billed in advance on a recurring basis. You can cancel your
              subscription at any time through your account settings. Refunds are handled on a
              case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages resulting from your
              use of the service.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>6. Contact</h2>
            <p>
              For questions about these terms, please{' '}
              <a href='/contact' className='text-foreground underline'>contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
