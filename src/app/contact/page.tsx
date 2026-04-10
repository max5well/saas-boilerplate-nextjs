'use client';

import { FormEvent, useState } from 'react';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { siteConfig } from '@/config/site';
import { submitContactForm } from '@/features/contact/actions/contact-action';

export default function ContactPage() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const response = await submitContactForm(formData);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: (response.error as { message: string }).message || 'Something went wrong. Please try again.',
      });
    } else {
      toast({ description: 'Message sent! We\'ll get back to you soon.' });
      form.reset();
    }

    setPending(false);
  }

  return (
    <Container className='flex flex-col items-center gap-8 py-20'>
      <div className='flex max-w-lg flex-col items-center gap-4 text-center'>
        <h1 className='text-4xl font-bold'>Get in touch</h1>
        <p className='text-lg text-muted-foreground'>
          Have questions about our Enterprise plan or need a custom solution? We&apos;d love to hear
          from you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-card p-8'
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor='name' className='text-sm font-medium'>
            Name
          </label>
          <input
            id='name'
            name='name'
            type='text'
            placeholder='Your name'
            required
            className='rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='email' className='text-sm font-medium'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='you@company.com'
            required
            className='rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='message' className='text-sm font-medium'>
            Message
          </label>
          <textarea
            id='message'
            name='message'
            rows={4}
            placeholder='Tell us about your needs...'
            required
            minLength={10}
            className='rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring'
          />
        </div>

        <Button variant='default' type='submit' className='w-full' disabled={pending}>
          {pending ? 'Sending...' : 'Send message'}
        </Button>
        <p className='text-center text-xs text-muted-foreground'>
          We&apos;ll get back to you within 24 hours.
        </p>
      </form>
    </Container>
  );
}
