import Link from 'next/link';
import { getBanners, getPublishedPages, getPublishedPosts, getSettings } from '@/lib/data';
import { CustomPageRenderer } from '@/components/page/custom-page-renderer';
import { filterHomePageSections, buildPageContent } from '@/lib/page-content';
import { PRESTIGE_HERO_TEMPLATE } from '@/lib/templates/hero-template';
import { Newspaper } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [banners, pages, posts, settings] = await Promise.all([
    getBanners(),
    getPublishedPages(),
    getPublishedPosts(),
    getSettings(),
  ]);
  const hero = banners[0];
  const homePage = pages.find((p) => p.is_homepage) ?? pages[0];
  const recentPosts = posts.slice(0, 3);

  const publishedSlugs = new Set(pages.map((p) => p.slug));
  const fallbackHomeContent = buildPageContent(PRESTIGE_HERO_TEMPLATE);
  const renderedContent = homePage?.content
    ? filterHomePageSections(homePage.content, publishedSlugs)
    : fallbackHomeContent;

  // Other published pages to render as sections below Hero
  const otherPublishedPages = pages.filter(
    (p) =>
      !p.is_homepage &&
      p.slug !== 'home' &&
      !p.slug.includes('modal') &&
      p.slug !== 'early-access' &&
      p.content &&
      p.content.trim()
  );

  return (
    <div>
      {/* Homepage Content (rendered dynamically from Pages -> Home or instant fallback) */}
      <CustomPageRenderer content={renderedContent} className="w-full" />

      {/* Published Page Sections */}
      {otherPublishedPages.map((sec) => (
        <CustomPageRenderer
          key={sec.id}
          content={sec.content}
          className="w-full"
        />
      ))}

      {recentPosts.length > 0 && (
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-semibold">
                <Newspaper className="h-6 w-6 text-primary" /> Latest News
              </h2>
              <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
                >
                  {post.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
