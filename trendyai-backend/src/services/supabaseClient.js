import { createClient } from "@supabase/supabase-js";

// Supabase configuration - replace with your actual Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "your-anon-key";

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create authenticated Supabase client (for server-side operations)
export function createAuthenticatedSupabaseClient(accessToken) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  return client;
}

export default supabase;
