'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export interface SaveLacsBadgeProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export const SaveLacsBadge: React.FC<SaveLacsBadgeProps> = ({
  text = 'SAVE UPTO ₹5 LACS*',
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/90 to-amber-50 px-3.5 py-1 text-slate-900 shadow-xs transition hover:scale-[1.02] hover:border-amber-400 hover:shadow-md cursor-pointer select-none ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
        {text}
      </span>
      <span className="rounded bg-black/80 px-1.5 py-0.2 text-[9px] font-black tracking-wider text-amber-300 uppercase">
        VIP
      </span>
    </button>
  );
};

