import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Export a function to create new Supabase client instances
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseKey);
};

// Also export a default instance for convenience
export const supabase = createClient();
