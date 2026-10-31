// @ts-ignore Next.js processes this global stylesheet import.
import './globals.css';
import '@/lib/patch-streams';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getGlobalThemeSettings, getSettings } from '@/lib/data';
import { GlobalThemeProvider } from '@/components/layout/global-theme-provider';
import { ExternalScriptsLoader } from '@/components/layout/external-scripts';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const [theme, settings] = await Promise.all([
    getGlobalThemeSettings(),
    getSettings(),
  ]);
  const icon = theme.favicon_url || settings?.logo_url || '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.webp';
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {theme.favicon_url ? (
          <>
            <link rel="icon" href={theme.favicon_url} />
            <link rel="shortcut icon" href={theme.favicon_url} />
            <link rel="apple-touch-icon" href={theme.favicon_url} />
          </>
        ) : null}

        {/* Preload Critical Image */}
        <link rel="preload" as="image" href="/assets/prestige-hero-bg.webp" type="image/webp" />
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
        <GlobalThemeProvider
          primaryColor={theme.primary_color}
          accentColor={theme.accent_color}
          textColor={theme.text_color}
          headingColor={theme.heading_color}
          mutedTextColor={theme.muted_text_color}
          siteNameColor={theme.site_name_color}
          subSiteNameColor={theme.sub_site_name_color}
          customCss={theme.custom_css}
          customJs={theme.custom_js}
        />
        {children}
      </body>
    </html>
  );
}
