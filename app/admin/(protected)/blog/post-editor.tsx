'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [authorName, setAuthorName] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!postId) return;
    const supabase = getSupabaseBrowser();
    supabase.from('blog_posts').select('*').eq('id', postId).maybeSingle().then(({ data }) => {
      const p = data as Record<string, unknown> | null;
      if (p) {
        setTitle((p.title as string) ?? '');
        setSlug((p.slug as string) ?? '');
        setExcerpt((p.excerpt as string) ?? '');
        setContent((p.content as string) ?? '');
        setCoverImage((p.cover_image as string) ?? '');
        setStatus(((p.status as string) === 'published' ? 'published' : 'draft'));
        setAuthorName((p.author_name as string) ?? '');
        setSeoTitle((p.seo_title as string) ?? '');
        setMetaDescription((p.meta_description as string) ?? '');
      }
      setLoading(false);
    });
  }, [postId]);

  async function save() {
    setError('');
    if (!title.trim() || !slug.trim()) { setError('Title and slug are required.'); return; }
    setSaving(true);
    const supabase = getSupabaseBrowser();
    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      excerpt: excerpt || null,
      content,
      cover_image: coverImage || null,
      status,
      author_name: authorName || null,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
    };
    if (postId) {
      const { error: err } = await supabase.from('blog_posts').update(payload).eq('id', postId);
      if (err) { setError(err.message); setSaving(false); return; }
      await logActivity('update', 'blog_post', title, postId);
    } else {
      const { error: err } = await supabase.from('blog_posts').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
      await logActivity('create', 'blog_post', title);
    }
    setSaving(false);
    router.push('/admin/blog');
    router.refresh();
  }

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{postId ? 'Edit post' : 'New post'}</h1>
      {error && <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">{error}</div>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); if (!postId) setSlug(slugify(e.target.value)); }} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={14} className="font-mono text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cover">Cover image URL</Label>
              <Input id="cover" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold">Publish</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Status</Label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="author">Author</Label>
              <Input id="author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {postId ? 'Save changes' : 'Create post'}
            </Button>
          </Card>
          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold">SEO</h3>
            <div className="space-y-1.5">
              <Label htmlFor="seo">SEO title</Label>
              <Input id="seo" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Meta description</Label>
              <Textarea id="desc" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}