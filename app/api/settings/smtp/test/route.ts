import { NextRequest, NextResponse } from 'next/server';
import { testSmtpConnection } from '@/lib/email';
import { connectToDatabase } from '@/lib/mongodb';
import SmtpSetting from '@/lib/models/SmtpSetting';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let pass = body.pass;

    // If password was sent masked, fetch stored password from DB
    if (!pass || pass === '••••••••') {
      await connectToDatabase();
      const existing = await SmtpSetting.findOne({});
      if (existing?.pass) {
        pass = existing.pass;
      }
    }

    if (!body.host || !body.user || !pass) {
      return NextResponse.json(
        { error: 'Host, username, and password are required to test connection.' },
        { status: 400 }
      );
    }

    const port = Number(body.port) || 587;
    const secure =
      port === 465 ? true : port === 587 || port === 25 ? false : Boolean(body.secure);

    const config = {
      host: body.host,
      port,
      secure,
      user: body.user,
      pass,
      from_name: body.from_name || 'Prestige Thane',
      from_email: body.from_email || body.user,
      admin_email: body.admin_email || body.user,
    };

    const recipient = body.test_recipient || body.admin_email || body.user;
    const result = await testSmtpConnection(config, recipient);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('SMTP test connection failed:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Failed to connect to SMTP server. Please check your credentials, port, and security settings.',
      },
      { status: 400 }
    );
  }
}
