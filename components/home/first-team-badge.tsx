'use client';

import React from 'react';

export interface FirstTeamBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  withShadow?: boolean;
  textColor?: string;
  className?: string;
}

export const FirstTeamBadge: React.FC<FirstTeamBadgeProps> = ({
  size = 'sm',
  className = '',
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-between overflow-hidden rounded-xl border border-amber-300/80 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 p-1 text-center shadow-xs select-none w-full h-full min-h-[64px] min-w-[64px] ${className}`}
    >
      {/* Top Banner: AUTHORIZED */}
      <div className="w-full rounded-t-md bg-black/85 py-0.5 px-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-amber-300">
        AUTHORIZED
      </div>

      {/* Middle: Sales Partner */}
      <div className="py-0.5 px-1">
        <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase leading-tight text-white drop-shadow-sm font-sans">
          Sales
        </span>
        <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase leading-tight text-slate-900 font-sans">
          Partner
        </span>
      </div>

      {/* Bottom: F1 First Team */}
      <div className="w-full rounded-md bg-white py-0.5 px-1 flex items-center justify-center gap-1 shadow-2xs">
        <span className="inline-block rounded bg-black px-1 py-0.2 text-[8px] sm:text-[9px] font-black text-amber-400">
          F1
        </span>
        <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-900 leading-none">
          First Team.
        </span>
      </div>
    </div>
  );
};

