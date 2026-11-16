import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FooterLinkModel from '@/lib/models/FooterLink';
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
    const docs = await FooterLinkModel.find({}).sort({ sort_order: 1 }).lean();
    const links = (docs || []).map((d) => ({
      id: d.supabase_id || d._id.toString(),
      _id: d._id.toString(),
      label: d.label,
      url: d.url,
      column_id: d.column_id,
      sort_order: d.sort_order ?? 0,
      created_at: d.created_at ? new Date(d.created_at).toISOString() : new Date().toISOString(),
      updated_at: d.updated_at ? new Date(d.updated_at).toISOString() : new Date().toISOString(),
    }));
    return NextResponse.json({ links }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json({ links: [] }, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.label || !body.column_id) {
      return NextResponse.json({ error: 'Label and column_id are required' }, { status: 400 });
    }

    await connectToDatabase();
    const created = await FooterLinkModel.create({
      label: body.label.trim(),
      url: body.url?.trim() || '/',
      column_id: body.column_id,
      sort_order: Number(body.sort_order) || 0,
    });

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        link: {
          id: created._id.toString(),
          label: created.label,
          url: created.url,
          column_id: created.column_id,
          sort_order: created.sort_order,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error creating footer link:', error);
    const msg = error instanceof Error ? error.message : 'Failed to create link';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

