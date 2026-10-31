// @ts-ignore Next.js processes this global stylesheet import.
import './globals.css';
import '@/lib/patch-streams';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getGlobalThemeSettings, getSettings } from '@/lib/data';
import { GlobalThemeProvider } from '@/components/layout/global-theme-provider';
import { ExternalScriptsLoader } from '@/components/layout/external-scripts';

// Server-side theme CSS builder (avoids client-side JS injection delay → eliminates CLS & FCP penalty)
function buildServerThemeCss(theme: {
  primary_color?: string;
  accent_color?: string;
  text_color?: string;
  heading_color?: string;
  muted_text_color?: string;
  site_name_color?: string;
  sub_site_name_color?: string;
  custom_css?: string;
}): string {
  const p = theme.primary_color || '#2563eb';
  const a = theme.accent_color || '#f59e0b';
  const t = theme.text_color || '#1e293b';
  const h = theme.heading_color || '#0f172a';
  const m = theme.muted_text_color || '#64748b';
  const s = theme.site_name_color || '#0f172a';
  const sub = theme.sub_site_name_color || '#64748b';
  return `
    :root{--brand-primary-hex:${p};--brand-accent-hex:${a};--brand-text-hex:${t};--brand-heading-hex:${h};--brand-muted-text-hex:${m};--brand-sitename-hex:${s};--brand-subsitename-hex:${sub}}
    body{color:${t}}
    h1,h2,h3,h4,h5,h6{color:${h}}
    .prose-content p,.prose-content li{color:${t}}
    .text-muted-foreground{color:${m}!important}
    .site-brand-title{color:${s}!important}
    .sub-site-title{color:${sub}!important}
    ${theme.custom_css || ''}
  `.replace(/\s+/g, ' ').trim();
}

const inter = Inter({ subsets: ['latin'], display: 'swap' });
export async function generateMetadata(): Promise<Metadata> {
  const [theme, settings] = await Promise.all([
    getGlobalThemeSettings(),
    getSettings(),
  ]);
  // Prefer webp for favicon — smaller, faster
  const rawIcon = theme.favicon_url || settings?.logo_url || '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.webp';
  const icon = rawIcon.replace(/\.png$/, '.webp');
  return {
    title: settings?.site_name ? `${settings.site_name} | ${settings.tagline || 'Official'}` : 'Acme CMS',
    description: settings?.tagline || 'A modern, fully dynamic content management system.',
    icons: {
      icon: icon,
      shortcut: icon,
      apple: icon,
    },
  };
}

function parseCdnTags(html: string) {
  if (!html) return [];
  const tags: Array<{ type: 'link' | 'script'; props: Record<string, string>; content?: string }> = [];

  // Match <link ...> tags
  const linkRegex = /<link\s+([^>]+?)\/?>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrString = match[1];
    const props: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      props[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    tags.push({ type: 'link', props });
  }

  // Match <script ...>...</script>
  const scriptRegex = /<script\s*([^>]*)>([\s\S]*?)<\/script>/gi;
  while ((match = scriptRegex.exec(html)) !== null) {
    const attrString = match[1];
    const content = match[2];
    const props: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      props[attrMatch[1].toLowerCase()] = attrMatch[2];
    }
    tags.push({ type: 'script', props, content });
  }

  return tags;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getGlobalThemeSettings();
  const cdnTags = parseCdnTags(theme.header_scripts);
  // Build critical theme CSS server-side so it's in the first HTML byte — no FOUC, no CLS
  const criticalThemeCss = buildServerThemeCss(theme);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical brand theme CSS — server-rendered to eliminate layout shift */}
        <style id="global-brand-theme-styles" dangerouslySetInnerHTML={{ __html: criticalThemeCss }} />

        {theme.favicon_url ? (
          <>
            <link rel="icon" href={theme.favicon_url} />
            <link rel="shortcut icon" href={theme.favicon_url} />
            <link rel="apple-touch-icon" href={theme.favicon_url} />
          </>
        ) : null}

        {/* Preconnect to external image domains for faster gallery loads */}
        <link rel="preconnect" href="https://prestige-new-projects.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://prestige-new-projects.com" />

        {/* Preload Critical LCP image - hero background */}
        <link rel="preload" as="image" href="/assets/prestige-hero-bg.webp" type="image/webp" fetchPriority="high" />
        {cdnTags.map((tag, idx) => {
          if (tag.type === 'link') {
            return <link key={`admin-cdn-link-${idx}`} {...tag.props} />;
          }
          if (tag.type === 'script') {
            if (tag.props.src) {
              return <script key={`admin-cdn-script-${idx}`} defer {...tag.props} />;
            }
            if (tag.content) {
              return (
                <script
                  key={`admin-cdn-script-${idx}`}
                  dangerouslySetInnerHTML={{ __html: tag.content }}
                  {...tag.props}
                />
              );
            }
          }
          return null;
        })}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ExternalScriptsLoader headerScripts={theme.header_scripts} />
        {/* GlobalThemeProvider only needed for customJs execution and dynamic color updates */}
        <GlobalThemeProvider
          primaryColor={theme.primary_color}
          accentColor={theme.accent_color}
          textColor={theme.text_color}
          headingColor={theme.heading_color}
          mutedTextColor={theme.muted_text_color}
          siteNameColor={theme.site_name_color}
          subSiteNameColor={theme.sub_site_name_color}
          customCss=""
          customJs={theme.custom_js}
        />
        {children}
      </body>
    </html>
  );
}
