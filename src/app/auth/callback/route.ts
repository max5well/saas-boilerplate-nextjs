import { createElement } from 'react';
import { NextResponse } from 'next/server';

import { siteConfig } from '@/config/site';
import { sendEmail } from '@/features/emails/utils/email-sender';
import { WelcomeEmail } from '@/features/emails/welcome';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getURL } from '@/utils/get-url';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/account';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Password recovery flow — redirect to update password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${getURL()}/account/update-password`);
      }

      // Send welcome email on first sign-up (user metadata has no previous sign-in)
      const user = data.session?.user;
      if (user?.email && isNewUser(user.created_at, user.last_sign_in_at)) {
        sendWelcomeEmail(user.email).catch(console.error);
      }

      return NextResponse.redirect(`${getURL()}${next}`);
    }
  }

  // Auth code exchange failed — redirect to login with error
  return NextResponse.redirect(`${getURL()}/login?error=auth_callback_error`);
}

function isNewUser(createdAt?: string, lastSignIn?: string): boolean {
  if (!createdAt) return false;
  // Consider it a new user if created within the last 60 seconds
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created < 60_000;
}

async function sendWelcomeEmail(email: string) {
  return sendEmail({
    to: email,
    subject: `Welcome to ${siteConfig.name}!`,
    react: createElement(WelcomeEmail),
    tags: [{ name: 'category', value: 'welcome' }],
  });
}
