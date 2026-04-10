import type { Database } from '@/libs/supabase/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Copy .env.example → .env.local and fill in NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  _client = createClient<Database>(url, key);
  return _client;
}

/** @deprecated Use getSupabaseAdmin() instead — kept for backwards compatibility. */
export const supabaseAdminClient = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseAdmin(), prop, receiver);
  },
});
