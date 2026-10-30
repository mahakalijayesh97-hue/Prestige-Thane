import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co') as string;
const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key') as string;

// eslint-disable-next-line
type AnyClient = any;

let serverClient: AnyClient | null = null;

export function getSupabaseServer(): AnyClient {
  if (!serverClient) {
    try {
      serverClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase server client:', err);
      // Return a dummy safe proxy to prevent unhandled build crashes
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
  return serverClient;
}
