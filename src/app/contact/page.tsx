import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with the ${siteConfig.name} team.`,
};

export default function ContactPage() {
  return (
    <Container className='flex flex-col items-center gap-8 py-20'>
      <div className='flex max-w-lg flex-col items-center gap-4 text-center'>
        <h1 className='text-4xl font-bold'>Get in touch</h1>
        <p className='text-lg text-muted-foreground'>
          Have questions about our Enterprise plan or need a custom solution? We&apos;d love to hear
          from you.
        </p>
      </div>

      <div className='flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-card p-8'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='name' className='text-sm font-medium'>
            Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='Your name'
            className='rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email' className='text-sm font-medium'>
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='you@company.com'
            className='rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='message' className='text-sm font-medium'>
            Message
          </label>
          <textarea
            id='message'
            rows={4}
            placeholder='Tell us about your needs...'
            className='rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
          />
        </div>

        <Button variant='default' className='w-full'>
          Send message
        </Button>
        <p className='text-center text-xs text-muted-foreground'>
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    </Container>
  );
}
