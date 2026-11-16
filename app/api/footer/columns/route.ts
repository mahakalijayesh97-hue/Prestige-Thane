import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FooterColumnModel from '@/lib/models/FooterColumn';
import { revalidatePath } from 'next/cache';
import { invalidateDataCache } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export async function GET() {
  try {
    await connectToDatabase();
    const docs = await FooterColumnModel.find({}).sort({ sort_order: 1 }).lean();
    const columns = (docs || []).map((d) => ({
      id: d.supabase_id || d._id.toString(),
      _id: d._id.toString(),
      title: d.title,
      sort_order: d.sort_order ?? 0,
      created_at: d.created_at ? new Date(d.created_at).toISOString() : new Date().toISOString(),
      updated_at: d.updated_at ? new Date(d.updated_at).toISOString() : new Date().toISOString(),
    }));
    return NextResponse.json({ columns }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error fetching footer columns:', error);
    return NextResponse.json({ columns: [] }, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await connectToDatabase();
    const created = await FooterColumnModel.create({
      title: body.title.trim(),
      sort_order: Number(body.sort_order) || 0,
    });

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        column: {
          id: created._id.toString(),
          title: created.title,
          sort_order: created.sort_order,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error creating footer column:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create column';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

