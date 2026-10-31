import Link from 'next/link';
import { getNavItems, getSettings, getGlobalThemeSettings } from '@/lib/data';
import type { NavItem } from '@/lib/types';
import { Phone } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          {settings?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url.replace(/\.png$/, '.webp')}
              alt={settings.site_name}
              width={32}
              height={32}
              fetchPriority="high"
              decoding="async"
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {settings?.site_name?.charAt(0) ?? 'A'}
            </span>
          )}
          <div className="flex flex-col leading-tight">
            <span className="site-brand-title text-base sm:text-lg font-bold tracking-tight">
              {settings?.site_name ?? 'Prestige Thane'}
            </span>
            {theme?.sub_site_name && (
              <span className="sub-site-title text-[10px] sm:text-xs font-medium tracking-normal -mt-0.5">
                {theme.sub_site_name}
              </span>
            )}
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
                    className="rounded-md px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-0 top-full w-48 translate-y-1 rounded-lg border border-border bg-popover p-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.url}
                        className="block rounded-md px-3 py-2 text-xs xl:text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
                className="rounded-md px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground whitespace-nowrap"
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
              className="hidden lg:flex items-center gap-2 text-xs xl:text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors whitespace-nowrap group"
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
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs xl:text-sm font-bold px-4 xl:px-6 py-2 shadow-md hover:shadow-lg transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
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
