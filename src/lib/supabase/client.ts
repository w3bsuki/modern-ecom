import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in environment variables');
}

// Create a single Supabase client instance for client-side usage
// Note: For server-side operations (API routes, Server Components), 
// especially those needing elevated privileges (like using the service role key),
// you might create a separate server-side client or use the one created here
// carefully, ensuring Row Level Security (RLS) is properly configured.
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 