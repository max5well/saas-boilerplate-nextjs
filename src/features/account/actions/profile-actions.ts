'use server';

import { getSupabaseAdmin } from '@/libs/supabase/supabase-admin';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { ActionResponse } from '@/types/action-response';

export async function updateProfile(formData: FormData): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  const fullName = formData.get('full_name') as string | null;

  const { error } = await getSupabaseAdmin()
    .from('users')
    .update({ full_name: fullName || null })
    .eq('id', user.id);

  if (error) {
    console.error('[Profile] Update failed:', error);
    return { data: null, error: { message: 'Failed to update profile.' } };
  }

  return { data: null, error: null };
}
