'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
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
  LogOut,
  Link2,
  PanelLeftClose,
  PanelLeft,
  PanelTop,
  Sparkles,
  FormInput,
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
  '/admin/footer': ['/api/footer/custom'],
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

  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
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
        <nav className="flex-1 space-y-1 p-2">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
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
    </div>
  );
}