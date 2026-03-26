'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ActionResponse } from '@/types/action-response';

export function EmailForm({
  signInWithEmail,
}: {
  signInWithEmail: (email: string) => Promise<ActionResponse>;
}) {
  const [pending, setPending] = useState(false);
  const [emailFormOpen, setEmailFormOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = event.target as HTMLFormElement;
    const email = form['email'].value;
    const response = await signInWithEmail(email);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while authenticating. Please try again.',
      });
    } else {
      toast({
        description: `To continue, click the link in the email sent to: ${email}`,
      });
    }

    form.reset();
    setPending(false);
  }

  return (
    <Collapsible open={emailFormOpen} onOpenChange={setEmailFormOpen}>
      <CollapsibleTrigger asChild>
        <button
          className='flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 py-4 font-medium transition-all hover:bg-zinc-800 disabled:bg-neutral-700 disabled:text-black'
          disabled={pending}
        >
          Continue with Email
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='mt-[-2px] w-full rounded-b-md bg-zinc-900 p-8'>
          <form onSubmit={handleSubmit}>
            <Input
              type='email'
              name='email'
              placeholder='Enter your email'
              aria-label='Enter your email'
              autoFocus
            />
            <div className='mt-4 flex justify-end gap-2'>
              <Button type='button' onClick={() => setEmailFormOpen(false)}>
                Cancel
              </Button>
              <Button variant='secondary' type='submit' disabled={pending}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
