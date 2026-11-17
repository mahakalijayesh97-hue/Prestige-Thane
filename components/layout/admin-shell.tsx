'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { PageActionModal, PageSummary } from '@/components/admin/page-action-modal';
import {
  LayoutDashboard,
  FileText,
  Menu as MenuIcon,
  ImageIcon,
  Settings,
  PanelTop as FooterIcon,
  Newspaper,
  Mail,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Globe,
  Plus,
  LogOut,
  Link2,
  PanelLeftClose,
  PanelLeft,
  PanelTop,
  Sparkles,
  FormInput,
  GripVertical,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Code2,
} from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/forms', label: 'Forms & Modals', icon: FormInput },
  { href: '/admin/nav', label: 'Navbar', icon: MenuIcon },
  { href: '/admin/footer', label: 'Footer', icon: FooterIcon },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/contact', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const API_PREFETCH_MAP: Record<string, string[]> = {
  '/admin/pages': ['/api/pages'],
  '/admin/nav': ['/api/nav', '/api/settings/theme'],
  '/admin/forms': ['/api/forms'],
  '/admin/media': ['/api/media'],
  '/admin/settings': ['/api/settings/theme'],
  '/admin/footer': ['/api/footer/custom', '/api/footer/columns', '/api/footer/links'],
};

function prefetchAdminData(href: string) {
  const apis = API_PREFETCH_MAP[href];
  if (apis && typeof window !== 'undefined') {
    apis.forEach((api) => {
      try {
        fetch(api, { cache: 'no-store' }).catch(() => {});
      } catch {}
    });
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [pagesList, setPagesList] = useState<PageSummary[]>([]);
  const [pagesSubmenuOpen, setPagesSubmenuOpen] = useState(true);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalPageId, setActionModalPageId] = useState<string | null>(null);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  const [dragOverPageIndex, setDragOverPageIndex] = useState<number | null>(null);
  const [reorderMode, setReorderMode] = useState(false);

  // Auto-fetch all created pages to populate the submenu and action modal
  useEffect(() => {
    let isMounted = true;
    fetch('/api/pages', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.pages) {
          setPagesList(data.pages);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const savePageOrder = async (newPages: PageSummary[]) => {
    setPagesList(newPages);
    const updates = newPages.map((p, idx) => ({
      id: p.id || (p as any)._id || p.slug,
      sort_order: idx,
    }));
    try {
      await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      });
    } catch (err) {
      console.error('Failed to update page order:', err);
    }
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pagesList.length) return;
    const reordered = [...pagesList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    savePageOrder(reordered);
  };

  const movePageToPosition = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= pagesList.length ||
      toIndex >= pagesList.length
    ) {
      return;
    }
    const reordered = [...pagesList];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    savePageOrder(reordered);
  };

  const openModalForPage = (pageId?: string) => {
    if (pageId) {
      setActionModalPageId(pageId);
    } else {
      // When opened from main sidebar next to "Pages", open in Create New Page mode
      setActionModalPageId('new');
    }
    setIsActionModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/admin" className="text-base font-semibold tracking-tight">
              Acme CMS
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            // Special handling for Pages with three-dots action and auto-created submenu
            if (item.href === '/admin/pages') {
              const isPagesActive = pathname.startsWith('/admin/pages');
              return (
                <div key={item.href} className="space-y-1">
                  <div
                    className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isPagesActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      onMouseEnter={() => prefetchAdminData(item.href)}
                      title={collapsed ? item.label : undefined}
                      className="flex flex-1 items-center gap-3 truncate"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>

                    {!collapsed && (
                      <div className="flex items-center gap-1">
                        {/* Three Dots Action Button: Opens Flexible Page Action & Raw HTML Modal */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openModalForPage();
                          }}
                          title="Page Actions & Raw HTML"
                          className={`grid h-6 w-6 place-items-center rounded-md transition hover:bg-black/15 dark:hover:bg-white/15 ${
                            isPagesActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Chevron Submenu Toggle */}
                        {pagesList.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPagesSubmenuOpen((prev) => !prev);
                            }}
                            title={pagesSubmenuOpen ? 'Collapse Submenu' : 'Expand Submenu'}
                            className={`grid h-6 w-6 place-items-center rounded-md transition hover:bg-black/15 dark:hover:bg-white/15 ${
                              isPagesActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {pagesSubmenuOpen ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Auto-Created Pages Submenu */}
                  {!collapsed && pagesSubmenuOpen && pagesList.length > 0 && (
                    <div className="ml-3 pl-2 border-l border-border/70 space-y-1 py-1">
                      {/* Submenu Top Header with Page Count & Sort toggle */}
                      <div className="flex items-center justify-between px-2 py-0.5 text-[10px] text-muted-foreground font-semibold">
                        <span>{pagesList.length} PAGES</span>
                        <button
                          type="button"
                          onClick={() => setReorderMode(!reorderMode)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                            reorderMode
                              ? 'bg-primary text-primary-foreground font-bold'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          {reorderMode ? 'Done' : 'Sort'}
                        </button>
                      </div>

                      {/* Scrollable list for pages */}
                      <div className="max-h-[380px] overflow-y-auto space-y-0.5 pr-0.5">
                        {pagesList.map((p, idx) => {
                          const pageKey = p.id || (p as any)._id || p.slug;
                          const isCurrentPage =
                            pathname === `/admin/pages/${pageKey}` ||
                            (p.id && pathname === `/admin/pages/${p.id}`) ||
                            ((p as any)._id && pathname === `/admin/pages/${(p as any)._id}`) ||
                            (p.slug && pathname === `/admin/pages/${p.slug}`);

                          return (
                            <div
                              key={pageKey}
                              draggable={reorderMode}
                              onDragStart={(e) => {
                                if (!reorderMode) return;
                                setDraggedPageIndex(idx);
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', String(idx));
                              }}
                              onDragOver={(e) => {
                                if (!reorderMode) return;
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                if (dragOverPageIndex !== idx) {
                                  setDragOverPageIndex(idx);
                                }
                              }}
                              onDragLeave={() => {
                                if (dragOverPageIndex === idx) {
                                  setDragOverPageIndex(null);
                                }
                              }}
                              onDrop={(e) => {
                                if (!reorderMode) return;
                                e.preventDefault();
                                if (draggedPageIndex !== null && draggedPageIndex !== idx) {
                                  movePageToPosition(draggedPageIndex, idx);
                                }
                                setDraggedPageIndex(null);
                                setDragOverPageIndex(null);
                              }}
                              onDragEnd={() => {
                                setDraggedPageIndex(null);
                                setDragOverPageIndex(null);
                              }}
                              className={`group/sub flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium transition-all ${
                                isCurrentPage
                                  ? 'bg-primary/15 text-primary font-bold'
                                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                              } ${
                                dragOverPageIndex === idx && reorderMode
                                  ? 'border-y border-primary bg-primary/10'
                                  : ''
                              }`}
                            >
                              {/* If in Reorder mode: show grip and index */}
                              {reorderMode && (
                                <div className="flex items-center gap-1 shrink-0 mr-1.5 select-none cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground">
                                  <GripVertical className="h-3 w-3" />
                                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                                    {idx + 1}
                                  </span>
                                </div>
                              )}

                              <Link
                                href={`/admin/pages/${pageKey}`}
                                prefetch={false}
                                className="flex items-center gap-2 truncate flex-1 min-w-0"
                                title={`${p.title} (/${p.slug})`}
                              >
                                {!reorderMode && (
                                  p.is_homepage ? (
                                    <Globe className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                  ) : (
                                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0 group-hover/sub:bg-primary" />
                                  )
                                )}
                                <span className="truncate">{p.title}</span>
                              </Link>

                              {/* In Reorder mode: show up/down buttons */}
                              {reorderMode ? (
                                <div className="flex items-center gap-0.5 shrink-0 ml-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      movePage(idx, 'up');
                                    }}
                                    disabled={idx === 0}
                                    title="Move Up"
                                    className="grid h-5 w-5 place-items-center rounded hover:bg-background/80 text-muted-foreground hover:text-foreground disabled:opacity-20 transition"
                                  >
                                    <ChevronUp className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      movePage(idx, 'down');
                                    }}
                                    disabled={idx === pagesList.length - 1}
                                    title="Move Down"
                                    className="grid h-5 w-5 place-items-center rounded hover:bg-background/80 text-muted-foreground hover:text-foreground disabled:opacity-20 transition"
                                  >
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                /* In Normal mode: clean three dots button on hover */
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openModalForPage(pageKey);
                                  }}
                                  title={`Actions for ${p.title}`}
                                  className="opacity-0 group-hover/sub:opacity-100 grid h-5 w-5 place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-background/80 transition shrink-0 ml-1"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Add Page Submenu Links */}
                      <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-border/50 px-1 text-[11px]">
                        <Link
                          href="/admin/pages/new"
                          prefetch={false}
                          className="flex items-center gap-1 text-primary hover:underline font-medium py-0.5"
                          title="Create new flex block page"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Flex Page</span>
                        </Link>
                        <span className="text-muted-foreground/40">•</span>
                        <Link
                          href="/admin/pages/new?mode=raw"
                          prefetch={false}
                          className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline font-medium py-0.5"
                          title="Create new raw HTML/CSS/JS page"
                        >
                          <Code2 className="h-3 w-3" />
                          <span>Raw HTML</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onMouseEnter={() => prefetchAdminData(item.href)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-2">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground ${collapsed ? 'justify-center' : ''}`}
          >
            <Link2 className="h-4 w-4 shrink-0" />
            {!collapsed && <span>View site</span>}
          </Link>
          {!collapsed && user && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
          )}
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className={`w-full justify-${collapsed ? 'center' : 'start'} text-muted-foreground hover:text-foreground`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Flexible Page Action & Raw HTML Modal */}
      <PageActionModal
        open={isActionModalOpen}
        onOpenChange={setIsActionModalOpen}
        pages={pagesList}
        initialPageId={actionModalPageId}
      />
    </div>
  );
}