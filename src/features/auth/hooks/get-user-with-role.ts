import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { Tables } from '@/libs/supabase/types';

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

  const user = data as Tables<'users'>;

  return {
    id: user.id,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role ?? 'user',
    billing_address: user.billing_address,
    payment_method: user.payment_method,
  };
}
