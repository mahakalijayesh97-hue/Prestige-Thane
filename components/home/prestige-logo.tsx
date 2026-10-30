'use client';

import React from 'react';

export interface PrestigeLogoProps {
  size?: 'badge' | 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  logoUrl?: string;
}

export const PrestigeLogo: React.FC<PrestigeLogoProps> = ({
  className = '',
  logoUrl = '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.webp',
}) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt="Prestige Group"
        width={48}
        height={48}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain select-none"
        onError={(e) => {
          // If the custom uploaded logo is missing, fallback to inline SVG badge
          const target = e.target as HTMLElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};