'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getClientIp, rateLimit } from '@/libs/rate-limit/rate-limiter';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { ActionResponse } from '@/types/action-response';
import { getURL } from '@/utils/get-url';

import type { OAuthProvider } from '../config/auth-config';

async function checkAuthRateLimit(): Promise<ActionResponse | null> {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const { success } = rateLimit(`auth:${ip}`, 10);
  if (!success) {
    return { data: null, error: { message: 'Too many attempts. Please wait a moment and try again.' } };
  }
  return null;
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<ActionResponse> {
  const limited = await checkAuthRateLimit();
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getURL('/auth/callback'),
    },
  });

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return redirect(data.url);
}

export async function signInWithEmail(email: string): Promise<ActionResponse> {
  const limited = await checkAuthRateLimit();
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getURL('/auth/callback'),
    },
  });

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return { data: null, error: null };
}

export async function signOut(): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return { data: null, error: null };
}

export async function resetPassword(email: string): Promise<ActionResponse> {
  const limited = await checkAuthRateLimit();
  if (limited) return limited;

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getURL('/auth/callback?type=recovery'),
  });

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return { data: null, error: null };
}

export async function updatePassword(newPassword: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return { data: null, error: null };
}
