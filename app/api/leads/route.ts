import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Lead from '@/lib/models/Lead';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const leads = await Lead.find({}).sort({ created_at: -1 }).lean();
    const formatted = leads.map((l: any) => ({
      id: l._id.toString(),
      name: l.name,
      phone: l.phone,
      email: l.email,
      configuration: l.configuration,
      intent: l.intent,
      source: l.source,
      notes: l.notes || '',
      is_read: Boolean(l.is_read),
      status: l.status || 'new',
      created_at: l.created_at ? new Date(l.created_at).toISOString() : new Date().toISOString(),
    }));
    return NextResponse.json({ leads: formatted });
  } catch (error: unknown) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ leads: [], error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }
    await connectToDatabase();
    const updateData: Record<string, any> = {};
    if (body.is_read !== undefined) updateData.is_read = Boolean(body.is_read);
    if (body.status !== undefined) updateData.status = String(body.status);

    const updated = await Lead.findByIdAndUpdate(body.id, { $set: updateData }, { new: true });
    return NextResponse.json({ ok: true, lead: updated });
  } catch (error: unknown) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }
    await connectToDatabase();
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.phone || !body.email) {
      return NextResponse.json({ error: 'Phone and email are required' }, { status: 400 });
    }

    await connectToDatabase();
    const lead = await Lead.create({
      name: body.name || body.email.split('@')[0] || 'Homebuyer',
      phone: body.phone,
      email: body.email,
      configuration: body.configuration || '2 BHK',
      intent: body.intent || 'Schedule Site Visit',
      source: body.source || 'Hero Section',
      notes: body.notes || '',
      is_read: false,
      status: 'new',
    });

    // Also sync to Supabase contact_submissions if configured
    try {
      const { getSupabaseServer } = await import('@/lib/supabase/server');
      const supabase = getSupabaseServer();
      await supabase.from('contact_submissions').insert({
        name: body.name || body.email.split('@')[0] || 'Homebuyer',
        email: body.email,
        subject: body.intent || 'Schedule Site Visit',
        message: `Phone: ${body.phone}\nConfiguration: ${body.configuration || '2 BHK'}\nIntent: ${body.intent || 'Schedule Site Visit'}\nNotes: ${body.notes || ''}`,
        is_read: false,
      });
    } catch {
      // background sync fallback
    }

    return NextResponse.json({ ok: true, lead });
  } catch (error: unknown) {
    console.error('Lead submission error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to save lead';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

