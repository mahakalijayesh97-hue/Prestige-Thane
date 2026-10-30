import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import FooterSetting from '@/lib/models/FooterSetting';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const doc = await FooterSetting.findOne({}).lean();
    return NextResponse.json({
      footer_image: doc?.footer_image || '',
      custom_html: doc?.custom_html || '',
      custom_css: doc?.custom_css || '',
      custom_js: doc?.custom_js || '',
      show_default_links: doc?.show_default_links !== false,
    });
  } catch (error: unknown) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json({
      footer_image: '',
      custom_html: '',
      custom_css: '',
      custom_js: '',
      show_default_links: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const payload = {
      footer_image: typeof body.footer_image === 'string' ? body.footer_image.trim() : '',
      custom_html: typeof body.custom_html === 'string' ? body.custom_html : '',
      custom_css: typeof body.custom_css === 'string' ? body.custom_css : '',
      custom_js: typeof body.custom_js === 'string' ? body.custom_js : '',
      show_default_links: body.show_default_links !== false,
      updated_at: new Date(),
    };

    const updated = await FooterSetting.findOneAndUpdate(
      {},
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      ok: true,
      settings: updated,
    });
  } catch (error: unknown) {
    console.error('Error saving footer settings:', error);
    const msg = error instanceof Error ? error.message : 'Failed to save footer settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

