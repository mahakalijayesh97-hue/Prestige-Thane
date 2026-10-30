import { getSupabaseServer } from './supabase/server';
import type {
  SiteSettings,
  PageRow,
  NavItem,
  FooterColumn,
  FooterLink,
  Banner,
  BlogPost,
  ContactSubmission,
} from './types';

export async function getSettings(): Promise<SiteSettings | null> {
  const supabase = getSupabaseServer();
  const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  return data as SiteSettings | null;
}

export async function getNavItems(): Promise<NavItem[]> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: NavItemModel } = await import('./models/NavItem');
    await connectToDatabase();
    const count = await NavItemModel.countDocuments();
    if (count > 0) {
      const docs = await NavItemModel.find({ is_active: true }).sort({ sort_order: 1 }).lean();
      return (docs || []).map((d) => ({
        id: d.supabase_id || d._id.toString(),
        label: d.label,
        url: d.url,
        parent_id: d.parent_id || null,
        sort_order: d.sort_order ?? 0,
        target: d.target || '_self',
        is_active: d.is_active !== false,
        created_at: d.created_at ? new Date(d.created_at).toISOString() : new Date().toISOString(),
        updated_at: d.updated_at ? new Date(d.updated_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('MongoDB nav items fallback:', err);
  }

  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('nav_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data as NavItem[]) ?? [];
}

export async function getFooter(): Promise<{ columns: FooterColumn[]; links: FooterLink[] }> {
  const supabase = getSupabaseServer();
  const [cols, links] = await Promise.all([
    supabase.from('footer_columns').select('*').order('sort_order', { ascending: true }),
    supabase.from('footer_links').select('*').order('sort_order', { ascending: true }),
  ]);
  return {
    columns: (cols.data as FooterColumn[]) ?? [],
    links: (links.data as FooterLink[]) ?? [],
  };
}

export interface FooterCustomSettings {
  footer_image: string;
  custom_html: string;
  custom_css: string;
  custom_js: string;
  show_default_links: boolean;
}

export async function getFooterCustomSettings(): Promise<FooterCustomSettings> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: FooterSetting } = await import('./models/FooterSetting');
    await connectToDatabase();
    const doc = await FooterSetting.findOne({}).lean() as {
      footer_image?: string;
      custom_html?: string;
      custom_css?: string;
      custom_js?: string;
      show_default_links?: boolean;
    } | null;
    if (doc) {
      return {
        footer_image: doc.footer_image || '',
        custom_html: doc.custom_html || '',
        custom_css: doc.custom_css || '',
        custom_js: doc.custom_js || '',
        show_default_links: doc.show_default_links !== false,
      };
    }
  } catch {
    // Fallback if MongoDB is temporarily unreachable
  }
  return {
    footer_image: '',
    custom_html: '',
    custom_css: '',
    custom_js: '',
    show_default_links: true,
  };
}

export interface GlobalThemeSettings {
  primary_color: string;
  accent_color: string;
  text_color: string;
  heading_color: string;
  muted_text_color: string;
  site_name_color: string;
  sub_site_name: string;
  sub_site_name_color: string;
  favicon_url: string;
  custom_css: string;
  custom_js: string;
  header_scripts: string;
  navbar_phone?: string;
  navbar_phone_show?: boolean;
  navbar_cta_text?: string;
  navbar_cta_url?: string;
  navbar_cta_show?: boolean;
}

export async function getGlobalThemeSettings(): Promise<GlobalThemeSettings> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: ThemeSetting } = await import('./models/ThemeSetting');
    await connectToDatabase();
    const doc = await ThemeSetting.findOne({}).lean() as {
      primary_color?: string;
      accent_color?: string;
      text_color?: string;
      heading_color?: string;
      muted_text_color?: string;
      site_name_color?: string;
      sub_site_name?: string;
      sub_site_name_color?: string;
      favicon_url?: string;
      custom_css?: string;
      custom_js?: string;
      header_scripts?: string;
      navbar_phone?: string;
      navbar_phone_show?: boolean;
      navbar_cta_text?: string;
      navbar_cta_url?: string;
      navbar_cta_show?: boolean;
    } | null;
    if (doc) {
      return {
        primary_color: doc.primary_color || '#2563eb',
        accent_color: doc.accent_color || '#f59e0b',
        text_color: doc.text_color || '#1e293b',
        heading_color: doc.heading_color || '#0f172a',
        muted_text_color: doc.muted_text_color || '#64748b',
        site_name_color: doc.site_name_color || '#0f172a',
        sub_site_name: doc.sub_site_name || '',
        sub_site_name_color: doc.sub_site_name_color || '#64748b',
        favicon_url: doc.favicon_url || '',
        custom_css: doc.custom_css || '',
        custom_js: doc.custom_js || '',
        header_scripts: doc.header_scripts || '',
        navbar_phone: doc.navbar_phone !== undefined ? doc.navbar_phone : '+91 90222 22448',
        navbar_phone_show: doc.navbar_phone_show !== false,
        navbar_cta_text: doc.navbar_cta_text !== undefined ? doc.navbar_cta_text : 'Book Site Visit',
        navbar_cta_url: doc.navbar_cta_url !== undefined ? doc.navbar_cta_url : '#book-site-visit',
        navbar_cta_show: doc.navbar_cta_show !== false,
      };
    }
  } catch {
    // Fallback if MongoDB is temporarily unreachable
  }
  return {
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
  };
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return (data as Banner[]) ?? [];
}

export async function getPublishedPage(slug: string): Promise<PageRow | null> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: PageModel } = await import('./models/Page');
    await connectToDatabase();
    const doc = await PageModel.findOne({ slug, status: 'published' }).lean();
    if (doc) {
      return {
        id: doc.supabase_id || doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        status: doc.status as any,
        content: doc.content,
        seo_title: doc.seo_title ?? null,
        meta_description: doc.meta_description ?? null,
        meta_keywords: doc.meta_keywords ?? null,
        hero_image: doc.hero_image ?? null,
        is_homepage: doc.is_homepage,
        sort_order: doc.sort_order,
        created_at: doc.created_at ? new Date(doc.created_at).toISOString() : new Date().toISOString(),
        updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('MongoDB page lookup fallback:', err);
  }

  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data as PageRow | null;
}

export async function getPublishedPages(): Promise<PageRow[]> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: PageModel } = await import('./models/Page');
    await connectToDatabase();
    const count = await PageModel.countDocuments();
    if (count > 0) {
      const docs = await PageModel.find({ status: 'published' }).sort({ sort_order: 1 }).lean();
      return (docs || []).map((doc) => ({
        id: doc.supabase_id || doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        status: doc.status as any,
        content: doc.content,
        seo_title: doc.seo_title ?? null,
        meta_description: doc.meta_description ?? null,
        meta_keywords: doc.meta_keywords ?? null,
        hero_image: doc.hero_image ?? null,
        is_homepage: doc.is_homepage,
        sort_order: doc.sort_order,
        created_at: doc.created_at ? new Date(doc.created_at).toISOString() : new Date().toISOString(),
        updated_at: doc.updated_at ? new Date(doc.updated_at).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.warn('MongoDB pages lookup fallback:', err);
  }

  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true });
  return (data as PageRow[]) ?? [];
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  return (data as BlogPost[]) ?? [];
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data as BlogPost | null;
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as ContactSubmission[]) ?? [];
}
