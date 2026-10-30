'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface Row {
  id: string;
  title: string;
  slug: string;
  status: string;
  author_name: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setRows((data as Row[]) ?? []);
      setLoading(false);
    });
  }, []);

  async function remove(id: string, title: string) {
    if (!confirm(`Delete post "${title}"?`)) return;
    const supabase = getSupabaseBrowser();
    await supabase.from('blog_posts').delete().eq('id', id);
    await logActivity('delete', 'blog_post', title, id);
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <div>
      <AdminHeader
        title="Blog"
        description="Manage news posts and articles."
        backHref="/admin"
        action={<Button asChild><Link href="/admin/blog/new"><Plus className="mr-2 h-4 w-4" /> New post</Link></Button>}
      />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No posts yet.</Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.author_name ?? '—'}</td>
                  <td className="px-4 py-3"><Badge variant={r.status === 'published' ? 'default' : 'secondary'}>{r.status}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="sm"><Link href={`/admin/blog/${r.id}`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="sm" onClick={() => remove(r.id, r.title)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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