import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anon = process.env.SUPABASE_ANON_KEY!;
export const supabaseAnon = createClient(url, anon);

export function supabaseRls(accessToken: string) {
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } }
  });
}
