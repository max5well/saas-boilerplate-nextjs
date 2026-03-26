'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { resetPassword } from '@/features/auth/actions/auth-actions';

export default function ResetPasswordPage() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.target as HTMLFormElement;
    const email = form['email'].value;
    const response = await resetPassword(email);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred. Please try again.',
      });
    } else {
      setSent(true);
    }

    setPending(false);
  }

  return (
    <section className='py-xl m-auto flex h-full max-w-lg items-center'>
      <div className='mt-16 flex w-full flex-col gap-8 rounded-lg bg-black p-10 px-4 text-center'>
        <div className='flex flex-col gap-4'>
          <Image src='/logo.png' width={80} height={80} alt='' className='m-auto' />
          <h1 className='text-lg'>Reset your password</h1>
        </div>

        {sent ? (
          <div className='flex flex-col gap-4'>
            <p className='text-neutral-400'>
              Check your email for a password reset link. Click the link to set a new password.
            </p>
            <Link href='/login' className='text-cyan-400 underline'>
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <Input
              type='email'
              name='email'
              placeholder='Enter your email'
              aria-label='Enter your email'
              required
              autoFocus
            />
            <Button variant='secondary' type='submit' disabled={pending}>
              {pending ? 'Sending...' : 'Send reset link'}
            </Button>
            <Link href='/login' className='text-sm text-neutral-400 underline'>
              Back to login
            </Link>
          </form>
        )}
      </div>
    </section>
  );
}
