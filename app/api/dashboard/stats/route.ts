import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';
import OpenLinkModel from '@/lib/models/OpenLink';
import Lead from '@/lib/models/Lead';
import Form from '@/lib/models/Form';
import Media from '@/lib/models/Media';
import NavItemModel from '@/lib/models/NavItem';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalPages,
      publishedPages,
      draftPages,
      totalOpenLinks,
      totalLeads,
      unreadLeads,
      totalForms,
      totalMedia,
      totalNavItems,
      recentPages,
      recentLeads,
      leadConfigs,
    ] = await Promise.all([
      PageModel.countDocuments(),
      PageModel.countDocuments({ status: 'published' }),
      PageModel.countDocuments({ status: 'draft' }),
      OpenLinkModel.countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ is_read: false }),
      Form.countDocuments(),
      Media.countDocuments(),
      NavItemModel.countDocuments(),
      PageModel.find({})
        .sort({ updated_at: -1 })
        .limit(6)
        .select('title slug status is_homepage updated_at')
        .lean(),
      Lead.find({})
        .sort({ created_at: -1 })
        .limit(6)
        .select('name phone email configuration intent is_read created_at')
        .lean(),
      Lead.aggregate([
        { $group: { _id: '$configuration', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 4 },
      ]),
    ]);

    return NextResponse.json(
      {
        stats: {
          totalPages,
          publishedPages,
          draftPages,
          totalOpenLinks,
          totalLeads,
          unreadLeads,
          totalForms,
          totalMedia,
          totalNavItems,
        },
        recentPages: (recentPages || []).map((p: any) => ({
          id: p._id.toString(),
          title: p.title,
          slug: p.slug,
          status: p.status || 'published',
          is_homepage: !!p.is_homepage,
          updated_at: p.updated_at ? new Date(p.updated_at).toISOString() : new Date().toISOString(),
        })),
        recentLeads: (recentLeads || []).map((l: any) => ({
          id: l._id.toString(),
          name: l.name || 'Homebuyer',
          phone: l.phone || '—',
          email: l.email || '—',
          configuration: l.configuration || 'Enquiry',
          intent: l.intent || 'Site Visit',
          is_read: Boolean(l.is_read),
          created_at: l.created_at ? new Date(l.created_at).toISOString() : new Date().toISOString(),
        })),
        leadConfigs: (leadConfigs || []).map((c: any) => ({
          name: c._id || 'Standard',
          value: c.count,
        })),
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error('Error in GET /api/dashboard/stats:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to load dashboard stats' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
