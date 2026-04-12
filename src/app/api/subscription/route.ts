import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { getClientIp, rateLimit } from '@/libs/rate-limit/rate-limiter';

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
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const { success } = rateLimit(`api:sub:${ip}`, 30);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

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
