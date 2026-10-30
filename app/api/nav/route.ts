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

async function syncFromSupabase() {
  try {
    const count = await NavItemModel.countDocuments();
    if (count === 0) {
      const supabase = getSupabaseServer();
      const { data } = await supabase
        .from('nav_items')
        .select('*')
        .order('sort_order', { ascending: true });

      if (data && data.length > 0) {
        for (const item of data) {
          await NavItemModel.create({
            supabase_id: item.id,
            label: item.label,
            url: item.url,
            parent_id: item.parent_id,
            sort_order: item.sort_order ?? 0,
            target: item.target || '_self',
            is_active: item.is_active !== false,
          });
        }
      }
    }
  } catch (err) {
    console.warn('Sync nav_items from Supabase warning:', err);
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    let list = await NavItemModel.find({}).sort({ sort_order: 1, created_at: 1 }).lean();
    if (list.length === 0) {
      await syncFromSupabase();
      list = await NavItemModel.find({}).sort({ sort_order: 1, created_at: 1 }).lean();
    }
    const formatted = list.map((item) => ({
      id: item.supabase_id || item._id.toString(),
      _id: item._id.toString(),
      label: item.label,
      url: item.url,
      parent_id: item.parent_id || null,
      sort_order: item.sort_order ?? 0,
      target: item.target || '_self',
      is_active: item.is_active !== false,
      created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
      updated_at: item.updated_at ? new Date(item.updated_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ items: formatted }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching nav items:', error);
    return NextResponse.json({ items: [], error: 'Failed to fetch nav items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.label || !body.url) {
      return NextResponse.json({ error: 'Label and URL are required' }, { status: 400 });
    }

    await connectToDatabase();

    const count = await NavItemModel.countDocuments({ parent_id: body.parent_id || null });
    const created = await NavItemModel.create({
      label: body.label.trim(),
      url: body.url.trim(),
      parent_id: body.parent_id || null,
      sort_order: typeof body.sort_order === 'number' ? body.sort_order : count,
      target: body.target || '_self',
      is_active: body.is_active !== false,
    });

    // Best-effort sync to Supabase
    try {
      const supabase = getSupabaseServer();
      const { data: supaItem } = await supabase.from('nav_items').insert({
        label: created.label,
        url: created.url,
        parent_id: created.parent_id,
        sort_order: created.sort_order,
        target: created.target,
        is_active: created.is_active,
      }).select().single();

      if (supaItem?.id) {
        created.supabase_id = supaItem.id;
        await created.save();
      }
    } catch {}

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        item: {
          id: created.supabase_id || created._id.toString(),
          _id: created._id.toString(),
          label: created.label,
          url: created.url,
          parent_id: created.parent_id,
          sort_order: created.sort_order,
          target: created.target,
          is_active: created.is_active,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Error creating nav item:', error);
    return NextResponse.json({ error: 'Failed to create nav item' }, { status: 500 });
  }
}

// Bulk update for reordering
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    if (Array.isArray(body.items)) {
      // Bulk reorder
      for (const it of body.items) {
        if (!it.id) continue;
        const query = getNavQuery(it.id);
        await NavItemModel.updateOne(
          query,
          {
            $set: {
              sort_order: it.sort_order,
              ...(it.parent_id !== undefined ? { parent_id: it.parent_id } : {}),
            },
          }
        );

        try {
          const supabase = getSupabaseServer();
          if (!mongoose.Types.ObjectId.isValid(it.id)) {
            await supabase.from('nav_items').update({
              sort_order: it.sort_order,
              ...(it.parent_id !== undefined ? { parent_id: it.parent_id } : {}),
            }).eq('id', it.id);
          }
        } catch {}
      }

      try {
        revalidatePath('/', 'layout');
      } catch {}

      return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
    }

    if (body.id) {
      // Single item update
      const query = getNavQuery(body.id);
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

      try {
        const supabase = getSupabaseServer();
        const supabaseId = updated?.supabase_id || (mongoose.Types.ObjectId.isValid(body.id) ? null : body.id);
        if (supabaseId) {
          await supabase.from('nav_items').update(body).eq('id', supabaseId);
        }
      } catch {}

      try {
        revalidatePath('/', 'layout');
      } catch {}

      return NextResponse.json({ ok: true, item: updated }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error) {
    console.error('Error updating nav items:', error);
    return NextResponse.json({ error: 'Failed to update nav items' }, { status: 500 });
  }
}

