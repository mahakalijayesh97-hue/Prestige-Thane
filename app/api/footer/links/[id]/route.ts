import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FooterLinkModel from '@/lib/models/FooterLink';
import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';
import { invalidateDataCache } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    await connectToDatabase();

    let query: any = { supabase_id: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { supabase_id: id }] };
    }

    const payload: any = {};
    if (body.label !== undefined) payload.label = body.label.trim();
    if (body.url !== undefined) payload.url = body.url.trim();
    if (body.column_id !== undefined) payload.column_id = body.column_id;
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order);

    const updated = await FooterLinkModel.findOneAndUpdate(query, { $set: payload }, { new: true });

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ ok: true, link: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error updating footer link:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update link';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await connectToDatabase();

    let query: any = { supabase_id: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { supabase_id: id }] };
    }

    await FooterLinkModel.findOneAndDelete(query);

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}

