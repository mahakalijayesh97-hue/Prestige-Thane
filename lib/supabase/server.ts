import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '') as string;
const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '') as string;

// eslint-disable-next-line
type AnyClient = any;

let serverClient: AnyClient | null = null;

function createSafeSupabaseProxy(): AnyClient {
  const queryBuilder = (result: any = { data: [], count: 0, error: null }) => {
    const handler: any = {
      then(resolve: any, reject: any) {
        return Promise.resolve(result).then(resolve, reject);
      },
      catch(reject: any) {
        return Promise.resolve(result).catch(reject);
      },
    };

    const chainMethods = [
      'select', 'order', 'limit', 'range', 'filter', 'match',
      'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike',
      'is', 'in', 'contains', 'containedBy', 'not', 'or',
      'insert', 'update', 'upsert', 'delete',
    ];

    for (const m of chainMethods) {
      handler[m] = () => handler;
    }

    handler.single = async () => ({ data: null, error: null });
    handler.maybeSingle = async () => ({ data: null, error: null });

    return handler;
  };

  return {
    from: () => queryBuilder(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
}

export function getSupabaseServer(): AnyClient {
  if (!serverClient) {
    const isInvalidOrDeadUrl =
      !supabaseUrl ||
      supabaseUrl.includes('placeholder') ||
      supabaseUrl.includes('zlxefcngcfuotzzfteep');

    if (isInvalidOrDeadUrl) {
      serverClient = createSafeSupabaseProxy();
      return serverClient;
    }

    try {
      serverClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });
    } catch {
      serverClient = createSafeSupabaseProxy();
    }
  }
  return serverClient;
}
