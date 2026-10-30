import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co') as string;
const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key') as string;

// eslint-disable-next-line
type AnyClient = any;

let browserClient: AnyClient | null = null;

export function getSupabaseBrowser(): AnyClient {
  if (!browserClient) {
    try {
      browserClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase browser client:', err);
      return {
        from: () => ({
          select: () => ({
            limit: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
            eq: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
              order: async () => ({ data: [], error: null }),
              maybeSingle: async () => ({ data: null, error: null }),
            }),
            order: async () => ({ data: [], error: null }),
            maybeSingle: async () => ({ data: null, error: null }),
          }),
          insert: async () => ({ data: null, error: null }),
          update: () => ({ eq: async () => ({ data: null, error: null }) }),
          delete: () => ({ eq: async () => ({ data: null, error: null }) }),
        }),
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          signOut: async () => ({ error: null }),
        },
      };
    }
  }
  return browserClient;
}
