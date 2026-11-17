import Link from 'next/link';
import { getNavItems, getSettings, getGlobalThemeSettings, getPublishedPages } from '@/lib/data';
import type { NavItem } from '@/lib/types';
import { Phone, ChevronDown } from 'lucide-react';
import { MobileNav } from './mobile-nav';

export async function Navbar() {
  const [items, settings, theme] = await Promise.all([
    getNavItems(),
    getSettings(),
    getGlobalThemeSettings(),
  ]);

  const activeItems = (items || []).filter((i) => i.is_active !== false);
  const topLevel = activeItems.filter((i) => !i.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const childrenOf = (id: string) =>
    activeItems.filter((i) => i.parent_id === id).sort((a, b) => a.sort_order - b.sort_order);

  const phone = theme.navbar_phone ?? '+91 90222 22448';
  const showPhone = theme.navbar_phone_show !== false && !!phone;
  const ctaText = theme.navbar_cta_text ?? 'Book Site Visit';
  const ctaUrl = theme.navbar_cta_url || '#book-site-visit';
  const showCta = theme.navbar_cta_show !== false && !!ctaText;

  return (
    <header id="site-navbar" className="site-navbar sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {settings?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={settings?.site_name ?? 'Prestige Thane'}
              width={32}
              height={32}
              fetchPriority="high"
              decoding="async"
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-600 text-sm font-bold text-white">
              {settings?.site_name?.charAt(0) ?? 'P'}
            </span>
          )}
          <div className="flex flex-col leading-tight">
            <span
              className="site-brand-title text-base sm:text-lg font-bold tracking-tight text-slate-900"
              style={theme?.site_name_color ? { color: theme.site_name_color } : undefined}
            >
              {settings?.site_name ?? 'Prestige Thane'}
            </span>
            <span
              className="sub-site-title text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-amber-600 -mt-0.5"
              style={theme?.sub_site_name_color ? { color: theme.sub_site_name_color } : undefined}
            >
              {theme?.sub_site_name || 'PHASE 1'}
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {topLevel.map((item) => {
            const children = childrenOf(item.id);
            if (children.length > 0) {
              return (
                <div key={item.id} className="group relative">
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 rounded-lg px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700 transition-transform" />
                  </Link>
                  <div className="invisible absolute left-0 top-full mt-1 w-48 translate-y-1 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.url}
                        target={child.target === '_blank' ? '_blank' : undefined}
                        className="block rounded-lg px-3 py-2 text-xs xl:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.id}
                href={item.url}
                target={item.target === '_blank' ? '_blank' : undefined}
                className="rounded-lg px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Phone & CTA Button (Desktop) + Mobile Menu */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Phone Link */}
          {showPhone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hidden lg:flex items-center gap-1.5 text-xs xl:text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors whitespace-nowrap group"
            >
              <Phone className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="tracking-tight">{phone}</span>
            </a>
          )}

          {/* Book Site Visit CTA Button */}
          {showCta && (
            <a
              href={ctaUrl}
              data-modal="early-access"
              data-modal-title={ctaText}
              data-modal-source="Navbar CTA Button"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs xl:text-sm font-bold px-4 xl:px-5 py-2 shadow-sm hover:shadow-md transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {ctaText}
            </a>
          )}

          {/* Mobile Navigation Drawer */}
          <MobileNav
            items={topLevel}
            phone={phone}
            showPhone={showPhone}
            ctaText={ctaText}
            ctaUrl={ctaUrl}
            showCta={showCta}
          />
        </div>
      </div>
    </header>
  );
}
