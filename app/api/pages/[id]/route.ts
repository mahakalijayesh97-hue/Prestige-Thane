import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { invalidateDataCache } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    let query: any = { supabase_id: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { supabase_id: id }] };
    }

    let doc = await PageModel.findOne(query).lean();

    if (!doc) {
      // Try to find if slug matches id or if it's homepage
      if (id === '00000000-0000-0000-0000-000000000010' || id === 'home') {
        doc = await PageModel.findOne({ $or: [{ is_homepage: true }, { slug: 'home' }] }).lean();
      } else {
        doc = await PageModel.findOne({ slug: id }).lean();
      }
    }

    if (!doc) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const formatted = {
      id: doc.supabase_id || doc._id.toString(),
      _id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      status: doc.status,
      content: doc.content,
      seo_title: doc.seo_title,
      meta_description: doc.meta_description,
      meta_keywords: doc.meta_keywords,
      hero_image: doc.hero_image,
      is_homepage: doc.is_homepage,
      sort_order: doc.sort_order,
      enable_tailwind_cdn: !!(doc as any).enable_tailwind_cdn,
      custom_css: (doc as any).custom_css ?? '',
      custom_js: (doc as any).custom_js ?? '',
      blocks: (doc as any).blocks ?? [],
      override_global_title: !!(doc as any).override_global_title,
      head_scripts: (doc as any).head_scripts ?? '',
      hide_from_nav: !!(doc as any).hide_from_nav,
      hide_from_sitemap: !!(doc as any).hide_from_sitemap,
      no_index: !!(doc as any).no_index,
      no_follow: !!(doc as any).no_follow,
      change_frequency: (doc as any).change_frequency ?? 'weekly',
      sitemap_priority: (doc as any).sitemap_priority ?? 0.8,
      created_at: doc.created_at ? new Date(doc.created_at).toISOString() : new Date().toISOString(),
      updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({ page: formatted }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error fetching page by id:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    await connectToDatabase();

    let query: any = { supabase_id: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { supabase_id: id }] };
    }

    const payload: any = {
      title: body.title,
      slug: body.slug,
      status: body.status || 'published',
      content: body.content ?? '',
      seo_title: body.seo_title ?? null,
      meta_description: body.meta_description ?? null,
      meta_keywords: body.meta_keywords ?? null,
      hero_image: body.hero_image ?? null,
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
      updated_at: new Date(),
    };

    let updated = await PageModel.findOneAndUpdate(
      query,
      { $set: payload },
      { new: true }
    );

    if (!updated) {
      if (id === '00000000-0000-0000-0000-000000000010' || id === 'home') {
        updated = await PageModel.findOneAndUpdate(
          { $or: [{ is_homepage: true }, { slug: 'home' }] },
          { $set: payload },
          { new: true }
        );
      } else {
        updated = await PageModel.findOneAndUpdate(
          { slug: id },
          { $set: payload },
          { new: true }
        );
      }
    }

    if (!updated) {
      // Upsert
      updated = await PageModel.create({
        supabase_id: id,
        ...payload,
      });
    }

    // Safely unset is_homepage on any other page using the resolved ObjectId
    if (body.is_homepage && updated) {
      await PageModel.updateMany({ _id: { $ne: updated._id } }, { $set: { is_homepage: false } });
    }

    try {
      invalidateDataCache();
      revalidatePath('/');
      revalidatePath('/', 'layout');
      if (updated?.slug) {
        revalidatePath(`/${updated.slug}`);
      }
    } catch {}

    return NextResponse.json({ ok: true, page: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error updating page:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update page';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    let query: any = { supabase_id: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { supabase_id: id }] };
    }

    let docToDelete = await PageModel.findOne(query);
    if (!docToDelete) {
      docToDelete = await PageModel.findOne({ slug: id });
    }
    const slugToDelete = docToDelete?.slug;

    if (docToDelete) {
      await PageModel.findByIdAndDelete(docToDelete._id);
    }

    try {
      invalidateDataCache();
      revalidatePath('/');
      revalidatePath('/', 'layout');
      if (slugToDelete) {
        revalidatePath(`/${slugToDelete}`);
      }
    } catch {}

    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

