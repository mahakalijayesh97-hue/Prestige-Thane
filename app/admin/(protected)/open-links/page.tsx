'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Link2,
  Plus,
  Trash2,
  Pencil,
  Edit,
  ExternalLink,
  Code,
  FileCode,
  Eye,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowDownCircle,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  Copy,
  FolderPlus,
  Play,
  PanelTop,
} from 'lucide-react';

interface OpenLinkItem {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  url: string;
  link_type: 'page' | 'scroller' | 'external';
  target: '_self' | '_blank';
  html: string;
  css: string;
  js: string;
  content: string;
  status: 'draft' | 'published';
  is_active: boolean;
  add_to_navbar: boolean;
  sort_order: number;
  updated_at?: string;
}

type TabType = 'html' | 'css' | 'js' | 'preview';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminOpenLinksPage() {
  const [links, setLinks] = useState<OpenLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form mode: null = list only, 'new' = creating new, or link item to edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [url, setUrl] = useState('');
  const [target, setTarget] = useState<'_self' | '_blank'>('_self');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  // Content code editor states
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [jsContent, setJsContent] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  // Determine link type from URL in real-time
  const detectedType: 'scroller' | 'page' | 'external' = url.trim().startsWith('#')
    ? 'scroller'
    : url.trim().startsWith('/')
    ? 'page'
    : 'external';

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);
    try {
      const res = await fetch('/api/open-links', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch (err) {
      console.error('Failed to load links:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleStartNew() {
    setEditingId('new');
    setTitle('');
    setSlug('');
    setUrl('/');
    setTarget('_self');
    setStatus('published');
    setHtmlContent('');
    setCssContent('');
    setJsContent('');
    setIsContentEditorOpen(false);
    setActiveTab('html');
    setIsEditorOpen(true);
  }

  function handleEdit(item: OpenLinkItem) {
    setEditingId(item._id);
    setTitle(item.title);
    setSlug(item.slug);
    setUrl(item.url);
    setTarget(item.target || '_self');
    setStatus(item.status || 'published');
    setHtmlContent(item.html || '');
    setCssContent(item.css || '');
    setJsContent(item.js || '');
    setIsContentEditorOpen(!!(item.html || item.css || item.js));
    setActiveTab('html');
    setIsEditorOpen(true);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!editingId || editingId === 'new') {
      const autoSlug = slugify(val);
      setSlug(autoSlug);
      // Auto-set URL if user hasn't explicitly customized it
      if (url === '' || url === '/' || url === `#${slug}`) {
        setUrl(`/${autoSlug}`);
      }
    }
  }

  // Quick URL prefix formatters
  function setUrlAsPageLink() {
    const clean = slug ? slug : slugify(title || 'page');
    setUrl(`/${clean}`);
  }

  function setUrlAsScroller() {
    const clean = slug ? slug : slugify(title || 'section');
    setUrl(`#${clean}`);
  }

  // Apply Section Templates
  function applyTemplate(type: 'contact' | 'scroller' | 'blank') {
    if (type === 'contact') {
      setHtmlContent(`<!-- Contact & Inquiry Section -->
<section id="${slug || 'contact'}" class="py-16 px-4 max-w-4xl mx-auto font-sans">
  <div class="text-center mb-8">
    <span class="text-xs uppercase tracking-widest text-primary font-semibold">Get In Touch</span>
    <h2 class="text-3xl font-bold mt-2">Connect With Prestige Thane Advisor</h2>
    <p class="text-muted-foreground mt-2">Have questions? Fill out the form or schedule an instant private site visit.</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Prestige Sales Lounge</h3>
      <p class="text-sm text-muted-foreground">Balkum, Kapurbawadi Junction, Thane West, Maharashtra 400607</p>
      
      <div class="pt-4 space-y-2">
        <div class="flex items-center gap-3 text-sm">
          <span class="font-medium text-foreground">Phone:</span>
          <a href="tel:+919022222448" class="text-primary hover:underline font-semibold">+91 90222 22448</a>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <span class="font-medium text-foreground">Hours:</span>
          <span>Mon - Sun: 9:30 AM - 7:30 PM</span>
        </div>
      </div>
    </div>
    
    <form class="space-y-4" onsubmit="event.preventDefault(); alert('Inquiry sent successfully!');">
      <div>
        <label class="block text-xs font-medium mb-1">Your Name</label>
        <input type="text" placeholder="John Doe" required class="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div>
        <label class="block text-xs font-medium mb-1">Phone Number</label>
        <input type="tel" placeholder="+91 98765 43210" required class="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <button type="submit" class="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
        Request Callback
      </button>
    </form>
  </div>
</section>`);
      setCssContent(`/* Contact Section Smooth Transitions */
#${slug || 'contact'} {
  scroll-margin-top: 5rem;
}
#${slug || 'contact'} input:focus {
  border-color: hsl(var(--primary));
}`);
      setJsContent(`console.log('Contact section loaded for ${title || 'Prestige'}');`);
    } else if (type === 'scroller') {
      setHtmlContent(`<!-- Smooth Scroller Section -->
<section id="${slug || 'section'}" class="py-20 px-6 max-w-5xl mx-auto">
  <div class="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-background p-8 md:p-12 text-center">
    <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-4">
      Featured Scroller Section
    </span>
    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
      ${title || 'Exclusive Highlights'}
    </h2>
    <p class="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
      This section is directly targeted via smooth scroller link <code>#${slug || 'section'}</code>.
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <a href="#top" class="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90">
        Back to Top
      </a>
    </div>
  </div>
</section>`);
      setCssContent(`#${slug || 'section'} {
  scroll-margin-top: 5rem;
  transition: all 0.3s ease-in-out;
}`);
      setJsContent(`// Smooth scroll handler
console.log('Scroller target #${slug || 'section'} initialized.');`);
    } else {
      setHtmlContent('');
      setCssContent('');
      setJsContent('');
    }
    setPreviewKey((k) => k + 1);
  }

  // Generate combined HTML for Live Preview
  function getPreviewHtml() {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #111827; }
    ${cssContent}
  </style>
</head>
<body class="p-4 sm:p-6 min-h-screen">
  ${htmlContent || '<div class="text-center py-20 text-gray-400">Add HTML content in the editor to see live preview.</div>'}
  <script>
    try {
      ${jsContent}
    } catch(err) {
      console.error('Preview JS error:', err);
    }
  </script>
</body>
</html>`;
  }

  async function handleSave() {
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Please enter a title for the link.' });
      return;
    }
    if (!url.trim()) {
      setMessage({ type: 'error', text: 'Please enter a URL (e.g. /my-link or #section).' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload = {
      title: title.trim(),
      slug: slugify(slug || title),
      url: url.trim(),
      target,
      status,
      html: htmlContent,
      css: cssContent,
      js: jsContent,
    };

    try {
      let res;
      if (editingId && editingId !== 'new') {
        res = await fetch(`/api/open-links/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/open-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setMessage({ type: 'success', text: 'Open link saved successfully!' });
        await loadLinks();
        setIsEditorOpen(false);
        setEditingId(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save open link.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, itemTitle: string) {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) return;
    try {
      const res = await fetch(`/api/open-links/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLinks((prev) => prev.filter((item) => item._id !== id));
        if (editingId === id) {
          setIsEditorOpen(false);
          setEditingId(null);
        }
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      alert('Error deleting link.');
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <AdminHeader
        title="Open Links & Scroller Pages"
        description="Create and manage custom links: Page routes (/link) and Smooth Scrollers (#section) with HTML, CSS, JS code and Live Preview."
        backHref="/admin"
        action={
          isEditorOpen ? (
            <Button variant="outline" onClick={() => setIsEditorOpen(false)} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Back to Links
            </Button>
          ) : (
            <Button onClick={handleStartNew} className="gap-2">
              <Plus className="h-4 w-4" /> New Open Link
            </Button>
          )
        }
      />

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Editor Modal / Panel */}
      {isEditorOpen && (
        <Card className="p-6 border-2 border-primary/30 shadow-lg space-y-6 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                {editingId === 'new' ? 'Create New Open Link' : 'Edit Open Link'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure Title, Slug, URL (/ for Page or # for Scroller), and Custom Code.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Link'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="link-title" className="text-sm font-semibold">
                Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="link-title"
                placeholder="e.g. Contact Us, Gallery, Pricing..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="font-medium"
              />
              <p className="text-[11px] text-muted-foreground">The display label for this link.</p>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="link-slug" className="text-sm font-semibold">
                Slug <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="link-slug"
                placeholder="e.g. contact-us"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
              <p className="text-[11px] text-muted-foreground">Unique identifier used for URL and anchors.</p>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="link-url" className="text-sm font-semibold">
                  URL <span className="text-rose-500">*</span>
                </Label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={setUrlAsPageLink}
                    className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-500/20"
                    title="Prefix with / for Page Link"
                  >
                    / Page
                  </button>
                  <button
                    type="button"
                    onClick={setUrlAsScroller}
                    className="text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-500/20"
                    title="Prefix with # for Smooth Scroller"
                  >
                    # Scroll
                  </button>
                </div>
              </div>
              <Input
                id="link-url"
                placeholder="/page or #section"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono text-sm"
              />
              <div className="flex items-center gap-2 pt-1">
                {detectedType === 'scroller' ? (
                  <Badge className="bg-blue-600/15 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 py-0.5">
                    <ArrowDownCircle className="h-3 w-3" />
                    Smooth Scroller (#section)
                  </Badge>
                ) : detectedType === 'page' ? (
                  <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1 py-0.5">
                    <FileText className="h-3 w-3" />
                    Page Link (/route)
                  </Badge>
                ) : (
                  <Badge className="bg-purple-600/15 text-purple-700 dark:text-purple-300 border-purple-500/30 gap-1 py-0.5">
                    <ExternalLink className="h-3 w-3" />
                    External Link
                  </Badge>
                )}
                <span className="text-[11px] text-muted-foreground">
                  {detectedType === 'scroller'
                    ? 'Scrolls smoothly down on the current page'
                    : detectedType === 'page'
                    ? 'Navigates to dedicated page'
                    : 'Opens custom address'}
                </span>
              </div>
            </div>
          </div>

          {/* Target & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
            {/* Target */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Open In (Target)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={target === '_self' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTarget('_self')}
                  className="flex-1 text-xs"
                >
                  Same Tab (_self)
                </Button>
                <Button
                  type="button"
                  variant={target === '_blank' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTarget('_blank')}
                  className="flex-1 text-xs"
                >
                  New Tab (_blank)
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {target === '_blank' ? 'Opens in a new browser tab' : 'Opens in the same browser window'}
              </p>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Status (Publication)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={status === 'published' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus('published')}
                  className={`flex-1 text-xs font-semibold ${
                    status === 'published' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                  }`}
                >
                  Published (Live)
                </Button>
                <Button
                  type="button"
                  variant={status === 'draft' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus('draft')}
                  className={`flex-1 text-xs font-semibold ${
                    status === 'draft' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''
                  }`}
                >
                  Draft (Hidden)
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {status === 'published'
                  ? 'Live & visible on the website and in Footer Quick Links'
                  : 'Hidden from website and footer until switched to Published'}
              </p>
            </div>
          </div>

          {/* THE CODE / CONTENT EDITOR TOGGLE BUTTON */}
          <div className="pt-2 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  HTML, CSS, JavaScript & Live Preview Content
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click the button to open or edit custom code for this link.
                </p>
              </div>
              <Button
                type="button"
                variant={isContentEditorOpen ? 'default' : 'outline'}
                onClick={() => setIsContentEditorOpen(!isContentEditorOpen)}
                className="gap-2 font-medium"
              >
                <FileCode className="h-4 w-4" />
                {isContentEditorOpen ? 'Hide Code Editor' : 'Open Code & Content Editor'}
              </Button>
            </div>

            {/* EXPANDED CONTENT / CODE EDITOR */}
            {isContentEditorOpen && (
              <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden shadow-md">
                {/* Editor Header & Tabs */}
                <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/40 px-4 py-2 gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('html')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        activeTab === 'html'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Code className="h-3.5 w-3.5" /> HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('css')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        activeTab === 'css'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" /> CSS
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('js')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        activeTab === 'js'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Play className="h-3.5 w-3.5" /> JavaScript
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('preview');
                        setPreviewKey((k) => k + 1);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        activeTab === 'preview'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" /> Live Preview
                    </button>
                  </div>

                  {/* Preset Templates */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">Templates:</span>
                    <button
                      type="button"
                      onClick={() => applyTemplate('contact')}
                      className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 font-medium"
                    >
                      Contact Section
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate('scroller')}
                      className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 font-medium"
                    >
                      Scroller Section
                    </button>
                  </div>
                </div>

                {/* Tab Contents */}
                <div className="p-4">
                  {activeTab === 'html' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Custom HTML markup (Tailwind classes supported)
                        </Label>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {htmlContent.length} chars
                        </span>
                      </div>
                      <Textarea
                        value={htmlContent}
                        onChange={(e) => {
                          setHtmlContent(e.target.value);
                          setPreviewKey((k) => k + 1);
                        }}
                        placeholder="<section id='contact' class='py-12'>...</section>"
                        rows={14}
                        className="font-mono text-xs leading-relaxed resize-y bg-muted/20"
                      />
                    </div>
                  )}

                  {activeTab === 'css' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Custom CSS Styles (scoped to this section/page)
                        </Label>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {cssContent.length} chars
                        </span>
                      </div>
                      <Textarea
                        value={cssContent}
                        onChange={(e) => {
                          setCssContent(e.target.value);
                          setPreviewKey((k) => k + 1);
                        }}
                        placeholder="/* Custom CSS */&#10;.custom-box { border-radius: 12px; }"
                        rows={14}
                        className="font-mono text-xs leading-relaxed resize-y bg-muted/20"
                      />
                    </div>
                  )}

                  {activeTab === 'js' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-muted-foreground">
                          Custom JavaScript / Scroll Triggers
                        </Label>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {jsContent.length} chars
                        </span>
                      </div>
                      <Textarea
                        value={jsContent}
                        onChange={(e) => {
                          setJsContent(e.target.value);
                          setPreviewKey((k) => k + 1);
                        }}
                        placeholder="// Custom JavaScript&#10;console.log('OpenLink JS loaded');"
                        rows={14}
                        className="font-mono text-xs leading-relaxed resize-y bg-muted/20"
                      />
                    </div>
                  )}

                  {activeTab === 'preview' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-1.5 rounded ${
                              previewDevice === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                            }`}
                            title="Desktop View"
                          >
                            <Monitor className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('tablet')}
                            className={`p-1.5 rounded ${
                              previewDevice === 'tablet' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                            }`}
                            title="Tablet View"
                          >
                            <Tablet className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-1.5 rounded ${
                              previewDevice === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                            }`}
                            title="Mobile View"
                          >
                            <Smartphone className="h-4 w-4" />
                          </button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewKey((k) => k + 1)}
                          className="text-xs gap-1 h-7"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Refresh Preview
                        </Button>
                      </div>

                      <div className="flex justify-center bg-muted/30 p-4 rounded-xl border border-border overflow-hidden">
                        <iframe
                          key={previewKey}
                          ref={previewIframeRef}
                          srcDoc={getPreviewHtml()}
                          title="Live Preview"
                          className={`rounded-lg border border-border bg-white shadow transition-all duration-200 ${
                            previewDevice === 'mobile'
                              ? 'w-[375px] h-[550px]'
                              : previewDevice === 'tablet'
                              ? 'w-[768px] h-[550px]'
                              : 'w-full h-[550px]'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Open Link'}
            </Button>
          </div>
        </Card>
      )}

      {/* List of existing Open Links - ONLY shown when NOT creating/editing */}
      {!isEditorOpen && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Active Open Links ({links.length})</h3>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading open links...</p>
          ) : links.length === 0 ? (
            <Card className="p-12 text-center space-y-4 border-dashed">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Link2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold">No Open Links Yet</h4>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                  Create your first Open Link to add a Page route (/link) or a smooth scroller section (#section).
                </p>
              </div>
              <Button onClick={handleStartNew} className="gap-2">
                <Plus className="h-4 w-4" /> Create First Open Link
              </Button>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Title & Slug</th>
                    <th className="px-4 py-3">URL & Type</th>
                    <th className="px-4 py-3">Open In</th>
                    <th className="px-4 py-3">Content Code</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {links.map((item) => (
                    <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground font-mono">slug: {item.slug}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={item.url}
                            target={item.target || undefined}
                            className="font-mono text-xs font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded hover:underline hover:text-primary transition"
                            title="Click to visit link"
                          >
                            {item.url}
                          </Link>
                          {item.url.startsWith('#') ? (
                            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[10px] py-0">
                              # Scroller
                            </Badge>
                          ) : item.url.startsWith('/') ? (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] py-0">
                              / Page
                            </Badge>
                          ) : (
                            <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px] py-0">
                              External
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {item.target === '_blank' ? (
                          <Badge variant="outline" className="text-[10px] py-0">
                            New Tab
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Same Tab</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {item.html || item.css || item.js ? (
                          <Badge variant="outline" className="text-[10px] gap-1 text-primary border-primary/40 bg-primary/5">
                            <Code className="h-3 w-3" />
                            Custom Code
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={item.status === 'published' ? 'default' : 'secondary'}
                          className={`text-[10px] capitalize ${
                            item.status === 'published'
                              ? 'bg-emerald-600 hover:bg-emerald-600'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item._id, item.title)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
