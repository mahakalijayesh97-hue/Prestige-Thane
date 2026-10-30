'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import type { NavItem } from '@/lib/types';

interface MobileNavProps {
  items: NavItem[];
  phone?: string;
  showPhone?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  showCta?: boolean;
}

export function MobileNav({
  items,
  phone,
  showPhone = true,
  ctaText = 'Book Site Visit',
  ctaUrl = '#book-site-visit',
  showCta = true,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center gap-2">
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute left-0 top-16 w-full border-b border-border bg-background px-4 pb-6 pt-3 shadow-xl space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-accent hover:text-foreground transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            {showPhone && phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-bold text-slate-800 border border-slate-200/80 hover:bg-slate-100 transition"
              >
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <span>{phone}</span>
              </a>
            )}

            {showCta && ctaText && (
              <a
                href={ctaUrl}
                onClick={() => setOpen(false)}
                data-modal="early-access"
                data-modal-title={ctaText}
                data-modal-source="Mobile Nav CTA"
                className="block w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-center text-sm font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition active:scale-98 cursor-pointer"
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}