import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import OpenLinkModel from '@/lib/models/OpenLink';
import NavItemModel from '@/lib/models/NavItem';
import PageModel from '@/lib/models/Page';
import { buildPageContent } from '@/lib/page-content';
import { invalidateDataCache } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

function getQuery(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { supabase_id: id }] };
  }
  return { supabase_id: id };
}

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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const link = await OpenLinkModel.findOne(getQuery(params.id)).lean();
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }
    return NextResponse.json({ link }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const existing = await OpenLinkModel.findOne(getQuery(params.id));
    if (!existing) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    const title = (body.title || existing.title || '').trim();
    const url = (body.url || existing.url || '').trim();
    const slug = cleanSlug(body.slug || existing.slug, title);
    const link_type = determineLinkType(url);
    const target = body.target === '_blank' ? '_blank' : '_self';
    const status = body.status === 'draft' ? 'draft' : 'published';
    const is_active = body.is_active !== undefined ? body.is_active : status === 'published';
    const add_to_navbar = body.add_to_navbar !== undefined ? !!body.add_to_navbar : existing.add_to_navbar;

    const html = body.html !== undefined ? body.html : existing.html;
    const css = body.css !== undefined ? body.css : existing.css;
    const js = body.js !== undefined ? body.js : existing.js;
    const content = buildPageContent({ html, css, js });

    existing.title = title;
    existing.slug = slug;
    existing.url = url;
    existing.link_type = link_type;
    existing.target = target;
    existing.status = status;
    existing.is_active = is_active;
    existing.add_to_navbar = add_to_navbar;
    existing.html = html;
    existing.css = css;
    existing.js = js;
    existing.content = content;
    if (typeof body.sort_order === 'number') {
      existing.sort_order = body.sort_order;
    }

    await existing.save();

    // Sync navbar if needed
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

    // Sync page if link_type is page
    if (link_type === 'page') {
      const existingPage = await PageModel.findOne({ slug });
      if (existingPage) {
        existingPage.title = title;
        if (content && content.trim().length > 0) {
          existingPage.content = content;
        }
        existingPage.status = status;
        await existingPage.save();
      } else if (html.trim().length > 0) {
        await PageModel.create({
          title,
          slug,
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

    return NextResponse.json({ success: true, link: existing }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const link = await OpenLinkModel.findOne(getQuery(params.id));
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    if (link.link_type === 'page' && link.slug) {
      await PageModel.deleteOne({ slug: link.slug });
    }
    await OpenLinkModel.deleteOne({ _id: link._id });

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
