import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import NavItemModel from '@/lib/models/NavItem';
import { getSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

function getNavQuery(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { supabase_id: id }] };
  }
  return { supabase_id: id };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    await connectToDatabase();
    const query = getNavQuery(id);
    const updated = await NavItemModel.findOneAndUpdate(
      query,
      {
        $set: {
          ...(body.label ? { label: body.label.trim() } : {}),
          ...(body.url ? { url: body.url.trim() } : {}),
          ...(body.target ? { target: body.target } : {}),
          ...(body.parent_id !== undefined ? { parent_id: body.parent_id || null } : {}),
          ...(body.is_active !== undefined ? { is_active: !!body.is_active } : {}),
          ...(typeof body.sort_order === 'number' ? { sort_order: body.sort_order } : {}),
        },
      },
      { returnDocument: 'after' }
    );

    // Sync to Supabase best effort
    try {
      const supabase = getSupabaseServer();
      const supabaseId = updated?.supabase_id || (mongoose.Types.ObjectId.isValid(id) ? null : id);
      if (supabaseId) {
        await supabase.from('nav_items').update(body).eq('id', supabaseId);
      }
    } catch (supaErr) {
      console.warn('Supabase nav sync warning:', supaErr);
    }

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ ok: true, item: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error updating nav item:', error);
    return NextResponse.json({ error: 'Failed to update nav item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    // Find doc first to know its supabase_id
    const docToDelete = await NavItemModel.findOne(getNavQuery(id));
    const supabaseId = docToDelete?.supabase_id || (mongoose.Types.ObjectId.isValid(id) ? null : id);

    // Delete item and any of its children
    const deleteQuery = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { supabase_id: id }, { parent_id: id }] }
      : { $or: [{ supabase_id: id }, { parent_id: id }] };

    await NavItemModel.deleteMany(deleteQuery);

    try {
      const supabase = getSupabaseServer();
      if (supabaseId) {
        await supabase.from('nav_items').delete().eq('id', supabaseId);
      }
    } catch (supaErr) {
      console.warn('Supabase nav delete warning:', supaErr);
    }

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error deleting nav item:', error);
    return NextResponse.json({ error: 'Failed to delete nav item' }, { status: 500 });
  }
}

