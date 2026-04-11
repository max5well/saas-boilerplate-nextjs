'use server';

import { getSupabaseAdmin } from '@/libs/supabase/supabase-admin';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { ActionResponse } from '@/types/action-response';

export async function updateEmailPreferences(formData: FormData): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: 'Not authenticated' } };
  }

  const emailProductUpdates = formData.get('email_product_updates') === 'on';
  const emailMarketing = formData.get('email_marketing') === 'on';

  const { error } = await getSupabaseAdmin()
    .from('users')
    .update({
      email_product_updates: emailProductUpdates,
      email_marketing: emailMarketing,
    })
    .eq('id', user.id);

  if (error) {
    console.error('[Email Prefs] Update failed:', error);
    return { data: null, error: { message: 'Failed to update preferences.' } };
  }

  return { data: null, error: null };
}
