'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageActionModal, PageSummary } from '@/components/admin/page-action-modal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
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
  ExternalLink,
  Send,
  FileQuestion,
} from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/open-links', label: 'Open Link', icon: Link2 },
  { href: '/admin/forms', label: 'Forms & Modals', icon: FormInput },
  { href: '/admin/nav', label: 'Navbar', icon: MenuIcon },
  { href: '/admin/footer', label: 'Footer', icon: FooterIcon },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/contact', label: 'Messages', icon: Mail },
  { href: '/admin/smtp', label: 'SMTP Email Configuration', icon: Send },
  { href: '/admin/error-page', label: '404 Error Page', icon: FileQuestion },
  { href: '/admin/custom-code', label: 'Custom Code & CDN', icon: Code2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const API_PREFETCH_MAP: Record<string, string[]> = {
  '/admin/pages': ['/api/pages'],
  '/admin/open-links': ['/api/open-links'],
  '/admin/nav': ['/api/nav', '/api/settings/theme'],
  '/admin/forms': ['/api/forms'],
  '/admin/media': ['/api/media'],
  '/admin/smtp': ['/api/settings/smtp'],
  '/admin/error-page': ['/api/settings/error-page'],
  '/admin/custom-code': ['/api/settings/theme'],
  '/admin/settings': ['/api/settings/theme'],
  '/admin/footer': ['/api/footer/custom', '/api/footer/columns', '/api/footer/links'],
  '/admin/contact': ['/api/leads', '/api/forms'],
};

interface FormSummary {
  id?: string;
  _id?: string;
  slug: string;
  title: string;
  is_active?: boolean;
}

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

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Sign out?',
      text: 'Are you sure you want to sign out of the admin console?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await signOut();
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const [pagesList, setPagesList] = useState<PageSummary[]>([]);
  const [pagesSubmenuOpen, setPagesSubmenuOpen] = useState(() => pathname.startsWith('/admin/pages'));
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionModalPageId, setActionModalPageId] = useState<string | null>(null);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  const [dragOverPageIndex, setDragOverPageIndex] = useState<number | null>(null);
  const [reorderMode, setReorderMode] = useState(false);

  // Forms submenu state for Messages
  const [formsList, setFormsList] = useState<FormSummary[]>([]);
  const [messagesSubmenuOpen, setMessagesSubmenuOpen] = useState(() => pathname.startsWith('/admin/contact') || pathname.startsWith('/admin/messages'));
  const [currentFormParam, setCurrentFormParam] = useState<string | null>(null);

  // Auto-collapse submenus when on other pages, auto-expand when on that section
  useEffect(() => {
    setPagesSubmenuOpen(pathname.startsWith('/admin/pages'));
    setMessagesSubmenuOpen(pathname.startsWith('/admin/contact') || pathname.startsWith('/admin/messages'));
  }, [pathname]);

  // Sync current form query param from URL
  useEffect(() => {
    const updateFormParam = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        setCurrentFormParam(params.get('form'));
      }
    };
    updateFormParam();
    window.addEventListener('popstate', updateFormParam);
    return () => {
      window.removeEventListener('popstate', updateFormParam);
    };
  }, [pathname]);

  // Auto-fetch all created forms to populate the Messages submenu
  useEffect(() => {
    let isMounted = true;
    const fetchForms = () => {
      fetch('/api/forms', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.forms) {
            setFormsList(data.forms);
          }
        })
        .catch(() => {});
    };

    fetchForms();
    window.addEventListener('forms-updated', fetchForms);
    return () => {
      isMounted = false;
      window.removeEventListener('forms-updated', fetchForms);
    };
  }, [pathname]);

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_sidebar_collapsed');
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-3.5">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5 group select-none">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs font-bold text-sm tracking-tight group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Acme CMS
                </span>
                <span className="text-[10px] font-medium text-muted-foreground leading-none">
                  Admin Console
                </span>
              </div>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-2.5 overflow-y-auto overflow-x-hidden [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.200)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/80 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/80 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            // Special handling for Pages with three-dots action and auto-created submenu
            if (item.href === '/admin/pages') {
              const isPagesActive = pathname.startsWith('/admin/pages');
              return (
                <div key={item.href} className="space-y-1">
                  <div
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                      isPagesActive
                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/25 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
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
                      <div className="flex items-center gap-0.5">
                        {/* Three Dots Action Button: Opens Flexible Page Action & Raw HTML Modal */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openModalForPage();
                          }}
                          title="Page Actions & Raw HTML"
                          className={`grid h-6 w-6 place-items-center rounded-md transition ${
                            isPagesActive ? 'hover:bg-white/20 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
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
                            className={`grid h-6 w-6 place-items-center rounded-md transition ${
                              isPagesActive ? 'hover:bg-white/20 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                pagesSubmenuOpen ? 'rotate-0' : '-rotate-90'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Auto-Created Pages Submenu */}
                  {!collapsed && pagesSubmenuOpen && pagesList.length > 0 && (
                    <div className="ml-3.5 pl-2.5 border-l-2 border-slate-200/80 dark:border-slate-800 space-y-1 py-1 my-0.5">
                      {/* Submenu Top Header with Page Count & Sort toggle */}
                      <div className="flex items-center justify-between px-2 py-0.5 text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
                        <span>{pagesList.length} Pages</span>
                        <button
                          type="button"
                          onClick={() => setReorderMode(!reorderMode)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                            reorderMode
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                          }`}
                        >
                          {reorderMode ? 'Done' : 'Sort'}
                        </button>
                      </div>

                      {/* Scrollable list for pages */}
                      <div className="max-h-[190px] overflow-y-auto space-y-0.5 pr-0.5 [scrollbar-width:thin]">
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
                              className={`group/sub flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                                isCurrentPage
                                  ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/50 dark:text-blue-300'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                              } ${
                                dragOverPageIndex === idx && reorderMode
                                  ? 'border-y border-blue-500 bg-blue-50/50'
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
                      <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-border/40 px-1">
                        <Link
                          href="/admin/pages/new"
                          prefetch={false}
                          className="flex-1 flex items-center justify-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50 text-[11px] font-semibold py-1 transition"
                          title="Create new flex block page"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Flex Page</span>
                        </Link>
                        <Link
                          href="/admin/pages/new?mode=raw"
                          prefetch={false}
                          className="flex-1 flex items-center justify-center gap-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50 text-[11px] font-semibold py-1 transition"
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

            // Special handling for Messages with auto-created Forms submenu
            if (item.href === '/admin/contact') {
              const isMessagesActive = pathname.startsWith('/admin/contact');
              return (
                <div key={item.href} className="space-y-1">
                  <div
                    className={`group flex items-center justify-between rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                      isMessagesActive
                        ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/25 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      onClick={() => setCurrentFormParam(null)}
                      onMouseEnter={() => prefetchAdminData(item.href)}
                      title={collapsed ? item.label : undefined}
                      className="flex flex-1 items-center gap-3 truncate"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>

                    {!collapsed && (
                      <div className="flex items-center gap-0.5">
                        {/* Chevron Submenu Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMessagesSubmenuOpen((prev) => !prev);
                          }}
                          title={messagesSubmenuOpen ? 'Collapse Forms Submenu' : 'Expand Forms Submenu'}
                          className={`grid h-6 w-6 place-items-center rounded-md transition ${
                            isMessagesActive ? 'hover:bg-white/20 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-200 ${
                              messagesSubmenuOpen ? 'rotate-0' : '-rotate-90'
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Auto-Created Forms Submenu for Messages */}
                  {!collapsed && messagesSubmenuOpen && (
                    <div className="ml-3.5 pl-2.5 border-l-2 border-slate-200/80 dark:border-slate-800 space-y-1 py-1 my-0.5">
                      {/* Submenu Top Header with Form Count */}
                      <div className="flex items-center justify-between px-2 py-0.5 text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
                        <span>Forms &amp; Inbox {formsList.length > 0 ? `(${formsList.length})` : ''}</span>
                        <Link
                          href="/admin/forms"
                          prefetch={false}
                          className="text-[10px] text-blue-600 hover:text-blue-700 font-bold hover:underline"
                          title="Manage Forms & Modals"
                        >
                          Manage
                        </Link>
                      </div>

                      {/* Scrollable list for forms under Messages */}
                      <div className="max-h-[190px] overflow-y-auto space-y-0.5 pr-0.5 [scrollbar-width:thin]">
                        {/* All Inquiries Option */}
                        <Link
                          href="/admin/contact"
                          prefetch={false}
                          onClick={() => setCurrentFormParam(null)}
                          className={`group/sub flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                            isMessagesActive && !currentFormParam
                              ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/50 dark:text-blue-300'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                          }`}
                          title="View all inquiries across all forms"
                        >
                          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${isMessagesActive && !currentFormParam ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-slate-400'}`} />
                            <span className="truncate">All Inquiries</span>
                          </div>
                        </Link>

                        {/* Each created form */}
                        {formsList.map((f, idx) => {
                          const formKey = f.slug || f.id || (f as any)._id || `form-${idx}`;
                          const isCurrentForm =
                            isMessagesActive &&
                            currentFormParam &&
                            (currentFormParam.toLowerCase() === f.slug?.toLowerCase() ||
                              currentFormParam.toLowerCase() === f.title?.toLowerCase() ||
                              currentFormParam === f.id ||
                              currentFormParam === (f as any)._id);

                          return (
                            <Link
                              key={formKey}
                              href={`/admin/contact?form=${encodeURIComponent(f.slug || f.title)}`}
                              prefetch={false}
                              onClick={() => setCurrentFormParam(f.slug || f.title)}
                              className={`group/sub flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                                isCurrentForm
                                  ? 'bg-blue-50 text-blue-700 font-bold dark:bg-blue-950/50 dark:text-blue-300'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                              }`}
                              title={`${f.title} (${f.slug})`}
                            >
                              <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                                <FormInput className={`h-3.5 w-3.5 shrink-0 ${isCurrentForm ? 'text-blue-600' : 'text-teal-600 dark:text-teal-400'}`} />
                                <span className="truncate">{f.title}</span>
                              </div>
                              {f.slug && (
                                <span className="text-[9px] font-mono font-medium text-slate-400 group-hover/sub:text-slate-600 shrink-0 ml-1 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded">
                                  {f.slug.length > 12 ? f.slug.slice(0, 10) + '..' : f.slug}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Quick Configure Forms Link */}
                      <div className="mt-1.5 pt-1.5 border-t border-border/40 px-1">
                        <Link
                          href="/admin/forms"
                          prefetch={false}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 text-slate-500 hover:text-blue-700 dark:border-slate-800 dark:hover:bg-blue-950/30 text-[11px] font-semibold py-1.5 transition shadow-2xs"
                          title="Create and configure lead forms & modals"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Create / Manage Forms</span>
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
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-600/25 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {/* Sidebar Footer */}
        <div className="border-t border-border/80 p-2.5 space-y-2 bg-card">
          {/* View Live Site Quick Action */}
          <Link
            href="/"
            target="_blank"
            className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-950/40 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="View Live Site"
          >
            <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/60 dark:group-hover:text-blue-300 transition-colors">
              <Globe className="h-3.5 w-3.5 shrink-0" />
            </div>
            {!collapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate">View live site</span>
                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-1 shrink-0" />
              </div>
            )}
          </Link>

          {/* User Profile Card */}
          {user && (
            <div
              className={`relative flex items-center gap-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-2 transition-all ${
                collapsed ? 'justify-center p-1.5' : ''
              }`}
            >
              {/* Avatar with optional image and status indicator */}
              <div className="relative shrink-0">
                <Avatar className="h-8 w-8 ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs">
                  {(user as any)?.avatar_url && (
                    <AvatarImage src={(user as any).avatar_url} alt={user.email || 'Admin'} />
                  )}
                  <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-slate-900"
                  title="Online"
                />
              </div>

              {/* User info & Sign out button */}
              {!collapsed && (
                <>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                      {user.name || (user.email ? user.email.split('@')[0] : 'Admin')}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5" title={user.email}>
                      {user.email}
                    </span>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Collapsed Sign Out Button */}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="w-full h-8 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
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