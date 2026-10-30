export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 });
    }

    // Attempt saving to MongoDB leads collection
    try {
      const { connectToDatabase } = await import('@/lib/mongodb');
      const { default: Lead } = await import('@/lib/models/Lead');
      await connectToDatabase();
      await Lead.create({
        name,
        email,
        phone: 'N/A',
        configuration: subject || 'Contact Page',
        intent: 'Contact Message',
        source: 'Contact Form',
        notes: message,
        status: 'new',
      });
    } catch (mongoErr) {
      console.warn('MongoDB contact submission note:', mongoErr);
    }

    // Also attempt saving to Supabase if configured
    try {
      const supabase = getSupabaseServer();
      await supabase.from('contact_submissions').insert({
        name,
        email,
        subject: subject || null,
        message,
      });
    } catch (sbErr) {
      console.warn('Supabase contact submission note:', sbErr);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
