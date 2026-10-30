'use client';

import { useEffect } from 'react';

interface GlobalThemeProviderProps {
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  headingColor?: string;
  mutedTextColor?: string;
  siteNameColor?: string;
  subSiteNameColor?: string;
  customCss?: string;
  customJs?: string;
}

// Convert HEX color to HSL for Tailwind CSS variable compatibility
function hexToHsl(hex: string): string | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6 && clean.length !== 3) return null;

  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) / 255;
    g = parseInt(clean[1] + clean[1], 16) / 255;
    b = parseInt(clean[2] + clean[2], 16) / 255;
  } else {
    r = parseInt(clean.substring(0, 2), 16) / 255;
    g = parseInt(clean.substring(2, 4), 16) / 255;
    b = parseInt(clean.substring(4, 6), 16) / 255;
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `${hDeg} ${sPct}% ${lPct}%`;
}

export function GlobalThemeProvider({
  primaryColor = '#2563eb',
  accentColor = '#f59e0b',
  textColor = '#1e293b',
  headingColor = '#0f172a',
  mutedTextColor = '#64748b',
  siteNameColor = '#0f172a',
  subSiteNameColor = '#64748b',
  customCss = '',
  customJs = '',
}: GlobalThemeProviderProps) {
  useEffect(() => {
    if (!customJs) return;

    try {
      // Execute global custom JavaScript
      const scriptFn = new Function('document', 'window', customJs);
      scriptFn(document, window);
    } catch (err) {
      console.error('Error executing global custom JavaScript:', err);
    }
  }, [customJs]);

  const primaryHsl = hexToHsl(primaryColor);
  const accentHsl = hexToHsl(accentColor);
  const textHsl = hexToHsl(textColor);
  const mutedTextHsl = hexToHsl(mutedTextColor);

  return (
    <>
      <style
        id="global-brand-theme-styles"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              ${primaryHsl ? `--primary: ${primaryHsl};` : ''}
              ${accentHsl ? `--accent: ${accentHsl};` : ''}
              ${textHsl ? `--foreground: ${textHsl};` : ''}
              ${mutedTextHsl ? `--muted-foreground: ${mutedTextHsl};` : ''}
              --brand-primary-hex: ${primaryColor};
              --brand-accent-hex: ${accentColor};
              --brand-text-hex: ${textColor};
              --brand-heading-hex: ${headingColor};
              --brand-muted-text-hex: ${mutedTextColor};
              --brand-sitename-hex: ${siteNameColor};
              --brand-subsitename-hex: ${subSiteNameColor};
            }
            body {
              color: ${textColor};
            }
            h1, h2, h3, h4, h5, h6 {
              color: ${headingColor};
            }
            .prose-content p, .prose-content li {
              color: ${textColor};
            }
            .text-muted-foreground {
              color: ${mutedTextColor} !important;
            }
            .site-brand-title {
              color: ${siteNameColor} !important;
            }
            .sub-site-title {
              color: ${subSiteNameColor} !important;
            }
            ${customCss}
          `,
        }}
      />
    </>
  );
}

export default GlobalThemeProvider;
