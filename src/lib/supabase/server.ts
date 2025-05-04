import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or Service Role Key in environment variables');
  }

  // Create a Supabase client with the service role key for server-side operations
  // IMPORTANT: This has admin privileges and should only be used in secure server contexts
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    cookies: {
      get(name) {
        return cookies().get(name)?.value;
      },
      set(name, value, options) {
        // This is a server context, so we need to handle cookies differently
        // We'll use Next.js cookies() API
        cookies().set(name, value, options);
      },
      remove(name, options) {
        cookies().set(name, "", { ...options, maxAge: 0 });
      },
    },
  });
}

// For auth-aware functions/components in a server context
export async function createClientWithAuth() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables');
  }

  // Create a Supabase client that uses cookies from the request
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set(name, value, options);
      },
      remove(name, options) {
        cookieStore.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });
} 