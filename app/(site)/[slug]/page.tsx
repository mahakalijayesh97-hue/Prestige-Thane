import { notFound } from 'next/navigation';
import { getPublishedPage, getPublishedPages } from '@/lib/data';
import { CustomPageRenderer } from '@/components/page/custom-page-renderer';

// Revalidate every 60 seconds — serves instant cached pages while keeping content fresh
export const revalidate = 10;

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
      {page.head_scripts && (
        <div
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{ __html: page.head_scripts }}
        />
      )}
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {page.hero_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.hero_image}
            alt={page.title}
            fetchPriority="high"
            decoding="async"
            className="mb-8 aspect-[16/7] w-full rounded-xl object-cover"
          />
        )}
        <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
        <CustomPageRenderer content={page.content} className="prose-content mt-6 max-w-none" />
      </article>
    </>
  );
}
