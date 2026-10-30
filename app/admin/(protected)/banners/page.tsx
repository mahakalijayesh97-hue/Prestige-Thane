'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function AdminBannersPage() {
  const [rows, setRows] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from('banners').select('*').order('sort_order', { ascending: true });
    setRows((data as Banner[]) ?? []);
    setLoading(false);
  }

  async function add() {
    if (!title.trim() || !image.trim()) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from('banners').insert({
      title: title.trim(),
      image_url: image.trim(),
      link_url: link || null,
      sort_order: rows.length,
      is_active: true,
    });
    if (!error) {
      await logActivity('create', 'banner', title);
      setTitle(''); setImage(''); setLink('');
      setShowForm(false);
      load();
    }
  }

  async function toggle(id: string, active: boolean) {
    const supabase = getSupabaseBrowser();
    await supabase.from('banners').update({ is_active: active }).eq('id', id);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: active } : r)));
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete banner "${title}"?`)) return;
    const supabase = getSupabaseBrowser();
    await supabase.from('banners').delete().eq('id', id);
    await logActivity('delete', 'banner', title, id);
    load();
  }

  return (
    <div>
      <AdminHeader title="Banners" description="Manage homepage hero banners." backHref="/admin"
        action={<Button onClick={() => setShowForm((v) => !v)}><Plus className="mr-2 h-4 w-4" /> New banner</Button>} />

      {showForm && (
        <Card className="mb-6 space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Image URL</Label><Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." /></div>
            <div className="space-y-1.5"><Label>Link URL</Label><Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/about" /></div>
          </div>
          <Button onClick={add}><Save className="mr-2 h-4 w-4" /> Save banner</Button>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No banners yet.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image_url} alt={r.title} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{r.title}</h3>
                {r.link_url && <p className="text-xs text-muted-foreground">→ {r.link_url}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={r.is_active} onCheckedChange={(v) => toggle(r.id, v)} />
                    <span className="text-xs text-muted-foreground">{r.is_active ? 'Active' : 'Hidden'}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove(r.id, r.title)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}