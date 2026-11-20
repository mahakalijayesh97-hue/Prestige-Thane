import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SmtpSetting from '@/lib/models/SmtpSetting';

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
    const config = await SmtpSetting.findOne({}).lean() as Record<string, any> | null;

    if (!config) {
      return NextResponse.json(
        {
          enabled: false,
          host: '',
          port: 587,
          secure: false,
          user: '',
          pass: '',
          hasPassword: false,
          from_name: 'Prestige Thane',
          from_email: '',
          admin_email: '',
          notify_on_lead: true,
          notify_on_contact: true,
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        enabled: Boolean(config.enabled),
        host: config.host || '',
        port: config.port || 587,
        secure: Boolean(config.secure),
        user: config.user || '',
        pass: config.pass ? '••••••••' : '',
        hasPassword: Boolean(config.pass),
        from_name: config.from_name || 'Prestige Thane',
        from_email: config.from_email || '',
        admin_email: config.admin_email || '',
        notify_on_lead: config.notify_on_lead !== false,
        notify_on_contact: config.notify_on_contact !== false,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error fetching SMTP settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SMTP settings' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const existing = await SmtpSetting.findOne({});
    const port = Number(body.port) || 587;
    const secure =
      port === 465 ? true : port === 587 || port === 25 ? false : Boolean(body.secure);

    const updatePayload: Record<string, any> = {
      enabled: Boolean(body.enabled),
      host: typeof body.host === 'string' ? body.host.trim() : '',
      port,
      secure,
      user: typeof body.user === 'string' ? body.user.trim() : '',
      from_name: typeof body.from_name === 'string' ? body.from_name.trim() : 'Prestige Thane',
      from_email: typeof body.from_email === 'string' ? body.from_email.trim() : '',
      admin_email: typeof body.admin_email === 'string' ? body.admin_email.trim() : '',
      notify_on_lead: body.notify_on_lead !== false,
      notify_on_contact: body.notify_on_contact !== false,
    };

    // Only update password if a new unmasked password is provided
    if (body.pass && body.pass !== '••••••••') {
      updatePayload.pass = body.pass;
    } else if (!existing && body.pass) {
      updatePayload.pass = body.pass;
    }

    let saved;
    if (existing) {
      saved = await SmtpSetting.findByIdAndUpdate(
        existing._id,
        { $set: updatePayload },
        { new: true }
      );
    } else {
      saved = await SmtpSetting.create(updatePayload);
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'SMTP settings saved successfully',
        settings: {
          enabled: saved.enabled,
          host: saved.host,
          port: saved.port,
          secure: saved.secure,
          user: saved.user,
          pass: saved.pass ? '••••••••' : '',
          hasPassword: Boolean(saved.pass),
          from_name: saved.from_name,
          from_email: saved.from_email,
          admin_email: saved.admin_email,
          notify_on_lead: saved.notify_on_lead,
          notify_on_contact: saved.notify_on_contact,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error('Error saving SMTP settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save SMTP settings' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
