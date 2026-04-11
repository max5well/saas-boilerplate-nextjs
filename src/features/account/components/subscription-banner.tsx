import Link from 'next/link';

import { SubscriptionWithProduct } from '@/features/pricing/types';

interface SubscriptionBannerProps {
  subscription: SubscriptionWithProduct | null;
}

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
  if (!subscription) return null;

  const status = subscription.status;

  if (status === 'past_due') {
    return (
      <div className='rounded-md border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-center text-sm text-orange-300'>
        Your payment is past due. Please{' '}
        <Link href='/manage-subscription' className='font-semibold underline'>
          update your payment method
        </Link>{' '}
        to keep your subscription active.
      </div>
    );
  }

  if (status === 'canceled' || subscription.cancel_at_period_end) {
    const endDate = subscription.current_period_end
      ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    return (
      <div className='rounded-md border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-center text-sm text-yellow-300'>
        Your subscription has been canceled.{' '}
        {endDate ? `You still have access until ${endDate}. ` : ''}
        <Link href='/pricing' className='font-semibold underline'>
          Resubscribe
        </Link>
      </div>
    );
  }

  if (status === 'unpaid') {
    return (
      <div className='rounded-md border border-red-500/50 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300'>
        Your subscription is unpaid.{' '}
        <Link href='/manage-subscription' className='font-semibold underline'>
          Resolve payment issue
        </Link>
      </div>
    );
  }

  if (status === 'trialing') {
    const trialEnd = subscription.trial_end
      ? new Date(subscription.trial_end).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    return (
      <div className='rounded-md border border-blue-500/50 bg-blue-500/10 px-4 py-3 text-center text-sm text-blue-300'>
        You&apos;re on a free trial.{trialEnd ? ` Your trial ends on ${trialEnd}.` : ''}
      </div>
    );
  }

  return null;
}
