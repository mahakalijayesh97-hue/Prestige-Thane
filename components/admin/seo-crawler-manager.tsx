'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Bot,
  FileCode,
  FileText,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Shield,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
} from 'lucide-react';

interface SeoStats {
  published_pages_count: number;
  blog_posts_count: number;
  total_sitemap_urls: number;
  base_url: string;
}

export function SeoCrawlerManager() {
  const [activeTab, setActiveTab] = useState<'robots' | 'llms' | 'sitemap'>('robots');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [generatingLlms, setGeneratingLlms] = useState(false);

  const [robotsTxt, setRobotsTxt] = useState('');
  const [llmsTxt, setLlmsTxt] = useState('');
  const [sitemapCustomUrls, setSitemapCustomUrls] = useState('');
  const [sitemapAutoSync, setSitemapAutoSync] = useState(true);
  const [stats, setStats] = useState<SeoStats>({
    published_pages_count: 0,
    blog_posts_count: 0,
    total_sitemap_urls: 1,
    base_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/seo', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setRobotsTxt(data.robots_txt || '');
        setLlmsTxt(data.llms_txt || '');
        setSitemapCustomUrls(data.sitemap_custom_urls || '');
        setSitemapAutoSync(data.sitemap_auto_sync !== false);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load SEO settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robots_txt: robotsTxt,
          llms_txt: llmsTxt,
          sitemap_custom_urls: sitemapCustomUrls,
          sitemap_auto_sync: sitemapAutoSync,
        }),
      });

      if (res.ok) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save SEO settings:', err);
    } finally {
      setSaving(false);
    }
  }

  async function generateLlmsFromSite() {
    setGeneratingLlms(true);
    try {
      const res = await fetch('/api/settings/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_llms' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.llms_txt) {
          setLlmsTxt(data.llms_txt);
        }
      }
    } catch (err) {
      console.error('Failed to generate llms.txt:', err);
    } finally {
      setGeneratingLlms(false);
    }
  }

  function applyRobotsPreset(type: 'production' | 'allow_all' | 'block_all') {
    const sitemapUrl = stats.base_url ? `${stats.base_url}/sitemap.xml` : 'https://prestige-thane.vercel.app/sitemap.xml';
    if (type === 'production') {
      setRobotsTxt(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/
Disallow: /api/dashboard/

Sitemap: ${sitemapUrl}`);
    } else if (type === 'allow_all') {
      setRobotsTxt(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`);
    } else if (type === 'block_all') {
      setRobotsTxt(`# Disallow all crawlers (Staging / Private Mode)
User-agent: *
Disallow: /`);
    }
  }

  function handleCopySitemapUrl() {
    const sitemapUrl = `${stats.base_url || window.location.origin}/sitemap.xml`;
    navigator.clipboard.writeText(sitemapUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  const sitemapLiveUrl = `${stats.base_url || ''}/sitemap.xml`;
  const robotsLiveUrl = `${stats.base_url || ''}/robots.txt`;
  const llmsLiveUrl = `${stats.base_url || ''}/llms.txt`;

  return (
    <Card className="border border-border/80 bg-card shadow-sm rounded-2xl overflow-hidden p-5 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 grid place-items-center shrink-0">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                Search Engines &amp; AI Crawler Management
              </h2>
              <Badge variant="outline" className="text-[10px] font-bold border-indigo-500/30 text-indigo-600 bg-indigo-500/5 px-2 py-0.5">
                robots.txt · llms.txt · sitemap.xml
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control rules for search engine bots (Google, Bing), structured knowledge for AI scrapers (ChatGPT, Claude), and dynamic XML sitemap indexing.
            </p>
          </div>
        </div>

        {/* Save button and notice */}
        <div className="flex items-center gap-2 sm:self-start">
          {savedNotice && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved &amp; Synced!</span>
            </div>
          )}

          <Button
            size="sm"
            onClick={save}
            disabled={saving || loading}
            className="rounded-xl gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            {saving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Crawler Settings</span>
          </Button>
        </div>
      </div>

      {/* Segmented Tab Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/50 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('robots')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'robots'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Bot className="h-3.5 w-3.5" />
          <span>robots.txt Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('llms')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'llms'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>llms.txt (AI Scrapers)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sitemap')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'sitemap'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Globe className="h-3.5 w-3.5 text-emerald-500" />
          <span>sitemap.xml Sync &amp; Controls</span>
          <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.2">
            {stats.total_sitemap_urls} URLs
          </span>
        </button>
      </div>

      {/* ─── TAB 1: robots.txt Editor ─── */}
      {activeTab === 'robots' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-primary" />
                <span>robots.txt Rules for Search Bots</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tells search engines like Googlebot and Bingbot which URLs they can or cannot crawl.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Quick Presets:</span>
              <button
                type="button"
                onClick={() => applyRobotsPreset('production')}
                className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-border bg-background hover:bg-accent hover:border-primary/40 transition"
              >
                Production Safe
              </button>
              <button
                type="button"
                onClick={() => applyRobotsPreset('allow_all')}
                className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-border bg-background hover:bg-accent hover:border-primary/40 transition"
              >
                Allow All
              </button>
              <button
                type="button"
                onClick={() => applyRobotsPreset('block_all')}
                className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition"
              >
                Block All
              </button>
            </div>
          </div>

          {/* Monospace Code Editor */}
          <div className="relative rounded-xl border border-border bg-slate-950 font-mono text-slate-100 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                <span>/robots.txt</span>
              </span>
              <a
                href={robotsLiveUrl || '/robots.txt'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                <span>View Live robots.txt</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <textarea
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              rows={9}
              spellCheck={false}
              className="w-full bg-transparent p-3.5 font-mono text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none resize-y"
              placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://prestige-thane.vercel.app/sitemap.xml`}
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Admin, API authentication routes, and internal dashboards are protected by default.</span>
          </div>
        </div>
      )}

      {/* ─── TAB 2: llms.txt Editor ─── */}
      {activeTab === 'llms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>llms.txt for AI Scrapers &amp; LLM Grounding</span>
                </h3>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 text-[10px] font-bold">
                  AI Spec Standard
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Provides structured Markdown facts and clean URL pointers for ChatGPT Search, Claude, Perplexity, and web agents.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateLlmsFromSite}
              disabled={generatingLlms}
              className="rounded-xl gap-1.5 text-xs font-semibold border-amber-500/30 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
            >
              {generatingLlms ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              )}
              <span>Auto-Generate from Site Content</span>
            </Button>
          </div>

          {/* Monospace Markdown Editor */}
          <div className="relative rounded-xl border border-border bg-slate-950 font-mono text-slate-100 shadow-inner overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>/llms.txt</span>
              </span>
              <a
                href={llmsLiveUrl || '/llms.txt'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
              >
                <span>View Live llms.txt</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <textarea
              value={llmsTxt}
              onChange={(e) => setLlmsTxt(e.target.value)}
              rows={13}
              spellCheck={false}
              className="w-full bg-transparent p-3.5 font-mono text-xs leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none resize-y"
              placeholder="# Project Name&#10;> Brief summary for AI scrapers"
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            Tip: Keep bullet points clear and factual. AI crawlers use this file to accurately answer questions about unit plans, starting prices, and official booking phone numbers.
          </p>
        </div>
      )}

      {/* ─── TAB 3: sitemap.xml Management ─── */}
      {activeTab === 'sitemap' && (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-emerald-500" />
              <span>Dynamic XML Sitemap Management</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Next.js dynamically compiles all published pages and blogs into a search-engine ready sitemap.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-[11px] font-semibold text-muted-foreground block">Total Sitemap URLs</span>
              <span className="text-xl font-black text-foreground mt-0.5 block">{stats.total_sitemap_urls}</span>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-[11px] font-semibold text-muted-foreground block">Published Pages</span>
              <span className="text-xl font-black text-foreground mt-0.5 block">{stats.published_pages_count}</span>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-[11px] font-semibold text-muted-foreground block">Published Blog Posts</span>
              <span className="text-xl font-black text-foreground mt-0.5 block">{stats.blog_posts_count}</span>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <span className="text-[11px] font-semibold text-muted-foreground block">Sitemap Engine</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Dynamic Route
              </span>
            </div>
          </div>

          {/* Quick Links & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-mono font-medium text-foreground">
                {sitemapLiveUrl || '/sitemap.xml'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopySitemapUrl}
                className="rounded-lg h-7 gap-1 px-2.5 text-xs font-semibold"
              >
                {copiedUrl ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                <span>{copiedUrl ? 'Copied URL!' : 'Copy URL'}</span>
              </Button>

              <Button
                size="sm"
                asChild
                className="rounded-lg h-7 gap-1 px-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <a href={sitemapLiveUrl || '/sitemap.xml'} target="_blank" rel="noreferrer">
                  <span>View Live XML</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* Additional Custom URLs input */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-foreground">
              Additional Custom URLs (Optional)
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Add any extra custom URLs or landing pages to include in the sitemap (one path or URL per line, e.g. <code>/amenities</code> or <code>/brochure</code>).
            </p>
            <textarea
              value={sitemapCustomUrls}
              onChange={(e) => setSitemapCustomUrls(e.target.value)}
              rows={4}
              placeholder="/amenities&#10;/pricing&#10;/floor-plans"
              className="w-full rounded-xl border border-input bg-background p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Auto sync toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
            <div>
              <Label className="text-xs font-bold text-foreground">Automatic Dynamic Sync</Label>
              <p className="text-[11px] text-muted-foreground">
                Automatically include new pages as soon as they are set to &quot;Published&quot; in the CMS.
              </p>
            </div>
            <Switch
              checked={sitemapAutoSync}
              onCheckedChange={setSitemapAutoSync}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

