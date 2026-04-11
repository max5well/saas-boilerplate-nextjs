import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { signInWithEmail, signInWithOAuth } from '@/features/auth/actions/auth-actions';

import { AuthUI } from '../auth-ui';

const errorMessages: Record<string, string> = {
  auth_callback_error: 'Authentication failed. Please try again.',
  session_expired: 'Your session has expired. Please sign in again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const session = await getSession();
  const subscription = await getSubscription();
  const params = await searchParams;

  if (session && subscription) {
    redirect('/account');
  }

  if (session && !subscription) {
    redirect('/pricing');
  }

  const errorMessage = params.error ? errorMessages[params.error] ?? 'An error occurred.' : null;

  return (
    <section className='py-xl m-auto flex h-full max-w-lg flex-col items-center gap-4'>
      {errorMessage && (
        <div className='w-full rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-center text-sm text-destructive'>
          {errorMessage}
        </div>
      )}
      <AuthUI mode='login' signInWithOAuth={signInWithOAuth} signInWithEmail={signInWithEmail} />
    </section>
  );
}
