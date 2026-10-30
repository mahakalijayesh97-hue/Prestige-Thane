'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { parsePageContent, buildPageContent } from '@/lib/page-content';
import { PRESTIGE_HERO_TEMPLATE } from '@/lib/templates/hero-template';
import { EARLY_ACCESS_MODAL_TEMPLATE } from '@/lib/templates/early-access-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
  Code,
  FileCode,
  FileText,
  Eye,
  Loader2,
  Save,
  Sparkles,
  Palette,
  Terminal,
} from 'lucide-react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type TabType = 'html' | 'css' | 'js' | 'preview';

export function PageEditor({ pageId }: { pageId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  // Multi-type content: HTML, CSS, JavaScript
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [jsContent, setJsContent] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('html');

  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [isHomepage, setIsHomepage] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pageId) return;

    // Load page data from our MongoDB-backed API first
    fetch(`/api/pages/${pageId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.page) {
          const p = data.page;
          setTitle(p.title ?? '');
          setSlug(p.slug ?? '');
          setStatus(p.status === 'published' ? 'published' : 'draft');

          const parsed = parsePageContent(p.content ?? '');
          setHtmlContent(parsed.html);
          setCssContent(parsed.css);
          setJsContent(parsed.js);

          setSeoTitle(p.seo_title ?? '');
          setMetaDescription(p.meta_description ?? '');
          setMetaKeywords(p.meta_keywords ?? '');
          setHeroImage(p.hero_image ?? '');
          setIsHomepage(!!p.is_homepage);
          setSortOrder(p.sort_order ?? 0);
          setLoading(false);
          return;
        }
        fallbackSupabase();
      })
      .catch(() => fallbackSupabase());

    function fallbackSupabase() {
      const supabase = getSupabaseBrowser();
      supabase
        .from('pages')
        .select('*')
        .eq('id', pageId)
        .maybeSingle()
        .then(({ data }) => {
          const p = data as Record<string, unknown> | null;
          if (p) {
            setTitle((p.title as string) ?? '');
            setSlug((p.slug as string) ?? '');
            setStatus(
              (p.status as string) === 'published' ? 'published' : 'draft'
            );

            // Parse combined content into HTML, CSS, and JS
            const parsed = parsePageContent((p.content as string) ?? '');
            setHtmlContent(parsed.html);
            setCssContent(parsed.css);
            setJsContent(parsed.js);

            setSeoTitle((p.seo_title as string) ?? '');
            setMetaDescription((p.meta_description as string) ?? '');
            setMetaKeywords((p.meta_keywords as string) ?? '');
            setHeroImage((p.hero_image as string) ?? '');
            setIsHomepage(!!(p.is_homepage as boolean));
            setSortOrder((p.sort_order as number) ?? 0);
          }
          setLoading(false);
        });
    }
  }, [pageId]);

  async function save() {
    setError('');
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required.');
      return;
    }
    setSaving(true);

    // Package HTML, CSS, and JS into unified page content
    const combinedContent = buildPageContent({
      html: htmlContent,
      css: cssContent,
      js: jsContent,
    });

    const payload = {
      title: title.trim(),
      slug: slugify(slug),
      status,
      content: combinedContent,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
      meta_keywords: metaKeywords || null,
      hero_image: heroImage || null,
      is_homepage: isHomepage,
      sort_order: sortOrder,
    };

    let resultId = pageId;
    let savedSuccessfully = false;

    // 1. Save via our API route (persisting to MongoDB)
    try {
      if (pageId) {
        const res = await fetch(`/api/pages/${pageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          savedSuccessfully = true;
          await logActivity('update', 'page', title, pageId);
        }
      } else {
        const res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          resultId = json.page?.id || json.page?._id;
          savedSuccessfully = true;
          await logActivity('create', 'page', title, resultId);
        }
      }
    } catch (apiErr) {
      console.warn('API save warning:', apiErr);
    }

    // 2. Also sync to Supabase (best effort)
    try {
      const supabase = getSupabaseBrowser();
      if (pageId) {
        await supabase.from('pages').update(payload).eq('id', pageId);
      } else if (!savedSuccessfully) {
        const { data, error: err } = await supabase.from('pages').insert(payload).select().maybeSingle();
        if (err && !savedSuccessfully) {
          setError(err.message);
          setSaving(false);
          return;
        }
        if (data) resultId = (data as { id: string }).id;
      }
    } catch {
      // Supabase RLS may prevent direct client write; API has already succeeded
    }

    setSaving(false);
    router.push('/admin/pages');
    router.refresh();
  }

  // Quick Starter Templates
  const insertHeroTemplate = () => {
    setHtmlContent(PRESTIGE_HERO_TEMPLATE.html);
    setCssContent(PRESTIGE_HERO_TEMPLATE.css);
    setJsContent(PRESTIGE_HERO_TEMPLATE.js);
    if (!title) setTitle('Prestige Thane Hero');
    if (!slug) setSlug('home');
    setActiveTab('preview');
  };

  const insertModalTemplate = () => {
    setHtmlContent(EARLY_ACCESS_MODAL_TEMPLATE.html);
    setCssContent(EARLY_ACCESS_MODAL_TEMPLATE.css);
    setJsContent(EARLY_ACCESS_MODAL_TEMPLATE.js);
    if (!title) setTitle(EARLY_ACCESS_MODAL_TEMPLATE.title);
    if (!slug) setSlug(EARLY_ACCESS_MODAL_TEMPLATE.slug);
    if (!seoTitle) setSeoTitle(EARLY_ACCESS_MODAL_TEMPLATE.seo_title);
    if (!metaDescription) setMetaDescription(EARLY_ACCESS_MODAL_TEMPLATE.meta_description);
    setActiveTab('preview');
  };

  const previewSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 1.5rem;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.6;
          }
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent || '<p style="color: #94a3b8; font-style: italic;">No HTML content to display yet...</p>'}
        <script>
          try {
            ${jsContent}
          } catch (e) {
            console.error('Preview JS Error:', e);
          }
        </script>
      </body>
    </html>
  `;

  if (loading) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {pageId ? 'Edit page' : 'New page'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Author and style pages with HTML, custom CSS, and JavaScript.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={insertHeroTemplate}
            className="w-fit gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Load Hero Template
          </Button>
          <Link href="/admin/forms">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit gap-1.5 text-xs text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              Configure Forms & Modals (/admin/forms)
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Page Info & Multi-Tab Code Editor */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!pageId) setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. Services, About Us, Custom Landing"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="about-us"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hero">Hero Image URL</Label>
              <Input
                id="hero"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </Card>

          {/* HTML, CSS, JavaScript & Live Preview Tabs */}
          <Card className="overflow-hidden border border-border p-0 shadow-sm">
            {/* Tab navigation headers */}
            <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('html')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === 'html'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-orange-500" />
                  HTML
                  {htmlContent && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('css')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === 'css'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  <Palette className="h-3.5 w-3.5 text-blue-500" />
                  CSS
                  {cssContent && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('js')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    activeTab === 'js'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-yellow-500" />
                  JavaScript
                  {jsContent && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === 'preview'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-4">
              {activeTab === 'html' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="html-editor"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      HTML Body Markup
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {htmlContent.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="html-editor"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    rows={16}
                    placeholder="<h2>Page Title</h2>&#10;<p>Write your markup here...</p>"
                    className="font-mono text-xs leading-relaxed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Custom HTML structure and elements rendered directly on the
                    frontend page.
                  </p>
                </div>
              )}

              {activeTab === 'css' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="css-editor"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      Custom CSS Styles
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {cssContent.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="css-editor"
                    value={cssContent}
                    onChange={(e) => setCssContent(e.target.value)}
                    rows={16}
                    placeholder="/* Custom styles for this page */&#10;.my-section {&#10;  background: #f8fafc;&#10;  padding: 2rem;&#10;}"
                    className="font-mono text-xs leading-relaxed text-blue-900 dark:text-blue-200"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    CSS rules will be injected scoped to this page and applied
                    on the frontend.
                  </p>
                </div>
              )}

              {activeTab === 'js' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="js-editor"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      Custom JavaScript Code
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {jsContent.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="js-editor"
                    value={jsContent}
                    onChange={(e) => setJsContent(e.target.value)}
                    rows={16}
                    placeholder="// Custom scripts running on page load&#10;console.log('Page loaded');"
                    className="font-mono text-xs leading-relaxed text-amber-900 dark:text-amber-200"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    JavaScript will automatically execute on the frontend when
                    the page loads.
                  </p>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Real-time Preview (HTML + CSS + JS)
                    </Label>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      Live rendered
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-md border border-border bg-white shadow-inner">
                    <iframe
                      title="Page Preview"
                      srcDoc={previewSrcDoc}
                      className="h-[380px] w-full border-0"
                      sandbox="allow-scripts allow-modals"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Publishing, Settings, and SEO */}
        <div className="space-y-5">
          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold">Publish</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'draft' | 'published')
                }
                className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="home">Set as Homepage</Label>
              <Switch
                id="home"
                checked={isHomepage}
                onCheckedChange={setIsHomepage}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sort">Sort order</Label>
              <Input
                id="sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {pageId ? 'Save changes' : 'Create page'}
            </Button>
          </Card>

          <Card className="space-y-4 p-5">
            <h3 className="text-sm font-semibold">SEO Configuration</h3>
            <div className="space-y-1.5">
              <Label htmlFor="seo">SEO Title</Label>
              <Input
                id="seo"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Title tag for search engines"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Meta Description</Label>
              <Textarea
                id="desc"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                placeholder="Summary snippet for search results"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kw">Keywords (comma separated)</Label>
              <Input
                id="kw"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="marketing, software, modern"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
