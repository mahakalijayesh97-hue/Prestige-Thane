import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OpenLinkModel from '@/lib/models/OpenLink';
import NavItemModel from '@/lib/models/NavItem';
import PageModel from '@/lib/models/Page';
import { buildPageContent, parsePageContent } from '@/lib/page-content';
import { invalidateDataCache } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

function determineLinkType(url: string): 'page' | 'scroller' | 'external' {
  const trimmed = (url || '').trim();
  if (trimmed.startsWith('#')) return 'scroller';
  if (trimmed.startsWith('/')) return 'page';
  return 'external';
}

function cleanSlug(slug: string, title: string): string {
  let s = (slug || title || 'link')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return s.replace(/^#|^\//, '');
}

export async function GET() {
  try {
    await connectToDatabase();
    const list = await OpenLinkModel.find({}).sort({ sort_order: 1, created_at: -1 }).lean();
    return NextResponse.json({ links: list }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('Error in GET /api/open-links:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch links' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const title = (body.title || '').trim();
    let url = (body.url || '').trim();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const slug = cleanSlug(body.slug, title);
    const link_type = determineLinkType(url);
    const target = body.target === '_blank' ? '_blank' : '_self';
    const status = body.status === 'draft' ? 'draft' : 'published';
    const is_active = body.is_active !== false && status === 'published';
    const add_to_navbar = !!body.add_to_navbar;

    const html = body.html || '';
    const css = body.css || '';
    const js = body.js || '';
    const content = buildPageContent({ html, css, js });

    // 1. Save or create OpenLink
    const newLink = await OpenLinkModel.create({
      title,
      slug,
      url,
      link_type,
      target,
      html,
      css,
      js,
      content,
      status,
      is_active,
      add_to_navbar,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : 0,
    });

    // 2. If add_to_navbar is true, synchronize with NavItemModel
    if (add_to_navbar) {
      const existingNav = await NavItemModel.findOne({
        $or: [{ url: url }, { label: title }],
      });
      if (existingNav) {
        existingNav.label = title;
        existingNav.url = url;
        existingNav.target = target;
        existingNav.is_active = is_active;
        await existingNav.save();
      } else {
        const lastNav = await NavItemModel.findOne({}).sort({ sort_order: -1 });
        const nextOrder = (lastNav?.sort_order ?? 0) + 1;
        await NavItemModel.create({
          label: title,
          url,
          target,
          sort_order: nextOrder,
          is_active,
        });
      }
    }

    // 3. If it's a page link and has HTML content, synchronize with PageModel
    if (link_type === 'page' && html.trim().length > 0) {
      const pageSlug = slug;
      const existingPage = await PageModel.findOne({ slug: pageSlug });
      if (existingPage) {
        existingPage.title = title;
        existingPage.content = content;
        existingPage.status = status;
        await existingPage.save();
      } else {
        await PageModel.create({
          title,
          slug: pageSlug,
          content,
          status,
          is_homepage: false,
          sort_order: 10,
        });
      }
    }

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, link: newLink }, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error('Error in POST /api/open-links:', err);
    return NextResponse.json({ error: err.message || 'Failed to create link' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
