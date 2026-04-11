'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { updateEmailPreferences } from '@/features/account/actions/email-preferences-action';
import { updateProfile } from '@/features/account/actions/profile-actions';

export default function SettingsPage() {
  const [profilePending, setProfilePending] = useState(false);
  const [emailPending, setEmailPending] = useState(false);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfilePending(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const response = await updateProfile(formData);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: (response.error as { message: string }).message || 'Something went wrong.',
      });
    } else {
      toast({ description: 'Profile updated.' });
    }

    setProfilePending(false);
  }

  async function handleEmailPrefsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailPending(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const response = await updateEmailPreferences(formData);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: (response.error as { message: string }).message || 'Something went wrong.',
      });
    } else {
      toast({ description: 'Email preferences updated.' });
    }

    setEmailPending(false);
  }

  return (
    <section className='rounded-lg bg-card px-4 py-16'>
      <h1 className='mb-8 text-center'>Settings</h1>

      <div className='m-auto flex w-full max-w-3xl flex-col gap-4'>
        {/* Profile */}
        <div className='rounded-md bg-muted'>
          <div className='p-4'>
            <h2 className='mb-1 text-xl font-semibold'>Profile</h2>
            <form onSubmit={handleProfileSubmit} className='flex flex-col gap-4 py-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='full_name' className='text-sm font-medium'>
                  Full name
                </label>
                <Input id='full_name' name='full_name' placeholder='Your name' />
              </div>
              <div className='flex justify-end'>
                <Button variant='secondary' type='submit' disabled={profilePending}>
                  {profilePending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Email preferences */}
        <div className='rounded-md bg-muted'>
          <div className='p-4'>
            <h2 className='mb-1 text-xl font-semibold'>Email notifications</h2>
            <form onSubmit={handleEmailPrefsSubmit} className='flex flex-col gap-4 py-4'>
              <label className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  name='email_product_updates'
                  defaultChecked
                  className='h-4 w-4 rounded border-border'
                />
                <div>
                  <div className='text-sm font-medium'>Product updates</div>
                  <div className='text-xs text-muted-foreground'>
                    New features, improvements, and changelog
                  </div>
                </div>
              </label>
              <label className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  name='email_marketing'
                  defaultChecked
                  className='h-4 w-4 rounded border-border'
                />
                <div>
                  <div className='text-sm font-medium'>Marketing emails</div>
                  <div className='text-xs text-muted-foreground'>
                    Tips, offers, and promotional content
                  </div>
                </div>
              </label>
              <p className='text-xs text-muted-foreground'>
                Transactional emails (password resets, payment receipts) are always sent.
              </p>
              <div className='flex justify-end'>
                <Button variant='secondary' type='submit' disabled={emailPending}>
                  {emailPending ? 'Saving...' : 'Save preferences'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Security */}
        <div className='rounded-md bg-muted'>
          <div className='p-4'>
            <h2 className='mb-1 text-xl font-semibold'>Security</h2>
            <p className='py-4 text-sm text-muted-foreground'>
              Update your password to keep your account secure.
            </p>
          </div>
          <div className='flex justify-end rounded-b-md border-t border-border p-4'>
            <Button size='sm' variant='secondary' asChild>
              <Link href='/account/update-password'>Change password</Link>
            </Button>
          </div>
        </div>

        {/* Billing */}
        <div className='rounded-md bg-muted'>
          <div className='p-4'>
            <h2 className='mb-1 text-xl font-semibold'>Billing</h2>
            <p className='py-4 text-sm text-muted-foreground'>
              Manage your subscription, payment method, and billing details through the Stripe
              customer portal.
            </p>
          </div>
          <div className='flex justify-end rounded-b-md border-t border-border p-4'>
            <Button size='sm' variant='secondary' asChild>
              <Link href='/manage-subscription'>Manage billing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
