import { Container } from '@/components/container';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `About Us — ${siteConfig.name}`,
  description: `Learn more about ${siteConfig.name} and our mission.`,
};

export default function AboutUsPage() {
  return (
    <Container className='flex flex-col gap-8 py-20'>
      <div className='m-auto max-w-2xl'>
        <h1 className='mb-4 text-4xl font-bold'>About Us</h1>
        <div className='flex flex-col gap-4 text-muted-foreground'>
          <p>
            {siteConfig.name} was built to help teams ship faster. We believe that great software
            shouldn&apos;t require months of boilerplate setup before you can focus on what makes your
            product unique.
          </p>
          <p>
            Our mission is to provide the best foundation for modern SaaS applications — with
            authentication, payments, email, and infrastructure handled out of the box so you can
            focus on building features your customers love.
          </p>
          <p>
            Have questions? We&apos;d love to hear from you.{' '}
            <a href='/contact' className='text-foreground underline'>
              Get in touch
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
