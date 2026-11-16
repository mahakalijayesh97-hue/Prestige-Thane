import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FooterColumnModel from '@/lib/models/FooterColumn';
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
    if (body.title !== undefined) payload.title = body.title.trim();
    if (body.sort_order !== undefined) payload.sort_order = Number(body.sort_order);

    const updated = await FooterColumnModel.findOneAndUpdate(query, { $set: payload }, { new: true });

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ ok: true, column: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error updating footer column:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update column';
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

    await FooterColumnModel.findOneAndDelete(query);
    // Also delete associated links
    await FooterLinkModel.deleteMany({ $or: [{ column_id: id }, { column_id: id.toString() }] });

    try {
      invalidateDataCache();
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error deleting footer column:', error);
    return NextResponse.json({ error: 'Failed to delete column' }, { status: 500 });
  }
}

