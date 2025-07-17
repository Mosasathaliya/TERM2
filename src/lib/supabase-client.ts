
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables not set. Supabase client not initialized. This is expected for DEV login.');
  // Create a dummy client to avoid breaking the app where `supabase` is imported.
  // Its methods will fail if called, but the dev login flow doesn't call them.
  supabase = {} as SupabaseClient;
}

export { supabase };
