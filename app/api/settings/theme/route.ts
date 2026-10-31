import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ThemeSetting from '@/lib/models/ThemeSetting';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET() {
  try {
    await connectToDatabase();
    const doc = (await ThemeSetting.findOne({}).lean()) as Record<string, any> | null;

    return NextResponse.json(
      {
        primary_color: doc?.primary_color || '#2563eb',
        accent_color: doc?.accent_color || '#f59e0b',
        text_color: doc?.text_color || '#1e293b',
        heading_color: doc?.heading_color || '#0f172a',
        muted_text_color: doc?.muted_text_color || '#64748b',
        site_name_color: doc?.site_name_color || '#0f172a',
        sub_site_name: doc?.sub_site_name || '',
        sub_site_name_color: doc?.sub_site_name_color || '#64748b',
        favicon_url: doc?.favicon_url || '',
        custom_css: doc?.custom_css || '',
        custom_js: doc?.custom_js || '',
        header_scripts: doc?.header_scripts || '',
        navbar_phone: doc?.navbar_phone !== undefined ? doc.navbar_phone : '+91 90222 22448',
        navbar_phone_show: doc?.navbar_phone_show !== false,
        navbar_cta_text: doc?.navbar_cta_text !== undefined ? doc.navbar_cta_text : 'Book Site Visit',
        navbar_cta_url: doc?.navbar_cta_url !== undefined ? doc.navbar_cta_url : '#book-site-visit',
        navbar_cta_show: doc?.navbar_cta_show !== false,

        // Prestige Project Showcase Defaults
        project_title: doc?.project_title || 'Prestige Thane',
        project_category: doc?.project_category || 'PRE-LAUNCH LUXURY TOWNSHIP',
        project_subtitle: doc?.project_subtitle || 'Luxury Living in the Heart of Thane',
        project_location: doc?.project_location || 'Balkum, Kapurbawadi, Thane West, Maharashtra',
        project_description:
          doc?.project_description ||
          'Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.',
        project_starting_price: doc?.project_starting_price || '₹1.59 Cr*',
        project_configuration: doc?.project_configuration || '2, 3 & 4 BHK',
        project_possession: doc?.project_possession || 'Dec 2028',
        project_rera: doc?.project_rera || 'MAHARERA: AWAITING RERA',
        project_developer: doc?.project_developer || 'BY PRESTIGE GROUP',
        project_tagline: doc?.project_tagline || 'Live the Prestige Life',
        project_hero_image: doc?.project_hero_image || '/assets/prestige-hero-bg.webp',

        // Property Advisor Chat Defaults
        advisor_chat_enabled: doc?.advisor_chat_enabled !== false,
        advisor_chat_title: doc?.advisor_chat_title || 'Prestige Thane Desk',
        advisor_chat_subtitle: doc?.advisor_chat_subtitle || 'Pre-Launch Advisor Online',
        advisor_chat_tooltip: doc?.advisor_chat_tooltip || 'Chat with Property Advisor',
        advisor_chat_welcome_title: doc?.advisor_chat_welcome_title || 'Welcome to Prestige Thane!',
        advisor_chat_welcome_msg:
          doc?.advisor_chat_welcome_msg ||
          'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.',
        advisor_chat_action_1: doc?.advisor_chat_action_1 || 'Request Price Updates',
        advisor_chat_action_2: doc?.advisor_chat_action_2 || 'Request Master & Floor Plan Layouts',
        advisor_chat_whatsapp: doc?.advisor_chat_whatsapp || '919022222448',
        advisor_chat_prefill:
          doc?.advisor_chat_prefill || 'Hi, I would like to receive pre-launch early access updates',
        advisor_chat_advisors:
          doc && Array.isArray(doc.advisor_chat_advisors) && doc.advisor_chat_advisors.length > 0
            ? doc.advisor_chat_advisors
            : [
                {
                  id: '1',
                  name: 'Priya Sharma',
                  role: doc?.advisor_chat_subtitle || 'Pre-Launch Specialist',
                  phone: doc?.advisor_chat_whatsapp || '9102222448',
                  avatar:
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                  status: 'Online',
                },
              ],
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json(
      {
        primary_color: '#2563eb',
        accent_color: '#f59e0b',
        text_color: '#1e293b',
        heading_color: '#0f172a',
        muted_text_color: '#64748b',
        site_name_color: '#0f172a',
        sub_site_name: '',
        sub_site_name_color: '#64748b',
        favicon_url: '',
        custom_css: '',
        custom_js: '',
        header_scripts: '',
        navbar_phone: '+91 90222 22448',
        navbar_phone_show: true,
        navbar_cta_text: 'Book Site Visit',
        navbar_cta_url: '#book-site-visit',
        navbar_cta_show: true,
        project_title: 'Prestige Thane',
        project_category: 'PRE-LAUNCH LUXURY TOWNSHIP',
        project_subtitle: 'Luxury Living in the Heart of Thane',
        project_location: 'Balkum, Kapurbawadi, Thane West, Maharashtra',
        project_description:
          'Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.',
        project_starting_price: '₹1.59 Cr*',
        project_configuration: '2, 3 & 4 BHK',
        project_possession: 'Dec 2028',
        project_rera: 'MAHARERA: AWAITING RERA',
        project_developer: 'BY PRESTIGE GROUP',
        project_tagline: 'Live the Prestige Life',
        project_hero_image: '/assets/prestige-hero-bg.webp',
        advisor_chat_enabled: true,
        advisor_chat_title: 'Prestige Thane Desk',
        advisor_chat_subtitle: 'Pre-Launch Advisor Online',
        advisor_chat_tooltip: 'Chat with Property Advisor',
        advisor_chat_welcome_title: 'Welcome to Prestige Thane!',
        advisor_chat_welcome_msg:
          'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.',
        advisor_chat_action_1: 'Request Price Updates',
        advisor_chat_action_2: 'Request Master & Floor Plan Layouts',
        advisor_chat_whatsapp: '919022222448',
        advisor_chat_prefill: 'Hi, I would like to receive pre-launch early access updates',
        advisor_chat_advisors: [
          {
            id: '1',
            name: 'Priya Sharma',
            role: 'Pre-Launch Specialist',
            phone: '9102222448',
            avatar:
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            status: 'Online',
          },
        ],
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const payload: Record<string, any> = {
      updated_at: new Date(),
    };

    if (body.primary_color !== undefined) payload.primary_color = String(body.primary_color).trim();
    if (body.accent_color !== undefined) payload.accent_color = String(body.accent_color).trim();
    if (body.text_color !== undefined) payload.text_color = String(body.text_color).trim();
    if (body.heading_color !== undefined) payload.heading_color = String(body.heading_color).trim();
    if (body.muted_text_color !== undefined) payload.muted_text_color = String(body.muted_text_color).trim();
    if (body.site_name_color !== undefined) payload.site_name_color = String(body.site_name_color).trim();
    if (body.sub_site_name !== undefined) payload.sub_site_name = String(body.sub_site_name).trim();
    if (body.sub_site_name_color !== undefined) payload.sub_site_name_color = String(body.sub_site_name_color).trim();
    if (body.favicon_url !== undefined) payload.favicon_url = String(body.favicon_url).trim();
    if (body.custom_css !== undefined) payload.custom_css = String(body.custom_css);
    if (body.custom_js !== undefined) payload.custom_js = String(body.custom_js);
    if (body.header_scripts !== undefined) payload.header_scripts = String(body.header_scripts);

    // Navbar fields
    if (body.navbar_phone !== undefined) payload.navbar_phone = String(body.navbar_phone).trim();
    if (body.navbar_phone_show !== undefined) payload.navbar_phone_show = Boolean(body.navbar_phone_show);
    if (body.navbar_cta_text !== undefined) payload.navbar_cta_text = String(body.navbar_cta_text).trim();
    if (body.navbar_cta_url !== undefined) payload.navbar_cta_url = String(body.navbar_cta_url).trim();
    if (body.navbar_cta_show !== undefined) payload.navbar_cta_show = Boolean(body.navbar_cta_show);

    // Prestige Project Showcase fields
    if (body.project_title !== undefined) payload.project_title = String(body.project_title).trim();
    if (body.project_category !== undefined) payload.project_category = String(body.project_category).trim();
    if (body.project_subtitle !== undefined) payload.project_subtitle = String(body.project_subtitle).trim();
    if (body.project_location !== undefined) payload.project_location = String(body.project_location).trim();
    if (body.project_description !== undefined) payload.project_description = String(body.project_description).trim();
    if (body.project_starting_price !== undefined) payload.project_starting_price = String(body.project_starting_price).trim();
    if (body.project_configuration !== undefined) payload.project_configuration = String(body.project_configuration).trim();
    if (body.project_possession !== undefined) payload.project_possession = String(body.project_possession).trim();
    if (body.project_rera !== undefined) payload.project_rera = String(body.project_rera).trim();
    if (body.project_developer !== undefined) payload.project_developer = String(body.project_developer).trim();
    if (body.project_tagline !== undefined) payload.project_tagline = String(body.project_tagline).trim();
    if (body.project_hero_image !== undefined) payload.project_hero_image = String(body.project_hero_image).trim();

    // Property Advisor Chat fields
    if (body.advisor_chat_enabled !== undefined) payload.advisor_chat_enabled = Boolean(body.advisor_chat_enabled);
    if (body.advisor_chat_title !== undefined) payload.advisor_chat_title = String(body.advisor_chat_title).trim();
    if (body.advisor_chat_subtitle !== undefined) payload.advisor_chat_subtitle = String(body.advisor_chat_subtitle).trim();
    if (body.advisor_chat_tooltip !== undefined) payload.advisor_chat_tooltip = String(body.advisor_chat_tooltip).trim();
    if (body.advisor_chat_welcome_title !== undefined) payload.advisor_chat_welcome_title = String(body.advisor_chat_welcome_title).trim();
    if (body.advisor_chat_welcome_msg !== undefined) payload.advisor_chat_welcome_msg = String(body.advisor_chat_welcome_msg).trim();
    if (body.advisor_chat_action_1 !== undefined) payload.advisor_chat_action_1 = String(body.advisor_chat_action_1).trim();
    if (body.advisor_chat_action_2 !== undefined) payload.advisor_chat_action_2 = String(body.advisor_chat_action_2).trim();
    if (body.advisor_chat_whatsapp !== undefined) payload.advisor_chat_whatsapp = String(body.advisor_chat_whatsapp).trim();
    if (body.advisor_chat_prefill !== undefined) payload.advisor_chat_prefill = String(body.advisor_chat_prefill).trim();
    if (body.advisor_chat_advisors !== undefined && Array.isArray(body.advisor_chat_advisors)) {
      payload.advisor_chat_advisors = body.advisor_chat_advisors.map((item: any, idx: number) => ({
        id: String(item.id || `adv_${Date.now()}_${idx}`),
        name: String(item.name || 'Property Advisor').trim(),
        role: String(item.role || 'Advisor').trim(),
        phone: String(item.phone || '').trim(),
        avatar: String(item.avatar || '').trim(),
        status: String(item.status || 'Online').trim(),
      }));
    }

    const updated = await ThemeSetting.findOneAndUpdate(
      {},
      { $set: payload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      {
        ok: true,
        theme: updated,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error saving theme settings:', error);
    const msg = error instanceof Error ? error.message : 'Failed to save theme settings';
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
