import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Media from '@/lib/models/Media';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();
    const doc = await Media.findById(id).lean();
    if (!doc) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json(
      {
        item: {
          id: doc._id.toString(),
          name: doc.name,
          url: doc.url,
          type: doc.type,
          size: doc.size,
          created_at: doc.created_at.toISOString(),
          updated_at: doc.updated_at.toISOString(),
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
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
    const doc = await Media.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    if (body.name !== undefined) {
      doc.name = body.name.trim() || doc.name;
    }
    if (body.url !== undefined && body.url.trim()) {
      doc.url = body.url.trim();
    }
    if (typeof body.size === 'number') {
      doc.size = body.size;
    }
    if (body.type) {
      doc.type = body.type;
    }
    doc.updated_at = new Date();

    await doc.save();

    return NextResponse.json(
      {
        ok: true,
        item: {
          id: doc._id.toString(),
          name: doc.name,
          url: doc.url,
          type: doc.type,
          size: doc.size,
          created_at: doc.created_at.toISOString(),
          updated_at: doc.updated_at.toISOString(),
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();
    const doc = await Media.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    if (doc.url.startsWith('/uploads/')) {
      const filename = path.basename(doc.url);
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {}
      }
    }

    await Media.findByIdAndDelete(id);
    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

