import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import FormModel, { DEFAULT_EARLY_ACCESS_FORM } from '@/lib/models/Form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

function getFormQuery(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { slug: id }] };
  }
  return { slug: id };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    let form = await FormModel.findOne(getFormQuery(id)).lean();

    // If requested early-access-modal and not yet created, auto-seed
    if (!form && (id === 'early-access-modal' || id === 'default')) {
      form = await FormModel.create(DEFAULT_EARLY_ACCESS_FORM);
    }

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
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

    const query = getFormQuery(id);
    const updated = await FormModel.findOneAndUpdate(
      query,
      {
        $set: {
          ...(body.title ? { title: body.title.trim() } : {}),
          ...(body.slug ? { slug: body.slug.trim().toLowerCase() } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
          ...(body.is_active !== undefined ? { is_active: !!body.is_active } : {}),
          ...(body.button_1_text ? { button_1_text: body.button_1_text } : {}),
          ...(body.button_2_text ? { button_2_text: body.button_2_text } : {}),
          ...(body.whatsapp_number ? { whatsapp_number: body.whatsapp_number } : {}),
          ...(body.partner_name ? { partner_name: body.partner_name } : {}),
          ...(body.disclaimer !== undefined ? { disclaimer: body.disclaimer } : {}),
          ...(Array.isArray(body.fields) ? { fields: body.fields } : {}),
          updated_at: new Date(),
        },
      },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json({ ok: true, form: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    await FormModel.findOneAndDelete(getFormQuery(id));
    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
