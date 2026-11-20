'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Wrench,
  Sparkles,
  Phone,
  MessageCircle,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface MaintenanceScreenProps {
  title?: string;
  message?: string;
  until?: string;
  showTimer?: boolean;
  phone?: string;
  whatsapp?: string;
}

export function MaintenanceScreen({
  title = 'Website Under Scheduled Maintenance',
  message = 'We are currently performing scheduled maintenance and performance upgrades. We will be back online shortly.',
  until = '',
  showTimer = true,
  phone = '+91 90222 22448',
  whatsapp = '919022222448',
}: MaintenanceScreenProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  useEffect(() => {
    if (!until) return;

    function calculate() {
      const targetTime = new Date(until).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (isNaN(targetTime)) {
        setTimeLeft(null);
        return;
      }

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [until]);

  const waUrl = `https://api.whatsapp.com/send?phone=${whatsapp.replace(
    /\D/g,
    ''
  )}&text=${encodeURIComponent(
    'Hi Prestige Thane Sales Desk, I noticed the website is under maintenance. I would like to get direct project details and price updates.'
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060D17] via-[#0A1628] to-[#040810] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30">
      {/* ─── AMBIENT BACKGROUND GLOWS ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-blue-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── TOP NAVBAR BRAND STRIP ─── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/5 p-1.5 border border-amber-500/30">
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
              Pre-Launch Township
            </span>
          </div>
        </div>

        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition text-slate-200"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{phone}</span>
          </a>
        )}
      </header>

      {/* ─── MAIN HERO CONTENT ─── */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center my-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-6">
          <Wrench className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Scheduled Maintenance</span>
        </div>

        {/* Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wide max-w-2xl mx-auto">
          {title}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {message}
        </p>

        {/* ─── COUNTDOWN TIMER (IF CONFIGURED) ─── */}
        {showTimer && until && timeLeft && (
          <div className="mt-10 p-6 rounded-3xl bg-white/[0.04] border border-white/10 max-w-xl mx-auto backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{timeLeft.isPast ? 'Maintenance Finishing Up' : 'Expected Back Online In'}</span>
            </div>

            {timeLeft.isPast ? (
              <div className="space-y-3 py-2">
                <p className="text-sm text-slate-300">
                  Our system updates have concluded. The website will be fully live momentarily.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload Website</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col items-center"
                  >
                    <span className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── DIRECT HELPLINE ACTIONS ─── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {whatsapp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200 font-semibold text-sm transition-all"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Helpline ({phone})</span>
            </a>
          )}
        </div>
      </main>

      {/* ─── FOOTER DIRECT ASSISTANCE & ADMIN BYPASS ─── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>© {new Date().getFullYear()} Prestige Thane. All Rights Reserved.</span>
        </div>

        <div>
          <Link
            href="/admin/login"
            className="text-slate-500 hover:text-slate-300 transition text-[11px] underline underline-offset-4"
          >
            Admin Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
