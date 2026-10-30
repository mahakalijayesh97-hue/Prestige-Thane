'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  FileCode,
  Palette,
  Terminal,
  Eye,
  CheckCircle2,
  Sparkles,
  Loader2,
  Layers,
} from 'lucide-react';

interface Col {
  id: string;
  title: string;
  sort_order: number;
}

interface LinkItem {
  id: string;
  label: string;
  url: string;
  column_id: string;
  sort_order: number;
}

type TabType = 'html' | 'css' | 'js' | 'preview';

export default function AdminFooterPage() {
  const [columns, setColumns] = useState<Col[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCol, setNewCol] = useState('');

  // Custom Footer State (Image, HTML, CSS, JS)
  const [footerImage, setFooterImage] = useState('');
  const [customHtml, setCustomHtml] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  const [showDefaultLinks, setShowDefaultLinks] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [savingCustom, setSavingCustom] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    load();
    loadCustomSettings();
  }, []);

  async function load() {
    setLoading(true);
    const supabase = getSupabaseBrowser();
    const [c, l] = await Promise.all([
      supabase
        .from('footer_columns')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase
        .from('footer_links')
        .select('*')
        .order('sort_order', { ascending: true }),
    ]);
    setColumns((c.data as Col[]) ?? []);
    setLinks((l.data as LinkItem[]) ?? []);
    setLoading(false);
  }

  async function loadCustomSettings() {
    try {
      const res = await fetch('/api/footer/custom');
      if (res.ok) {
        const data = await res.json();
        setFooterImage(data.footer_image || '');
        setCustomHtml(data.custom_html || '');
        setCustomCss(data.custom_css || '');
        setCustomJs(data.custom_js || '');
        setShowDefaultLinks(data.show_default_links !== false);
      }
    } catch (err) {
      console.error('Failed to load custom footer settings:', err);
    }
  }

  async function saveCustomSettings() {
    setSavingCustom(true);
    try {
      const res = await fetch('/api/footer/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footer_image: footerImage,
          custom_html: customHtml,
          custom_css: customCss,
          custom_js: customJs,
          show_default_links: showDefaultLinks,
        }),
      });

      if (res.ok) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
        await logActivity('update', 'footer', 'Custom footer settings updated');
      }
    } catch (err) {
      console.error('Error saving custom footer:', err);
    } finally {
      setSavingCustom(false);
    }
  }

  // Load Demo Footer Widget template
  const loadDemoTemplate = () => {
    setFooterImage(
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
    );
    setCustomHtml(
      `<div class="custom-footer-promo">\n  <div class="promo-content">\n    <h3>✨ Stay Updated with Acme CMS</h3>\n    <p>Join over 10,000+ creators building fast, modern websites.</p>\n  </div>\n  <div class="promo-form">\n    <input type="email" placeholder="Enter your email" id="footer-newsletter-input" />\n    <button id="footer-subscribe-btn">Subscribe</button>\n  </div>\n  <div id="footer-status-msg"></div>\n</div>\n<div class="footer-scroll-top">\n  <button id="scroll-top-btn" title="Back to top">↑ Top</button>\n</div>`
    );
    setCustomCss(
      `.custom-footer-promo {\n  background: linear-gradient(135deg, #0f172a, #1e293b);\n  color: #fff;\n  border-radius: 1rem;\n  padding: 2rem;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1.5rem;\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.promo-content h3 {\n  margin: 0 0 0.4rem 0;\n  font-size: 1.25rem;\n  color: #38bdf8;\n}\n.promo-content p {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.875rem;\n}\n.promo-form {\n  display: flex;\n  gap: 0.5rem;\n}\n.promo-form input {\n  padding: 0.6rem 1rem;\n  border-radius: 0.5rem;\n  border: 1px solid #334155;\n  background: #0f172a;\n  color: #fff;\n  font-size: 0.875rem;\n  outline: none;\n}\n.promo-form button {\n  padding: 0.6rem 1.25rem;\n  border-radius: 0.5rem;\n  background: #38bdf8;\n  color: #0f172a;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: opacity 0.2s;\n}\n.promo-form button:hover {\n  opacity: 0.9;\n}\n.footer-scroll-top {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 1rem;\n}\n#scroll-top-btn {\n  background: transparent;\n  color: #64748b;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.5rem;\n  padding: 0.35rem 0.75rem;\n  font-size: 0.75rem;\n  cursor: pointer;\n}`
    );
    setCustomJs(
      `const subBtn = document.getElementById('footer-subscribe-btn');\nconst emailInput = document.getElementById('footer-newsletter-input');\nconst statusMsg = document.getElementById('footer-status-msg');\nconst scrollTopBtn = document.getElementById('scroll-top-btn');\n\nif (subBtn && emailInput && statusMsg) {\n  subBtn.onclick = () => {\n    if (!emailInput.value) {\n      statusMsg.textContent = 'Please enter an email!';\n      statusMsg.style.color = '#ef4444';\n      return;\n    }\n    statusMsg.textContent = '🎉 Thank you for subscribing!';\n    statusMsg.style.color = '#22c55e';\n    emailInput.value = '';\n  };\n}\n\nif (scrollTopBtn) {\n  scrollTopBtn.onclick = () => {\n    window.scrollTo({ top: 0, behavior: 'smooth' });\n  };\n}`
    );
    setActiveTab('preview');
  };

  const previewSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 1.5rem;
            color: #1e293b;
            background: #f8fafc;
          }
          .preview-banner {
            width: 100%;
            max-height: 160px;
            object-fit: cover;
            border-radius: 0.75rem;
            margin-bottom: 1.5rem;
          }
          ${customCss}
        </style>
      </head>
      <body>
        ${
          footerImage
            ? `<img src="${footerImage}" class="preview-banner" alt="Footer Banner" />`
            : ''
        }
        ${
          customHtml ||
          '<p style="color: #94a3b8; font-style: italic;">No custom HTML to preview...</p>'
        }
        <script>
          try {
            ${customJs}
          } catch(e) {
            console.error('Footer preview script error:', e);
          }
        </script>
      </body>
    </html>
  `;

  // Standard column & link operations
  async function addColumn() {
    if (!newCol.trim()) return;
    const supabase = getSupabaseBrowser();
    const { error } = await supabase
      .from('footer_columns')
      .insert({ title: newCol.trim(), sort_order: columns.length });
    if (!error) {
      await logActivity('create', 'footer_column', newCol);
      setNewCol('');
      load();
    }
  }

  async function updateCol(id: string, title: string) {
    const supabase = getSupabaseBrowser();
    await supabase.from('footer_columns').update({ title }).eq('id', id);
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }

  async function removeCol(id: string, title: string) {
    if (!confirm(`Delete column "${title}" and all its links?`)) return;
    const supabase = getSupabaseBrowser();
    await supabase.from('footer_columns').delete().eq('id', id);
    await logActivity('delete', 'footer_column', title, id);
    load();
  }

  async function addLink(colId: string, label: string, url: string) {
    if (!label.trim()) return;
    const supabase = getSupabaseBrowser();
    const colLinks = links.filter((l) => l.column_id === colId);
    const { error } = await supabase.from('footer_links').insert({
      label: label.trim(),
      url: url || '/',
      column_id: colId,
      sort_order: colLinks.length,
    });
    if (!error) {
      await logActivity('create', 'footer_link', label);
      load();
    }
  }

  async function updateLink(
    id: string,
    field: 'label' | 'url',
    value: string
  ) {
    const supabase = getSupabaseBrowser();
    await supabase.from('footer_links').update({ [field]: value }).eq('id', id);
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  }

  async function removeLink(id: string, label: string) {
    const supabase = getSupabaseBrowser();
    await supabase.from('footer_links').delete().eq('id', id);
    await logActivity('delete', 'footer_link', label, id);
    load();
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <AdminHeader
            title="Footer"
            description="Manage footer columns, links, custom banner images, and custom HTML/CSS/JavaScript."
            backHref="/admin"
          />
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-600 shadow-sm animate-in fade-in dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Footer settings saved & live!</span>
          </div>
        )}
      </div>

      {/* SECTION 1: CUSTOM FOOTER (Image + HTML, CSS, JS) */}
      <Card className="overflow-hidden border-border p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Footer Image & Code
              Customizer
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add a footer banner image, custom HTML markup, CSS styling, and
              JavaScript interactivity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadDemoTemplate}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Load Demo
              Widget
            </Button>
            <Button
              onClick={saveCustomSettings}
              disabled={savingCustom}
              className="gap-1.5"
            >
              {savingCustom ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Footer Customization
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Footer Image / Banner Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="footer-img"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <ImageIcon className="h-4 w-4 text-primary" /> Footer Banner /
                Image URL
              </Label>
              {footerImage && (
                <span className="text-xs text-muted-foreground">
                  Image linked
                </span>
              )}
            </div>
            <Input
              id="footer-img"
              value={footerImage}
              onChange={(e) => setFooterImage(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://yoursite.com/banner.png"
            />
            {footerImage && (
              <div className="mt-2 overflow-hidden rounded-lg border border-border/60 bg-muted/20 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={footerImage}
                  alt="Footer Preview"
                  className="h-28 w-full object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* HTML, CSS, JS Tabs */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
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
                  {customHtml && (
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
                  {customCss && (
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
                  {customJs && (
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
                Live Footer Preview
              </button>
            </div>

            <div className="p-4">
              {activeTab === 'html' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="custom-footer-html"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Footer HTML Structure
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {customHtml.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="custom-footer-html"
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    rows={12}
                    placeholder="<div class='custom-footer-box'>...</div>"
                    className="font-mono text-xs leading-relaxed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Custom HTML elements rendered across all website pages inside
                    the footer.
                  </p>
                </div>
              )}

              {activeTab === 'css' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="custom-footer-css"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Footer CSS Styles
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {customCss.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="custom-footer-css"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    rows={12}
                    placeholder="/* Custom styles for footer */&#10;.custom-footer-promo { background: #111; color: #fff; }"
                    className="font-mono text-xs leading-relaxed text-blue-900 dark:text-blue-200"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    CSS rules injected and applied to the footer styling on the
                    frontend.
                  </p>
                </div>
              )}

              {activeTab === 'js' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="custom-footer-js"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Footer JavaScript
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {customJs.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="custom-footer-js"
                    value={customJs}
                    onChange={(e) => setCustomJs(e.target.value)}
                    rows={12}
                    placeholder="// Footer scripts&#10;console.log('Footer ready');"
                    className="font-mono text-xs leading-relaxed text-amber-900 dark:text-amber-200"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Client JavaScript automatically executed when the footer loads.
                  </p>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Live Preview (Banner Image + HTML + CSS + JS)
                    </Label>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      Live rendered
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-md border border-border bg-white shadow-inner">
                    <iframe
                      title="Footer Preview"
                      srcDoc={previewSrcDoc}
                      className="h-[300px] w-full border-0"
                      sandbox="allow-scripts allow-modals"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Toggle default footer columns */}
          <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-4 py-3">
            <div>
              <Label
                htmlFor="toggle-links"
                className="text-sm font-medium cursor-pointer"
              >
                Show Standard Columns & Links
              </Label>
              <p className="text-xs text-muted-foreground">
                Display the 3-column navigation links below your custom footer
                content.
              </p>
            </div>
            <Switch
              id="toggle-links"
              checked={showDefaultLinks}
              onCheckedChange={setShowDefaultLinks}
            />
          </div>
        </div>
      </Card>

      {/* SECTION 2: FOOTER COLUMNS & LINKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Footer Columns & Link
            Directories
          </h2>
        </div>

        {/* Add column header */}
        <Card className="flex items-end gap-3 p-4 border-border shadow-sm">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="nc">New Column Title</Label>
            <Input
              id="nc"
              value={newCol}
              onChange={(e) => setNewCol(e.target.value)}
              placeholder="e.g. Products, Support, Community"
            />
          </div>
          <Button onClick={addColumn}>
            <Plus className="mr-2 h-4 w-4" /> Add Column
          </Button>
        </Card>

        {loading ? (
          <Card className="p-12 text-center text-sm text-muted-foreground">
            Loading footer columns...
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((col) => (
              <Card key={col.id} className="p-4 shadow-sm border-border">
                <div className="mb-3 flex items-center gap-2">
                  <Input
                    value={col.title}
                    onChange={(e) => updateCol(col.id, e.target.value)}
                    className="font-semibold text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCol(col.id, col.title)}
                    className="text-destructive hover:bg-destructive/10"
                    title="Delete column"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <ul className="space-y-2">
                  {links
                    .filter((l) => l.column_id === col.id)
                    .map((link) => (
                      <li key={link.id} className="flex items-center gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            updateLink(link.id, 'label', e.target.value)
                          }
                          className="w-32 text-xs"
                          placeholder="Label"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            updateLink(link.id, 'url', e.target.value)
                          }
                          className="flex-1 text-xs font-mono"
                          placeholder="/url"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLink(link.id, link.label)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          title="Delete link"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </li>
                    ))}
                  {links.filter((l) => l.column_id === col.id).length === 0 && (
                    <li className="py-2 text-center text-xs text-muted-foreground/60">
                      No links in this column yet.
                    </li>
                  )}
                </ul>

                <AddLink
                  onAdd={(label, url) => addLink(col.id, label, url)}
                />
              </Card>
            ))}
            {columns.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No footer columns yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddLink({
  onAdd,
}: {
  onAdd: (label: string, url: string) => void;
}) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('/');
  return (
    <div className="mt-3 flex gap-2 border-t border-border pt-3">
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Link label"
        className="text-xs"
      />
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="/url"
        className="text-xs font-mono"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          onAdd(label, url);
          setLabel('');
          setUrl('/');
        }}
        title="Add link to column"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
