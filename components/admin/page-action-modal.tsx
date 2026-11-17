'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { parsePageContent } from '@/lib/page-content';
import {
  ExternalLink,
  Code2,
  Copy,
  Check,
  Globe,
  FileEdit,
  Loader2,
  Plus,
  Sparkles,
  ChevronDown,
  Search,
  FileText,
  FormInput,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface PageSummary {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  is_homepage?: boolean;
  status?: string;
  content?: string;
}

interface PageActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pages: PageSummary[];
  initialPageId?: string | null;
}

function getPageId(page?: PageSummary | null): string {
  if (!page) return '';
  return page.id || page._id || page.slug || '';
}

function matchPage(p: PageSummary, idOrSlug?: string | null): boolean {
  if (!idOrSlug) return false;
  const pid = p.id || p._id;
  return Boolean(
    pid === idOrSlug ||
    p.slug === idOrSlug ||
    (p.is_homepage && (idOrSlug === 'home' || idOrSlug === '00000000-0000-0000-0000-000000000010'))
  );
}

export function PageActionModal({
  open,
  onOpenChange,
  pages,
  initialPageId,
}: PageActionModalProps) {
  const [internalPages, setInternalPages] = useState<PageSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>('new');
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [pageContent, setPageContent] = useState<string>('');
  const [showRawHtml, setShowRawHtml] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Popover Page Switcher state
  const [pagePopoverOpen, setPagePopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback fetch if pages from parent is empty
  useEffect(() => {
    if (!open) return;
    if (pages && pages.length > 0) {
      setInternalPages(pages);
      return;
    }
    fetch('/api/pages', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.pages && data.pages.length > 0) {
          setInternalPages(data.pages);
        }
      })
      .catch(() => {});
  }, [open, pages]);

  const activePages = pages && pages.length > 0 ? pages : internalPages;

  // Initialize selectedId: if no initialPageId or initialPageId === 'new', default to 'new' (Create New Page)
  useEffect(() => {
    if (!open) return;

    if (!initialPageId || initialPageId === 'new') {
      setSelectedId('new');
      return;
    }

    const found = activePages.find((p) => matchPage(p, initialPageId));
    if (found) {
      setSelectedId(getPageId(found));
      return;
    }

    setSelectedId(initialPageId);
  }, [open, initialPageId, activePages]);

  const isNewPageMode = selectedId === 'new';

  const currentPage = !isNewPageMode
    ? activePages.find((p) => matchPage(p, selectedId)) ||
      (initialPageId && initialPageId !== 'new'
        ? activePages.find((p) => matchPage(p, initialPageId))
        : null) ||
      activePages[0]
    : null;

  const targetEditId = !isNewPageMode ? getPageId(currentPage) || selectedId : '';
  const editPageHref = isNewPageMode
    ? '/admin/pages/new'
    : targetEditId
    ? `/admin/pages/${targetEditId}`
    : '/admin/pages';

  // Fetch full content when an existing page is selected
  useEffect(() => {
    if (!open || isNewPageMode || !targetEditId) return;

    const matchedPage = activePages.find((p) => matchPage(p, targetEditId));
    if (matchedPage?.content) {
      setPageContent(matchedPage.content);
      return;
    }

    setLoadingContent(true);
    fetch(`/api/pages/${targetEditId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.page?.content !== undefined) {
          setPageContent(data.page.content);
        } else {
          setPageContent('');
        }
      })
      .catch(() => setPageContent(''))
      .finally(() => setLoadingContent(false));
  }, [open, isNewPageMode, targetEditId, activePages]);

  const liveRelativeUrl = isNewPageMode
    ? '/admin/pages/new'
    : currentPage
    ? currentPage.is_homepage || currentPage.slug === 'home'
      ? '/'
      : `/${currentPage.slug}`
    : '/';

  const parsed = parsePageContent(pageContent);
  const rawHtmlMarkup = parsed.html || pageContent || '<!-- No HTML content found -->';

  const copyRawHtml = async () => {
    try {
      await navigator.clipboard.writeText(rawHtmlMarkup);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch {}
  };

  const handleOpenLink = () => {
    if (typeof window !== 'undefined') {
      window.open(liveRelativeUrl, '_blank');
    }
  };

  // Filtered pages for search inside custom popover
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return activePages;
    const q = searchQuery.toLowerCase();
    return activePages.filter(
      (p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    );
  }, [activePages, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full p-6 rounded-2xl border border-border shadow-2xl bg-card">
        {/* Modal Header */}
        <DialogHeader className="pb-3 border-b border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                {isNewPageMode ? (
                  <>
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Page Manager &amp; Builder</span>
                  </>
                ) : (
                  <>
                    {currentPage?.is_homepage && <Globe className="h-4 w-4 text-amber-500" />}
                    <span>{currentPage?.title || 'Page Actions'}</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isNewPageMode
                  ? 'Create new modular pages or switch to manage existing pages.'
                  : liveRelativeUrl}
              </DialogDescription>
            </div>

            {/* Custom Popover Page Switcher (Replaces the clunky native select) */}
            <Popover open={pagePopoverOpen} onOpenChange={setPagePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 max-w-[240px] px-3 gap-2 text-xs font-medium border-border shadow-xs truncate justify-between"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {isNewPageMode ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="truncate font-semibold">✨ + Create New Page</span>
                      </>
                    ) : (
                      <>
                        {currentPage?.is_homepage ? (
                          <Globe className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="truncate">{currentPage?.title}</span>
                      </>
                    )}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70 shrink-0" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 p-2.5 rounded-xl shadow-xl border border-border bg-popover z-[100]"
              >
                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pages..."
                    className="h-8 pl-8 text-xs bg-muted/40 border-border"
                  />
                </div>

                {/* Pinned "Create New Page" Option */}
                <div
                  onClick={() => {
                    setSelectedId('new');
                    setShowRawHtml(false);
                    setPagePopoverOpen(false);
                  }}
                  className={`p-2.5 rounded-lg cursor-pointer transition flex items-center justify-between text-xs mb-1 ${
                    isNewPageMode
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-bold'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 grid place-items-center">
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                    <span>Create New Page</span>
                  </div>
                  {isNewPageMode && <Check className="h-3.5 w-3.5 text-blue-600" />}
                </div>

                <div className="h-px bg-border my-1.5" />

                {/* Existing Pages List */}
                <div className="max-h-[220px] overflow-y-auto space-y-0.5 pr-1">
                  {filteredPages.length === 0 ? (
                    <div className="p-3 text-center text-xs text-muted-foreground">
                      No matching pages found
                    </div>
                  ) : (
                    filteredPages.map((p) => {
                      const pId = getPageId(p);
                      const isSelected = selectedId === pId;

                      return (
                        <div
                          key={pId || p.slug}
                          onClick={() => {
                            setSelectedId(pId);
                            setShowRawHtml(false);
                            setPagePopoverOpen(false);
                          }}
                          className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'hover:bg-accent text-foreground'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <div className="truncate flex items-center gap-1.5 font-medium">
                              {p.is_homepage && <Globe className="h-3 w-3 text-amber-500 shrink-0" />}
                              <span className="truncate">{p.title}</span>
                            </div>
                            <div className="text-[10px] font-mono text-muted-foreground truncate">
                              /{p.slug}
                            </div>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        {isNewPageMode ? (
          /* ================= CREATE NEW PAGE VIEW ================= */
          <div className="py-3 space-y-4">
            <div className="rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 via-background to-indigo-50/40 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/20 p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md shadow-blue-500/25 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <span>Create New Modular Page</span>
                    <Badge variant="secondary" className="text-[10px] font-mono font-normal">
                      Modular Builder
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Build pages with modular blocks (Lead Sources, Hero Banners, FAQ cards), custom CSS &amp; JS, and SEO controls.
                  </p>
                </div>
              </div>

              {/* Action Buttons: 3 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* 1. Flex Page Builder */}
                <Button
                  asChild
                  size="default"
                  className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2 shadow-sm"
                >
                  <Link href="/admin/pages/new" onClick={() => onOpenChange(false)}>
                    <FileEdit className="h-4 w-4" />
                    <span>Open Flex Page</span>
                  </Link>
                </Button>

                {/* 2. Raw HTML Editor */}
                <Button
                  asChild
                  size="default"
                  variant="outline"
                  className="h-11 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300 font-semibold text-xs gap-2 shadow-sm"
                >
                  <Link href="/admin/pages/new?mode=raw" onClick={() => onOpenChange(false)}>
                    <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Raw HTML</span>
                  </Link>
                </Button>
                
                {/* 3. Configure Lead Forms */}
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="h-11 border-border hover:bg-accent font-semibold text-xs gap-2"
                >
                  <Link href="/admin/forms" onClick={() => onOpenChange(false)}>
                    <FormInput className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Configure Forms</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Switch to Existing Page */}
            {activePages.length > 0 && (
              <div className="p-3 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Looking for an existing page? ({activePages.length} pages available)</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const firstId = getPageId(activePages[0]);
                    setSelectedId(firstId);
                  }}
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Browse pages</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================= EXISTING PAGE ACTIONS VIEW ================= */
          <div className="py-3 space-y-4">
            {/* Page Overview Card */}
            <div className="p-4 rounded-xl border border-border/90 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-background border border-border grid place-items-center shrink-0">
                  {currentPage?.is_homepage ? (
                    <Globe className="h-5 w-5 text-amber-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-2">
                    <span>{currentPage?.title}</span>
                    {currentPage?.is_homepage && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 dark:border-amber-700">
                        Homepage
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">
                    {liveRelativeUrl}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={currentPage?.status === 'published' ? 'default' : 'secondary'}
                  className="text-[10px] capitalize"
                >
                  {currentPage?.status || 'published'}
                </Badge>
              </div>
            </div>

            {/* The 3 Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Flex Page Button */}
              <Button
                asChild
                variant="default"
                className="h-11 flex items-center justify-center gap-2 font-semibold text-xs shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link
                  href={editPageHref}
                  onClick={() => onOpenChange(false)}
                  title={`Edit ${currentPage?.title || 'Page'}`}
                >
                  <FileEdit className="h-4 w-4" />
                  <span>Flex Page</span>
                </Link>
              </Button>

              {/* 2. Open Live Link */}
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenLink}
                className="h-11 flex items-center justify-center gap-2 font-semibold text-xs border-border hover:bg-accent"
              >
                <ExternalLink className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Open Link</span>
              </Button>

              {/* 3. Raw HTML Button */}
              <Button
                asChild
                variant="outline"
                className="h-11 flex items-center justify-center gap-2 font-semibold text-xs border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-purple-700 dark:text-purple-300 shadow-2xs"
              >
                <Link
                  href={`${editPageHref}?mode=raw`}
                  onClick={() => onOpenChange(false)}
                  title={`Open Raw HTML Editor for ${currentPage?.title || 'Page'}`}
                >
                  <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Raw HTML</span>
                </Link>
              </Button>
            </div>

            {/* Raw HTML Code Viewer */}
            {showRawHtml && (
              <div className="rounded-xl border border-border bg-slate-950 overflow-hidden animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 bg-slate-900/60">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-purple-400" />
                    Raw HTML Markup
                  </span>
                  <button
                    type="button"
                    onClick={copyRawHtml}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-white transition"
                  >
                    {copiedHtml ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy HTML</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  {loadingContent ? (
                    <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Loading HTML...</span>
                    </div>
                  ) : (
                    <pre className="p-3.5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[260px] text-slate-100 select-all whitespace-pre-wrap">
                      {rawHtmlMarkup}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
