import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

import { type UserRole } from '../config/auth-config';

export interface UserWithRole {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  billing_address: any;
  payment_method: any;
}

/**
 * Get the current user with their role from the users table.
 * Returns null if not authenticated.
 */
export async function getUserWithRole(): Promise<UserWithRole | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    role: (data as any).role ?? 'user',
    billing_address: data.billing_address,
    payment_method: data.payment_method,
  };
}
