import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FormModel, { IFormField, DEFAULT_EARLY_ACCESS_FORM } from '@/lib/models/Form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

// Seed default form if database collection is empty
async function ensureDefaultForm() {
  const count = await FormModel.countDocuments();
  if (count === 0) {
    await FormModel.create(DEFAULT_EARLY_ACCESS_FORM);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await ensureDefaultForm();

    const forms = await FormModel.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json({ forms }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms', forms: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await FormModel.findOne({ slug: body.slug.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'A form with this slug already exists' }, { status: 400 });
    }

    const created = await FormModel.create({
      title: body.title.trim(),
      slug: body.slug.trim().toLowerCase(),
      description: body.description || '',
      is_active: body.is_active !== false,
      button_1_text: body.button_1_text || 'Option 1 • Instant Details',
      button_2_text: body.button_2_text || 'Option 2 • Guided Tour',
      whatsapp_number: body.whatsapp_number || '919022222448',
      partner_name: body.partner_name || 'First Team',
      disclaimer: body.disclaimer || '🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only',
      fields: Array.isArray(body.fields) ? body.fields : [],
    });

    return NextResponse.json({ form: created }, { status: 201, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}
