'use client';

import React from 'react';

export interface PresentingDotProps {
  text?: string;
  className?: string;
}

export const PresentingDotDisplacement: React.FC<PresentingDotProps> = ({
  text = 'PRESENTING',
  className = '',
}) => {
  return (
    <div
      className={`relative flex h-full min-h-[58px] sm:min-h-[64px] items-center justify-center overflow-hidden rounded-xl border border-slate-200/90 bg-white p-2 shadow-2xs select-none ${className}`}
    >
      {/* Halftone / Dot Matrix Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
          backgroundSize: '6px 6px',
        }}
      />

      {/* Center Pill with Accents */}
      <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
        <span className="h-[1px] w-3 sm:w-5 bg-gradient-to-r from-transparent to-slate-400" />
        <span className="rounded-full border border-slate-300/80 bg-white/95 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-slate-800 shadow-xs">
          {text}
        </span>
        <span className="h-[1px] w-3 sm:w-5 bg-gradient-to-l from-transparent to-slate-400" />
      </div>
    </div>
  );
};

