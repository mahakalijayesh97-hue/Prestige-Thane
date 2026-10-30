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

const KNOWN_IMAGE_NAMES: Record<string, string> = {
  'prestige-entrance-gate.webp': 'Grand Entrance Gate & Iconic Sunset Towers (Elevation)',
  'prestige-aerial-lifestyle.webp': 'Resort-Style Swimming Pool & Aqua Deck',
  'prestige-luxury-living-view.webp': 'Grand Lifestyle Clubhouse & Luxury Residences View',
  'prestige-hero-bg.webp': 'Aerial Master Township Overview across 30+ Acres',
  'logo_1792837373812_Prestige_Group_Eagle_Emblem.png': 'Prestige Group Official Emblem Logo',
};

// Sync existing local public files into MongoDB if not present
async function syncLocalUploads() {
  try {
    const directories = [
      { dir: path.join(process.cwd(), 'public', 'uploads'), urlPrefix: '/uploads/' },
      { dir: path.join(process.cwd(), 'public', 'assets', 'thumbs'), urlPrefix: '/assets/thumbs/' },
      { dir: path.join(process.cwd(), 'public', 'assets'), urlPrefix: '/assets/' },
    ];

    for (const { dir, urlPrefix } of directories) {
      if (!fs.existsSync(dir)) continue;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile() || entry.name.startsWith('.')) continue;

        const f = entry.name;
        const url = `${urlPrefix}${f}`;
        const exists = await Media.findOne({ url }).lean();

        if (!exists) {
          const stats = fs.statSync(path.join(dir, f));
          const friendlyName =
            KNOWN_IMAGE_NAMES[f] ||
            f
              .replace(/^(logo|img|media)_\d+_/, '')
              .replace(/_/g, ' ')
              .replace(/\.[^/.]+$/, '');

          await Media.create({
            name: friendlyName || f,
            url,
            type: 'image',
            size: stats.size,
            created_at: stats.birthtime || new Date(),
          });
        }
      }
    }
  } catch (err) {
    console.warn('Media upload sync warning:', err);
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    await syncLocalUploads();

    const list = await Media.find({}).sort({ created_at: -1 }).lean();
    const formatted = list.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      url: item.url,
      type: item.type || 'image',
      size: item.size || null,
      created_at: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ items: formatted }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ items: [], error: 'Failed to fetch media' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    await connectToDatabase();
    const created = await Media.create({
      name: body.name?.trim() || body.url.split('/').pop()?.split('?')[0] || 'Image',
      url: body.url.trim(),
      type: body.type || 'image',
      size: typeof body.size === 'number' ? body.size : null,
    });

    return NextResponse.json(
      {
        ok: true,
        item: {
          id: created._id.toString(),
          name: created.name,
          url: created.url,
          type: created.type,
          size: created.size,
          created_at: created.created_at.toISOString(),
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error adding media:', error);
    const msg = error instanceof Error ? error.message : 'Failed to add media';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

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
  } catch (error: unknown) {
    console.error('Error updating media:', error);
    const msg = error instanceof Error ? error.message : 'Failed to update media';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const doc = await Media.findById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // If local file in public/uploads, delete from disk
    if (doc.url.startsWith('/uploads/')) {
      const filename = path.basename(doc.url);
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('Could not delete file from disk:', unlinkErr);
        }
      }
    }

    await Media.findByIdAndDelete(id);
    return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (error: unknown) {
    console.error('Error deleting media:', error);
    const msg = error instanceof Error ? error.message : 'Failed to delete media';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

