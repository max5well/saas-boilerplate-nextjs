import { Container } from '@/components/container';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `Privacy Policy — ${siteConfig.name}`,
  description: `Privacy policy for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <Container className='flex flex-col gap-8 py-20'>
      <div className='m-auto max-w-2xl'>
        <h1 className='mb-4 text-4xl font-bold'>Privacy Policy</h1>
        <p className='mb-8 text-sm text-muted-foreground'>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className='flex flex-col gap-6 text-muted-foreground'>
          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>1. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as your name, email address, and
              payment information when you create an account or subscribe to our service.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services,
              process transactions, and communicate with you about your account.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>4. Third-Party Services</h2>
            <p>
              We use third-party services for authentication (Supabase), payment processing (Stripe),
              and email delivery (Resend). These services have their own privacy policies governing
              how they handle your data.
            </p>
          </section>

          <section>
            <h2 className='mb-2 text-xl font-semibold text-foreground'>5. Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please{' '}
              <a href='/contact' className='text-foreground underline'>contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
