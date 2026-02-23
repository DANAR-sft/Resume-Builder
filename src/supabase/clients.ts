import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;

/**
 * Membuat instance client baru yang sangat ringan.
 * PersistSession dimatikan agar tidak terjadi tabrakan data antar user di backend.
 */
export function getSupabaseClient(accessToken: string) {
  return createClient(url, anon, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}