import Link from 'next/link';
import { getFooter, getSettings, getFooterCustomSettings, getGlobalThemeSettings } from '@/lib/data';
import { CustomFooterRenderer } from '@/components/layout/custom-footer-renderer';
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export async function Footer() {
  const [footer, settings, footerCustom, theme] = await Promise.all([
    getFooter(),
    getSettings(),
    getFooterCustomSettings(),
    getGlobalThemeSettings(),
  ]);
  const { columns, links } = footer;

  const hasCustomFooter = Boolean(
    footerCustom.custom_html || footerCustom.custom_css || footerCustom.custom_js
  );

  if (hasCustomFooter && !footerCustom.show_default_links) {
    return (
      <footer className="mt-auto w-full overflow-x-hidden border-t border-slate-900 bg-slate-950 p-0 text-slate-400 [content-visibility:auto] [contain-intrinsic-size:1px_400px]" id="main-footer">
        {footerCustom.footer_image && (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-xl border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={footerCustom.footer_image}
                alt="Footer Banner"
                className="h-auto max-h-48 w-full object-cover"
              />
            </div>
          </div>
        )}
        <CustomFooterRenderer
          html={footerCustom.custom_html}
          css={footerCustom.custom_css}
          js={footerCustom.custom_js}
        />
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40 [content-visibility:auto] [contain-intrinsic-size:1px_400px]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Optional Custom Footer Image / Banner */}
        {footerCustom.footer_image && (
          <div className="mb-8 overflow-hidden rounded-xl border border-border/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={footerCustom.footer_image}
              alt="Footer Banner"
              className="h-auto max-h-48 w-full object-cover"
            />
          </div>
        )}

        {/* Custom HTML, CSS, and JS injected into Footer */}
        {(footerCustom.custom_html ||
          footerCustom.custom_css ||
          footerCustom.custom_js) && (
          <div className="mb-8">
            <CustomFooterRenderer
              html={footerCustom.custom_html}
              css={footerCustom.custom_css}
              js={footerCustom.custom_js}
            />
          </div>
        )}

        {/* Standard Footer Columns & Branding */}
        {footerCustom.show_default_links && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                {settings?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.logo_url}
                    alt={settings.site_name}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {settings?.site_name?.charAt(0) ?? 'A'}
                  </span>
                )}
                <div className="flex flex-col leading-tight">
                  <span className="site-brand-title text-base sm:text-lg font-bold">
                    {settings?.site_name ?? 'Site'}
                  </span>
                  {theme?.sub_site_name && (
                    <span className="sub-site-title text-[10px] sm:text-xs font-medium -mt-0.5">
                      {theme.sub_site_name}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{settings?.tagline}</p>
              <div className="flex items-center gap-2 pt-1">
                {settings?.social_twitter && (
                  <a
                    href={settings.social_twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {settings?.social_facebook && (
                  <a
                    href={settings.social_facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings?.social_instagram && (
                  <a
                    href={settings.social_instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings?.social_linkedin && (
                  <a
                    href={settings.social_linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {columns.slice(0, 3).map((col) => (
              <div key={col.id} className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {links
                    .filter((l) => l.column_id === col.id)
                    .map((link) => (
                      <li key={link.id}>
                        <Link
                          href={link.url}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  {links.filter((l) => l.column_id === col.id).length === 0 && (
                    <li className="text-sm text-muted-foreground/60">
                      No links yet.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Contact info strip */}
        {(settings?.contact_email ||
          settings?.contact_phone ||
          settings?.contact_address) && (
          <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            {settings?.contact_email && (
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {settings.contact_email}
              </span>
            )}
            {settings?.contact_phone && (
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {settings.contact_phone}
              </span>
            )}
            {settings?.contact_address && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {settings.contact_address}
              </span>
            )}
          </div>
        )}

        {/* Copyright notice */}
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {settings?.copyright_text ??
            `© ${new Date().getFullYear()} ${settings?.site_name ?? 'Site'}. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}
