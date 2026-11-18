import { NextRequest } from 'next/server';
import { getPublishedPages, getPublishedPosts, getGlobalThemeSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function formatDate(d?: string | Date): string {
  if (!d) return new Date().toISOString().split('T')[0];
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get('host') || 'prestige-thane.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const [pages, posts, theme] = await Promise.all([
      getPublishedPages(),
      getPublishedPosts(),
      getGlobalThemeSettings(),
    ]);

    const urlEntries: Array<{
      loc: string;
      lastmod: string;
      changefreq: string;
      priority: string;
    }> = [];

    // 1. Homepage
    const homePage = pages.find((p) => p.is_homepage || p.slug === 'home');
    urlEntries.push({
      loc: `${baseUrl}/`,
      lastmod: formatDate(homePage?.updated_at || homePage?.created_at),
      changefreq: 'daily',
      priority: '1.0',
    });

    // 2. Published Pages (excluding home or hidden ones)
    for (const page of pages) {
      if (page.is_homepage || page.slug === 'home' || page.hide_from_sitemap) {
        continue;
      }
      urlEntries.push({
        loc: `${baseUrl}/${page.slug}`,
        lastmod: formatDate(page.updated_at || page.created_at),
        changefreq: 'weekly',
        priority: '0.8',
      });
    }

    // 3. Contact page
    urlEntries.push({
      loc: `${baseUrl}/contact`,
      lastmod: formatDate(),
      changefreq: 'monthly',
      priority: '0.7',
    });

    // 4. Blog Posts
    if (posts && posts.length > 0) {
      urlEntries.push({
        loc: `${baseUrl}/blog`,
        lastmod: formatDate(posts[0]?.updated_at || posts[0]?.created_at),
        changefreq: 'weekly',
        priority: '0.7',
      });

      for (const post of posts) {
        if (!post.slug) continue;
        urlEntries.push({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: formatDate(post.updated_at || post.created_at),
          changefreq: 'monthly',
          priority: '0.6',
        });
      }
    }

    // 5. Custom URLs added manually
    if (theme.sitemap_custom_urls) {
      const lines = theme.sitemap_custom_urls.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const fullUrl = trimmed.startsWith('http')
          ? trimmed
          : `${baseUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
        
        // Prevent duplicate URLs
        if (!urlEntries.some((e) => e.loc === fullUrl)) {
          urlEntries.push({
            loc: fullUrl,
            lastmod: formatDate(),
            changefreq: 'monthly',
            priority: '0.5',
          });
        }
      }
    }

    // Build XML string
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap.xml:', error);
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://prestige-thane.vercel.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return new Response(fallbackXml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}

