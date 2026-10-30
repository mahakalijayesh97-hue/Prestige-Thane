import { getSupabaseBrowser } from './supabase/browser';

export async function logActivity(action: string, entity?: string, details?: string, entityId?: string) {
  const supabase = getSupabaseBrowser();
  const { data: userData } = await supabase.auth.getUser();
  await supabase.from('activity_logs').insert({
    action,
    entity: entity ?? null,
    entity_id: entityId ?? null,
    details: details ?? null,
    admin_email: userData.user?.email ?? null,
  });
}
