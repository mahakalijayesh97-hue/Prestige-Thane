import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PageModel from '@/lib/models/Page';
import { getSupabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { invalidateDataCache } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pageId = params.id;
    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Locate source page
    const isHexId = /^[0-9a-fA-F]{24}$/.test(pageId);
    const filter = isHexId
      ? { $or: [{ _id: pageId }, { supabase_id: pageId }, { slug: pageId }] }
      : { $or: [{ supabase_id: pageId }, { slug: pageId }] };

    let sourcePage = await PageModel.findOne(filter).lean() as any;

    // Fallback: search Supabase if not found in MongoDB
    if (!sourcePage) {
      try {
        const supabase = getSupabaseServer();
        const { data } = await supabase.from('pages').select('*').eq('id', pageId).maybeSingle();
        if (data) {
          sourcePage = data;
        }
      } catch (err) {
        console.warn('Supabase fallback lookup error:', err);
      }
    }

    if (!sourcePage) {
      return NextResponse.json({ error: 'Source page not found' }, { status: 404 });
    }

    // 2. Generate collision-free unique slug
    const rawBaseSlug = (sourcePage.slug || 'page')
      .replace(/^(home|\/)$/i, 'home-page')
      .replace(/-copy(?:-\d+)?$/i, ''); // clean existing copy suffixes for clean incrementing

    let candidateSlug = `${rawBaseSlug}-copy`;
    let counter = 1;

    // Loop until we find an unused slug
    while (await PageModel.findOne({ slug: candidateSlug })) {
      counter++;
      candidateSlug = `${rawBaseSlug}-copy-${counter}`;
    }

    // 3. Format title
    const sourceTitle = sourcePage.title || 'Untitled Page';
    const newTitle = sourceTitle.endsWith('(Copy)')
      ? `${sourceTitle} ${counter > 1 ? counter : ''}`.trim()
      : `${sourceTitle} (Copy)`;

    // 4. Create cloned page record in MongoDB
    const clonedDoc = await PageModel.create({
      title: newTitle,
      slug: candidateSlug,
      status: 'draft', // default to draft for safe review before publishing
      content: sourcePage.content || '',
      seo_title: sourcePage.seo_title ? `${sourcePage.seo_title} (Copy)` : null,
      meta_description: sourcePage.meta_description || null,
      meta_keywords: sourcePage.meta_keywords || null,
      hero_image: sourcePage.hero_image || null,
      is_homepage: false, // Never duplicate as primary homepage
      sort_order: (sourcePage.sort_order ?? 0) + 1,
      enable_tailwind_cdn: !!sourcePage.enable_tailwind_cdn,
      custom_css: sourcePage.custom_css ?? '',
      custom_js: sourcePage.custom_js ?? '',
      blocks: Array.isArray(sourcePage.blocks) ? JSON.parse(JSON.stringify(sourcePage.blocks)) : [],
      override_global_title: !!sourcePage.override_global_title,
      head_scripts: sourcePage.head_scripts ?? '',
      hide_from_nav: !!sourcePage.hide_from_nav,
      hide_from_sitemap: !!sourcePage.hide_from_sitemap,
      no_index: !!sourcePage.no_index,
      no_follow: !!sourcePage.no_follow,
      change_frequency: sourcePage.change_frequency || 'weekly',
      sitemap_priority: typeof sourcePage.sitemap_priority === 'number' ? sourcePage.sitemap_priority : 0.8,
    });

    // 5. Invalidate caches so the new page appears immediately
    try {
      invalidateDataCache();
      revalidatePath('/admin/pages');
      revalidatePath('/');
      revalidatePath(`/${candidateSlug}`);
    } catch {}

    return NextResponse.json(
      {
        ok: true,
        message: 'Page duplicated successfully',
        page: {
          id: clonedDoc._id.toString(),
          _id: clonedDoc._id.toString(),
          title: clonedDoc.title,
          slug: clonedDoc.slug,
          status: clonedDoc.status,
          sort_order: clonedDoc.sort_order,
          updated_at: new Date().toISOString(),
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    console.error('Error duplicating page:', error);
    const msg = error instanceof Error ? error.message : 'Failed to duplicate page';
    return NextResponse.json({ error: msg }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
