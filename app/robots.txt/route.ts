import { NextRequest } from 'next/server';
import { getGlobalThemeSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const theme = await getGlobalThemeSettings();
    const host = req.headers.get('host') || 'prestige-thane.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    let content = theme.robots_txt_content?.trim();

    if (!content) {
      content = `# Default robots.txt for search engines
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/auth/
Disallow: /api/dashboard/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;
    } else {
      // If sitemap is missing in custom content, append it dynamically
      if (!content.toLowerCase().includes('sitemap:')) {
        content += `\n\nSitemap: ${baseUrl}/sitemap.xml`;
      }
    }

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return new Response(
      'User-agent: *\nAllow: /\nDisallow: /admin/\n',
      {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }
    );
  }
}

