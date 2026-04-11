import { NextResponse } from 'next/server';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';

export const dynamic = 'force-dynamic';

/**
 * GET /api/subscription
 *
 * Returns the current user's subscription status. Useful for client components
 * that need to check subscription tier without a full page load.
 *
 * Returns: { status, priceId, productId, cancelAtPeriodEnd, currentPeriodEnd } or { status: null }
 */
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ status: null }, { status: 401 });
  }

  const subscription = await getSubscription();

  if (!subscription) {
    return NextResponse.json({ status: null });
  }

  return NextResponse.json({
    status: subscription.status,
    priceId: subscription.price_id,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: subscription.current_period_end,
  });
}
