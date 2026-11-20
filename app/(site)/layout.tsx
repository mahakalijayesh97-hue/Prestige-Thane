export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Script from 'next/script';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { EarlyAccessModalContainer } from '@/components/home/early-access-modal';
import { PropertyAdvisorChat } from '@/components/layout/property-advisor-chat';
import { ExternalScriptsLoader } from '@/components/layout/external-scripts';
import { GlobalThemeProvider } from '@/components/layout/global-theme-provider';
import { MaintenanceScreen } from '@/components/layout/maintenance-screen';
import { getGlobalThemeSettings } from '@/lib/data';
import { parseCdnTags } from '@/lib/cdn-tags';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const theme = await getGlobalThemeSettings();

  // Combine header_scripts and any HTML link/script tags present in custom_css
  const tagsFromCss = (theme.custom_css || '').match(/<(?:link|script)[^>]*>[\s\S]*?(?:<\/(?:link|script)>|\/?>)/gi) || [];
  const combinedHeaderMarkup = `${theme.header_scripts || ''}\n${tagsFromCss.join('\n')}`.trim();
  const cdnTags = parseCdnTags(combinedHeaderMarkup);

  const cleanCustomCss = (theme.custom_css || '')
    .replace(/<link[^>]*\/?>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/gi, '')
    .trim();

  // If website is put into scheduled downtime / maintenance mode
  if (theme.maintenance_mode) {
    return (
      <MaintenanceScreen
        title={theme.maintenance_title}
        message={theme.maintenance_message}
        until={theme.maintenance_until}
        showTimer={theme.maintenance_show_timer !== false}
        phone={theme.maintenance_support_phone}
        whatsapp={theme.maintenance_whatsapp}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Sitewide custom CSS (applies strictly to public website) */}
      {cleanCustomCss && (
        <style id="site-custom-css" dangerouslySetInnerHTML={{ __html: cleanCustomCss }} />
      )}

      {/* Sitewide CDN link and script tags */}
      {cdnTags.map((tag, idx) => {
        if (tag.type === 'link') {
          return <link key={`site-cdn-link-${idx}`} {...tag.props} />;
        }
        if (tag.type === 'script') {
          if (tag.props.src) {
            return (
              <Script
                key={`site-cdn-script-${tag.props.src}`}
                src={tag.props.src}
                strategy="afterInteractive"
              />
            );
          }
          if (tag.content) {
            return (
              <Script
                key={`site-cdn-inline-${idx}`}
                id={`site-cdn-inline-${idx}`}
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: tag.content }}
              />
            );
          }
        }
        return null;
      })}

      <ExternalScriptsLoader headerScripts={combinedHeaderMarkup} />

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

      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <EarlyAccessModalContainer />
      <PropertyAdvisorChat
        initialEnabled={theme.advisor_chat_enabled !== false}
        whatsappNumber={theme.advisor_chat_whatsapp || '919022222448'}
      />
    </div>
  );
}
