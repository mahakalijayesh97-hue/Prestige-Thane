import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

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

    const payload = {
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
      updated_at: new Date(),
    };

    let updated = await PageModel.findOneAndUpdate(
      query,
      { $set: payload },
      { new: true }
    );

    if (!updated && (id === '00000000-0000-0000-0000-000000000010' || id === 'home')) {
      updated = await PageModel.findOneAndUpdate(
        { $or: [{ is_homepage: true }, { slug: 'home' }] },
        { $set: payload },
        { new: true }
      );
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

    const docToDelete = await PageModel.findOne(query);
    const slugToDelete = docToDelete?.slug;

    await PageModel.findOneAndDelete(query);

    try {
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

