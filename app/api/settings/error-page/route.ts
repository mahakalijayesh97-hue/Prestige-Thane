import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ErrorPageSetting from '@/lib/models/ErrorPageSetting';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

const DEFAULT_SETTINGS = {
  badge_text: 'Page Not Found • 404',
  error_code: '404',
  heading: 'The Luxury Residence You Are Looking For Seems Relocated',
  subheading:
    'The page or layout you requested does not exist or might have been renamed during recent pre-launch updates. Let us guide you back to the official township showcase.',
  primary_btn_text: 'Return to Homepage',
  primary_btn_url: '/',
  secondary_btn_text: 'Go Back',
  show_secondary_btn: true,
  quick_links: [
    {
      id: 'ql_1',
      label: 'Project Overview',
      desc: 'Master layout & 30+ acre luxury township',
      url: '/#overview',
      icon: 'compass',
      enabled: true,
    },
    {
      id: 'ql_2',
      label: 'Floor Plans',
      desc: '2, 3 & 4 BHK architectural layouts',
      url: '/#floor-plans',
      icon: 'building',
      enabled: true,
    },
    {
      id: 'ql_3',
      label: 'Pricing & Configurations',
      desc: 'Starting from ₹1.59 Cr* with early benefits',
      url: '/#pricing',
      icon: 'tag',
      enabled: true,
    },
    {
      id: 'ql_4',
      label: 'Official Sales Desk',
      desc: 'Speak with our certified project specialist',
      url: '/contact',
      icon: 'phone',
      enabled: true,
    },
  ],
  support_phone: '+91 90222 22448',
  whatsapp_number: '919022222448',
  whatsapp_text: 'Hi Prestige Thane Desk, I need assistance finding project details.',
  show_support_strip: true,
};

export async function GET() {
  try {
    await connectToDatabase();
    let config = await ErrorPageSetting.findOne({}).lean();

    if (!config) {
      config = await ErrorPageSetting.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json(config, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    console.error('Error fetching Error Page settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const updatePayload: Record<string, any> = {
      badge_text: body.badge_text?.trim() || 'Page Not Found • 404',
      error_code: body.error_code?.trim() || '404',
      heading: body.heading?.trim() || 'The Luxury Residence You Are Looking For Seems Relocated',
      subheading: body.subheading?.trim() || '',
      primary_btn_text: body.primary_btn_text?.trim() || 'Return to Homepage',
      primary_btn_url: body.primary_btn_url?.trim() || '/',
      secondary_btn_text: body.secondary_btn_text?.trim() || 'Go Back',
      show_secondary_btn: body.show_secondary_btn !== false,
      quick_links: Array.isArray(body.quick_links) ? body.quick_links : DEFAULT_SETTINGS.quick_links,
      support_phone: body.support_phone?.trim() || '+91 90222 22448',
      whatsapp_number: body.whatsapp_number?.replace(/\D/g, '') || '919022222448',
      whatsapp_text: body.whatsapp_text?.trim() || '',
      show_support_strip: body.show_support_strip !== false,
    };

    const existing = await ErrorPageSetting.findOne({});
    let saved;
    if (existing) {
      saved = await ErrorPageSetting.findByIdAndUpdate(
        existing._id,
        { $set: updatePayload },
        { new: true }
      );
    } else {
      saved = await ErrorPageSetting.create(updatePayload);
    }

    return NextResponse.json(
      { ok: true, message: 'Error page settings saved successfully', config: saved },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error saving Error Page settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save error page settings' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
