// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { defaultRedirect, pricingRedirect } from '@/features/auth/config/auth-config';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getURL } from '@/utils/get-url';

const siteUrl = getURL();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Password recovery flow — redirect to password update page
    if (type === 'recovery') {
      return NextResponse.redirect(`${siteUrl}/account/update-password`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.redirect(`${siteUrl}/login`);
    }

    // Check if user is subscribed, if not redirect to pricing page
    const { data: userSubscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle();

    if (!userSubscription) {
      return NextResponse.redirect(`${siteUrl}${pricingRedirect}`);
    } else {
      return NextResponse.redirect(`${siteUrl}${defaultRedirect}`);
    }
  }

  return NextResponse.redirect(siteUrl);
}
