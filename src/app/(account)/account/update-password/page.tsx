'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { updatePassword } from '@/features/auth/actions/auth-actions';

export default function UpdatePasswordPage() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const form = event.target as HTMLFormElement;
    const password = form['password'].value;
    const confirmPassword = form['confirmPassword'].value;

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        description: 'Passwords do not match.',
      });
      setPending(false);
      return;
    }

    if (password.length < 8) {
      toast({
        variant: 'destructive',
        description: 'Password must be at least 8 characters.',
      });
      setPending(false);
      return;
    }

    const response = await updatePassword(password);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred. Please try again.',
      });
    } else {
      toast({
        description: 'Password updated successfully.',
      });
      router.push('/account');
    }

    setPending(false);
  }

  return (
    <section className='rounded-lg bg-card px-4 py-16'>
      <h1 className='mb-8 text-center'>Set new password</h1>

      <div className='m-auto w-full max-w-md'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input
            type='password'
            name='password'
            placeholder='New password'
            aria-label='New password'
            required
            minLength={8}
            autoFocus
          />
          <Input
            type='password'
            name='confirmPassword'
            placeholder='Confirm password'
            aria-label='Confirm password'
            required
            minLength={8}
          />
          <Button variant='secondary' type='submit' disabled={pending}>
            {pending ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>
    </section>
  );
}
