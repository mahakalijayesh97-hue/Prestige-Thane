import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';
import { getSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { invalidateDataCache } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

// Sync existing Supabase pages to MongoDB if MongoDB collection is empty
async function syncFromSupabase() {
  try {
    const count = await PageModel.countDocuments();
    if (count === 0) {
      const supabase = getSupabaseServer();
      const { data } = await supabase.from('pages').select('*');
      if (data && data.length > 0) {
        for (const p of data) {
          await PageModel.create({
            supabase_id: p.id,
            title: p.title,
            slug: p.slug,
            status: p.status,
            content: p.content,
            seo_title: p.seo_title,
            meta_description: p.meta_description,
            meta_keywords: p.meta_keywords,
            hero_image: p.hero_image,
            is_homepage: !!p.is_homepage,
            sort_order: p.sort_order ?? 0,
          });
        }
      }
    }
  } catch (err) {
    console.warn('Sync from Supabase warning:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const includeContent = req.nextUrl.searchParams.get('full') === '1' || req.nextUrl.searchParams.get('full') === 'true';
    const projection = includeContent ? {} : { content: 0 };

    let list: any[] = (await PageModel.find({}, projection).sort({ sort_order: 1, created_at: -1 }).lean()) as any[];
    if (list.length === 0) {
      await syncFromSupabase();
      list = (await PageModel.find({}, projection).sort({ sort_order: 1, created_at: -1 }).lean()) as any[];
    }
    const formatted = list.map((item: any) => ({
      id: item.supabase_id || item._id.toString(),
      _id: item._id.toString(),
      title: item.title,
      slug: item.slug,
      status: item.status,
      ...(includeContent ? { content: item.content } : {}),
      seo_title: item.seo_title,
      meta_description: item.meta_description,
      meta_keywords: item.meta_keywords,
      hero_image: item.hero_image,
      is_homepage: item.is_homepage,
      sort_order: item.sort_order,
      created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
      updated_at: item.updated_at ? new Date(item.updated_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ pages: formatted }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ pages: [], error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const items = body.items || body.pages;
    if (Array.isArray(items)) {
      await connectToDatabase();
      for (const item of items) {
        if (!item.id) continue;
        const isHexId = /^[0-9a-fA-F]{24}$/.test(item.id);
        const filter = isHexId
          ? { $or: [{ _id: item.id }, { supabase_id: item.id }, { slug: item.id }] }
          : { $or: [{ supabase_id: item.id }, { slug: item.id }] };
        await PageModel.updateOne(filter, { $set: { sort_order: Number(item.sort_order) } });
      }

      try {
        invalidateDataCache();
        revalidatePath('/', 'layout');
      } catch {}

      return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
    }
    return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
  } catch (err: unknown) {
    console.error('Error reordering pages:', err);
    return NextResponse.json({ error: 'Failed to reorder pages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    await connectToDatabase();

    // If marked as homepage, unset any existing homepage
    if (body.is_homepage) {
      await PageModel.updateMany({}, { $set: { is_homepage: false } });
    }

    const created = await PageModel.create({
      title: body.title.trim(),
      slug: body.slug.trim(),
      status: body.status || 'published',
      content: body.content || '',
      seo_title: body.seo_title || null,
      meta_description: body.meta_description || null,
      meta_keywords: body.meta_keywords || null,
      hero_image: body.hero_image || null,
      is_homepage: !!body.is_homepage,
      sort_order: Number(body.sort_order) || 0,
      enable_tailwind_cdn: !!body.enable_tailwind_cdn,
      custom_css: body.custom_css ?? '',
      custom_js: body.custom_js ?? '',
      blocks: Array.isArray(body.blocks) ? body.blocks : [],
      override_global_title: !!body.override_global_title,
      head_scripts: body.head_scripts ?? '',
      hide_from_nav: !!body.hide_from_nav,
      hide_from_sitemap: !!body.hide_from_sitemap,
      no_index: !!body.no_index,
      no_follow: !!body.no_follow,
      change_frequency: body.change_frequency || 'weekly',
      sitemap_priority: typeof body.sitemap_priority === 'number' ? body.sitemap_priority : 0.8,
    });

    try {
      invalidateDataCache();
      revalidatePath('/');
      revalidatePath('/', 'layout');
      if (created?.slug) {
        revalidatePath(`/${created.slug}`);
      }
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        page: {
          id: created._id.toString(),
          title: created.title,
          slug: created.slug,
          status: created.status,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error creating page:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

