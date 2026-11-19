'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import Swal from 'sweetalert2';
import { PageActionModal } from '@/components/admin/page-action-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pencil,
  Plus,
  Trash2,
  Globe,
  FileText,
  MoreHorizontal,
  Search,
  ExternalLink,
  Copy,
  CopyPlus,
  Check,
  RefreshCw,
  Layers,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  ArrowLeft,
  X,
  Eye,
} from 'lucide-react';

interface Row {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_homepage: boolean;
  updated_at: string;
  sort_order?: number;
}

let cachedPagesList: Row[] | null = null;

export default function AdminPagesPage() {
  const [rows, setRows] = useState<Row[]>(() => cachedPagesList || []);
  const [loading, setLoading] = useState(() => !cachedPagesList);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'updated' | 'title-asc' | 'title-desc'>('order');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionPageId, setActionPageId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (!cachedPagesList) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/pages', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.pages) {
          cachedPagesList = json.pages;
          setRows(json.pages);
          setLoading(false);
          setIsRefreshing(false);
          return;
        }
      }
    } catch {
      // fallback to Supabase
    }
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from('pages')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) {
      cachedPagesList = data as Row[];
      setRows(data as Row[]);
    }
    setLoading(false);
    setIsRefreshing(false);
  }

  // Filter & Sort
  const filteredRows = useMemo(() => {
    let result = rows.filter((r) => {
      const matchesFilter = filter === 'all' || r.status === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });
  }, [rows, filter, searchQuery, sortBy]);

  // Counts
  const totalCount = rows.length;
  const publishedCount = rows.filter((r) => r.status === 'published').length;
  const draftCount = rows.filter((r) => r.status === 'draft').length;
  const homepageRow = rows.find((r) => r.is_homepage || r.slug === 'home');

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

  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  async function duplicatePage(page: Row) {
    const pageKey = page.id || (page as any)._id || page.slug;
    if (!pageKey) return;

    const result = await Swal.fire({
      title: 'Duplicate Page?',
      html: `Create an exact clone of <b class="text-blue-600">"${page.title}"</b>?<br/><span class="text-xs text-muted-foreground mt-1 block">A unique slug suffix will be generated automatically and saved in Draft status.</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, duplicate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
    });

    if (!result.isConfirmed) return;

    setDuplicatingId(pageKey);
    try {
      const res = await fetch(`/api/pages/${pageKey}/duplicate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to duplicate page');
      }

      await logActivity('create', 'page', `Duplicated page: ${page.title} -> ${data.page?.title || ''}`);
      await load();

      Swal.fire({
        title: 'Page Duplicated!',
        html: `Created <b class="text-blue-600">"${data.page.title}"</b><br/><span class="text-xs font-mono text-slate-600 mt-1 block">Route: /${data.page.slug}</span>`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Edit Cloned Page',
        cancelButtonText: 'Stay on List',
        confirmButtonColor: '#2563eb',
      }).then((nav) => {
        if (nav.isConfirmed && data.page.id) {
          window.location.href = `/admin/pages/${data.page.id}`;
        }
      });
    } catch (err: any) {
      Swal.fire({
        title: 'Duplication Failed',
        text: err.message || 'Could not duplicate page',
        icon: 'error',
      });
    } finally {
      setDuplicatingId(null);
    }
  }

  function handleCopyUrl(slug: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = slug === 'home' ? `${origin}/` : `${origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  function formatDate(d: string) {
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return d;
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  }

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ─── BREADCRUMBS & TOP HEADER ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div className="space-y-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/40 transition shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Back to Admin</span>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground font-medium">Dashboard</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-semibold text-foreground">Pages</span>
          </div>

          {/* Title & Badges */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-foreground leading-normal sm:leading-snug py-0.5">
                  Website Pages
                </h1>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-bold text-[11px] px-2.5 py-0.5 rounded-md h-fit">
                  {totalCount} Total Pages
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Create, customize layout sections, edit raw HTML, and control SEO publication states across your site.
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-end">
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={isRefreshing}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold shadow-xs hover:border-primary/50"
            title="Refresh pages list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold shadow-xs hover:border-primary/50"
          >
            <Link href="/" target="_blank">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>Live Site</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="rounded-xl gap-1.5 text-xs font-bold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/admin/pages/new">
              <Plus className="h-4 w-4" />
              <span>New Page</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── QUICK METRICS CARDS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Total Pages</span>
            <span className="text-2xl font-bold text-foreground mt-0.5 block">{totalCount}</span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Published</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{publishedCount}</span>
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Drafts</span>
            <span className="text-2xl font-bold text-muted-foreground mt-0.5 block">{draftCount}</span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-500/10 text-slate-500">
            <Clock className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Active Home</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 truncate max-w-[120px] block mt-1" title={homepageRow?.title || 'Homepage'}>
              {homepageRow ? `/${homepageRow.slug}` : 'Default Home'}
            </span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
            <Globe className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* ─── SEARCH, TABS & CONTROLS BAR ─── */}
      <Card className="p-3 sm:p-4 border-border/80 bg-card shadow-xs rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-muted/60 border border-border/70 rounded-xl shrink-0">
            {(
              [
                { id: 'all', label: 'All Pages', count: totalCount },
                { id: 'published', label: 'Published', count: publishedCount },
                { id: 'draft', label: 'Draft', count: draftCount },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === tab.id
                    ? 'bg-background text-foreground shadow-xs border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    filter === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex flex-1 sm:flex-initial items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page title or /slug..."
                className="h-9 pl-8 pr-8 text-xs rounded-xl bg-background border-border/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-background border border-border/80 rounded-xl px-2 h-9 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-1"
              >
                <option value="order">Site Order</option>
                <option value="updated">Recently Updated</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── MAIN PAGES TABLE CARD ─── */}
      {loading ? (
        <Card className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-2xl">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="font-medium">Loading pages data...</span>
        </Card>
      ) : filteredRows.length === 0 ? (
        <Card className="p-12 text-center border-dashed rounded-2xl space-y-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted mx-auto text-muted-foreground">
            <Search className="h-6 w-6 opacity-60" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">No matching pages found</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {searchQuery
                ? `No pages match your search "${searchQuery}".`
                : 'No pages found in this category.'}
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-xs rounded-xl"
            >
              Clear Search
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4 sm:px-5">Page Title</th>
                  <th className="py-3 px-4">Route / URL</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRows.map((r, idx) => {
                  const isHomepage = r.is_homepage || r.slug === 'home';
                  const livePath = isHomepage ? '/' : `/${r.slug}`;
                  const isCopied = copiedSlug === r.slug;
                  const isPublished = r.status === 'published';

                  return (
                    <tr
                      key={r.id || idx}
                      className="group transition-colors hover:bg-muted/40"
                    >
                      {/* 1. TITLE COLUMN */}
                      <td className="py-3.5 px-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                              isHomepage
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-2xs'
                                : 'bg-muted/80 text-foreground group-hover:bg-primary/10 group-hover:text-primary'
                            }`}
                          >
                            {isHomepage ? (
                              <Globe className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/pages/${r.id || (r as any)._id || r.slug}`}
                                prefetch={false}
                                className="font-bold text-foreground text-sm hover:text-primary transition line-clamp-1 group-hover:underline"
                              >
                                {r.title}
                              </Link>
                              {isHomepage && (
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0 h-4 rounded"
                                >
                                  Homepage
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground/80 block mt-0.5">
                              Section #{idx + 1}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. SLUG COLUMN */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={livePath}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted border border-border/70 text-xs font-mono font-medium text-foreground transition group/slug"
                            title={`Open live path: ${livePath}`}
                          >
                            <span>{livePath}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground group-hover/slug:text-primary transition" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleCopyUrl(r.slug)}
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            title="Copy full page URL"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 3. STATUS COLUMN */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center">
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 bg-slate-500/10 border border-slate-500/20 dark:text-slate-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Draft
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. UPDATED DATE */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                          <Clock className="h-3.5 w-3.5 opacity-60" />
                          <span>{formatDate(r.updated_at)}</span>
                        </div>
                      </td>

                      {/* 5. ACTIONS */}
                      <td className="py-3.5 px-4 sm:px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Live preview */}
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary rounded-lg"
                            title="View live page"
                          >
                            <Link href={livePath} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* Quick Actions & Raw HTML */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const pageKey = r.id || (r as any)._id || r.slug;
                              setActionPageId(pageKey);
                              setActionModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                            title="Quick Actions & Raw HTML"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>

                          {/* Edit Page */}
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                            title="Edit page layout"
                          >
                            <Link
                              href={`/admin/pages/${r.id || (r as any)._id || r.slug}`}
                              prefetch={false}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* Duplicate Page */}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={duplicatingId === (r.id || (r as any)._id || r.slug)}
                            onClick={() => duplicatePage(r)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                            title="Duplicate page"
                          >
                            {duplicatingId === (r.id || (r as any)._id || r.slug) ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                            ) : (
                              <CopyPlus className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Delete (disabled for homepage) */}
                          {!r.is_homepage && r.slug !== 'home' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(r.id, r.title)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"
                              title="Delete page"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="flex items-center justify-between border-t border-border/80 bg-muted/20 px-4 sm:px-5 py-3 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredRows.length}</strong> of{' '}
              <strong className="text-foreground">{totalCount}</strong> pages
            </span>
            <span>Click any title or pencil icon to open the visual layout editor</span>
          </div>
        </Card>
      )}

      {/* Flexible Page Action & Raw HTML Modal */}
      <PageActionModal
        open={actionModalOpen}
        onOpenChange={setActionModalOpen}
        pages={rows}
        initialPageId={actionPageId}
      />
    </div>
  );
}
