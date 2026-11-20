'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ArrowLeft,
  Compass,
  Building2,
  Tag,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface QuickLinkItem {
  id: string;
  label: string;
  desc: string;
  url: string;
  icon?: string;
  enabled?: boolean;
}

interface ErrorPageConfig {
  badge_text: string;
  error_code: string;
  heading: string;
  subheading: string;
  primary_btn_text: string;
  primary_btn_url: string;
  secondary_btn_text: string;
  show_secondary_btn: boolean;
  quick_links: QuickLinkItem[];
  support_phone: string;
  whatsapp_number: string;
  whatsapp_text: string;
  show_support_strip: boolean;
}

const DEFAULT_CONFIG: ErrorPageConfig = {
  badge_text: 'Page Not Found • 404',
  error_code: '404',
  heading: 'The Luxury Residence You Are Looking For Seems Relocated',
  subheading:
    'The page or layout you requested does not exist or might have been renamed during recent pre-launch updates. Let us guide you back to the official township showcase.',
  primary_btn_text: 'Return to Homepage',
  primary_btn_url: '/',
  secondary_btn_text: 'Go Back',
  show_secondary_btn: true,
  quick_links: [
    {
      id: 'ql_1',
      label: 'Project Overview',
      desc: 'Master layout & 30+ acre luxury township',
      url: '/#overview',
      icon: 'compass',
      enabled: true,
    },
    {
      id: 'ql_2',
      label: 'Floor Plans',
      desc: '2, 3 & 4 BHK architectural layouts',
      url: '/#floor-plans',
      icon: 'building',
      enabled: true,
    },
    {
      id: 'ql_3',
      label: 'Pricing & Configurations',
      desc: 'Starting from ₹1.59 Cr* with early benefits',
      url: '/#pricing',
      icon: 'tag',
      enabled: true,
    },
    {
      id: 'ql_4',
      label: 'Official Sales Desk',
      desc: 'Speak with our certified project specialist',
      url: '/contact',
      icon: 'phone',
      enabled: true,
    },
  ],
  support_phone: '+91 90222 22448',
  whatsapp_number: '919022222448',
  whatsapp_text: 'Hi Prestige Thane Desk, I need assistance finding project details.',
  show_support_strip: true,
};

const ICON_MAP: Record<string, any> = {
  compass: Compass,
  building: Building2,
  tag: Tag,
  phone: Phone,
  home: Home,
};

export default function NotFound() {
  const [config, setConfig] = useState<ErrorPageConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    fetch('/api/settings/error-page', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setConfig({
            badge_text: data.badge_text || DEFAULT_CONFIG.badge_text,
            error_code: data.error_code || DEFAULT_CONFIG.error_code,
            heading: data.heading || DEFAULT_CONFIG.heading,
            subheading: data.subheading || DEFAULT_CONFIG.subheading,
            primary_btn_text: data.primary_btn_text || DEFAULT_CONFIG.primary_btn_text,
            primary_btn_url: data.primary_btn_url || DEFAULT_CONFIG.primary_btn_url,
            secondary_btn_text: data.secondary_btn_text || DEFAULT_CONFIG.secondary_btn_text,
            show_secondary_btn: data.show_secondary_btn !== false,
            quick_links: Array.isArray(data.quick_links) ? data.quick_links : DEFAULT_CONFIG.quick_links,
            support_phone: data.support_phone || DEFAULT_CONFIG.support_phone,
            whatsapp_number: data.whatsapp_number || DEFAULT_CONFIG.whatsapp_number,
            whatsapp_text: data.whatsapp_text || DEFAULT_CONFIG.whatsapp_text,
            show_support_strip: data.show_support_strip !== false,
          });
        }
      })
      .catch(() => {});
  }, []);

  const activeLinks = config.quick_links.filter((l) => l.enabled !== false);
  const waUrl = `https://api.whatsapp.com/send?phone=${config.whatsapp_number}&text=${encodeURIComponent(
    config.whatsapp_text
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060D17] via-[#0A1628] to-[#040810] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30">
      {/* ─── AMBIENT BACKGROUND GLOWS ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-blue-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── TOP NAVBAR BRAND STRIP ─── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/5 p-1.5 border border-amber-500/30 transition-transform group-hover:scale-105">
            <Image
              src="/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png"
              alt="Prestige Group"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wider uppercase text-white font-serif">
              Prestige Thane
            </span>
            <span className="text-[10px] tracking-widest text-amber-400 font-semibold uppercase">
              Luxury Living
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {config.support_phone && (
            <a
              href={`tel:${config.support_phone.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition text-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.support_phone}</span>
            </a>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* ─── MAIN HERO ERROR CARD ─── */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center my-auto">
        {/* Luxury Badge */}
        {config.badge_text && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{config.badge_text}</span>
          </div>
        )}

        {/* Big Error Code Display */}
        <div className="relative mb-4">
          <h1 className="text-8xl sm:text-9xl md:text-[11rem] font-serif font-black tracking-tight leading-none bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 bg-clip-text text-transparent select-none drop-shadow-[0_10px_25px_rgba(217,119,6,0.3)]">
            {config.error_code}
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <span className="text-[12rem] font-serif font-black text-amber-400 blur-2xl">
              {config.error_code}
            </span>
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-wide max-w-2xl mx-auto">
          {config.heading}
        </h2>
        {config.subheading && (
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            {config.subheading}
          </p>
        )}

        {/* Primary Call to Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href={config.primary_btn_url || '/'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 hover:from-amber-400 hover:to-amber-600 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{config.primary_btn_text}</span>
          </Link>

          {config.show_secondary_btn && (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = '/';
                  }
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{config.secondary_btn_text}</span>
            </button>
          )}
        </div>

        {/* ─── QUICK EXPLORATION CARDS GRID ─── */}
        {activeLinks.length > 0 && (
          <div className="mt-14 pt-10 border-t border-white/10 text-left">
            <div className="text-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Popular Township Sections
              </h3>
              <p className="text-xs text-slate-400 mt-1">Explore key details directly from here</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {activeLinks.map((item) => {
                const IconComponent = (item.icon && ICON_MAP[item.icon]) || Compass;
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/50 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs text-slate-500 group-hover:text-amber-400 transition-colors">
                        →
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.label}
                      </h4>
                      {item.desc && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ─── FOOTER DIRECT ASSISTANCE STRIP ─── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span>© {new Date().getFullYear()} Prestige Thane. All Rights Reserved.</span>
        </div>

        {config.show_support_strip && (
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Need immediate help?</span>
            {config.whatsapp_number && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Advisor</span>
              </a>
            )}
            {config.support_phone && (
              <a
                href={`tel:${config.support_phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Desk</span>
              </a>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
