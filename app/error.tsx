'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  RotateCcw,
  AlertTriangle,
  Phone,
  MessageCircle,
} from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#060D17] via-[#0A1628] to-[#040810] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-amber-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-red-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
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
              Luxury Living
            </span>
          </div>
        </Link>
      </header>

      {/* Main Error Body */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Temporary System Notice</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wide">
          Something Unexpected Occurred
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
          We encountered a brief disruption while loading this section. Our pre-launch services are active, and you can reload or return to the main showcase.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <span>© {new Date().getFullYear()} Prestige Thane. All Rights Reserved.</span>
        <div className="flex items-center gap-4">
          <a
            href="tel:+919022222448"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 90222 22448</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
