'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Pencil, Plus, Trash2, Globe, FileEdit } from 'lucide-react';

interface Row {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_homepage: boolean;
  updated_at: string;
}

let cachedPagesList: Row[] | null = null;

export default function AdminPagesPage() {
  const [rows, setRows] = useState<Row[]>(() => cachedPagesList || []);
  const [loading, setLoading] = useState(() => !cachedPagesList);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (!cachedPagesList) setLoading(true);
    try {
      const res = await fetch('/api/pages', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.pages) {
          cachedPagesList = json.pages;
          setRows(json.pages);
          setLoading(false);
          return;
        }
      }
    } catch {
      // fallback to Supabase
    }
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.from('pages').select('*').order('sort_order', { ascending: true });
    if (data) {
      cachedPagesList = data as Row[];
      setRows(data as Row[]);
    }
    setLoading(false);
  }

  const filtered = rows.filter((r) => filter === 'all' || r.status === filter);

  async function remove(id: string, title: string) {
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' });
    } catch {
      const supabase = getSupabaseBrowser();
      await supabase.from('pages').delete().eq('id', id);
    }
    await logActivity('delete', 'page', title, id);
    load();
  }

  return (
    <div>
      <AdminHeader
        title="Pages"
        description="Create and manage site pages."
        backHref="/admin"
        action={<Button asChild><Link href="/admin/pages/new"><Plus className="mr-2 h-4 w-4" /> New page</Link></Button>}
      />

      <div className="mb-4 flex gap-1 rounded-lg border border-border bg-card p-1">
        {(['all', 'published', 'draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
              filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No pages found. Create your first page.</Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium">
                      {r.is_homepage && <Globe className="h-4 w-4 text-primary" />}
                      {r.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">/{r.slug}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === 'published' ? 'default' : 'secondary'}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/pages/${r.id}`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      {!r.is_homepage && (
                        <Button variant="ghost" size="sm" onClick={() => remove(r.id, r.title)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}