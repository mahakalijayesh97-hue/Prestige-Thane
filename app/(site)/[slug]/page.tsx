import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getPublishedPage, getPublishedPages } from '@/lib/data';
import { CustomPageRenderer } from '@/components/page/custom-page-renderer';
import { ExternalScriptsLoader } from '@/components/layout/external-scripts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const pages = await getPublishedPages();
    return pages
      .filter((p) => p.slug && p.slug !== 'home')
      .map((page) => ({ slug: page.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const page = await getPublishedPage(params.slug);
  if (!page) return {};
  return {
    title: page.seo_title ?? page.title,
    description: page.meta_description ?? undefined,
    keywords: page.meta_keywords?.split(',').map((k) => k.trim()) ?? undefined,
  };
}

export default async function PagePage({ params }: Props) {
  const page = await getPublishedPage(params.slug);
  if (!page) notFound();

  const hasContent = Boolean(page.content && page.content.trim());

  return (
    <>
      {page.hide_from_nav && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #site-navbar,
              .site-navbar,
              header.sticky,
              header[class*="sticky"] {
                display: none !important;
              }
            `,
          }}
        />
      )}

      {/* Ensure Tailwind CDN is active for custom blocks and pages with Tailwind classes */}
      {(page.enable_tailwind_cdn || (page.content && (page.content.includes('bg-') || page.content.includes('text-') || page.content.includes('flex') || page.content.includes('grid')))) && (
        <Script
          key={`page-tailwind-cdn-${page.slug}`}
          src="https://cdn.tailwindcss.com"
          strategy="afterInteractive"
        />
      )}

      {/* Page-level head scripts */}
      {page.head_scripts && (
        <ExternalScriptsLoader headerScripts={page.head_scripts} />
      )}

      {/* Page-level custom CSS */}
      {page.custom_css && (
        <style
          id={`page-custom-css-${page.slug}`}
          dangerouslySetInnerHTML={{ __html: page.custom_css }}
        />
      )}

      {/* Page-level custom JS */}
      {page.custom_js && (
        <Script
          key={`page-custom-js-${page.slug}`}
          id={`page-custom-js-${page.slug}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `try { ${page.custom_js} } catch(e) { console.error('Error in custom page JS:', e); }`,
          }}
        />
      )}

      <main className="w-full">
        {page.hero_image && (
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.hero_image}
              alt={page.title}
              fetchPriority="high"
              decoding="async"
              className="mb-8 aspect-[16/7] w-full rounded-xl object-cover"
            />
          </div>
        )}
        {!hasContent ? (
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
          </div>
        ) : (
          <CustomPageRenderer content={page.content} className="prose-content w-full max-w-none" />
        )}
      </main>
    </>
  );
}
