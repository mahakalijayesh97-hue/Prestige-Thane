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

// In-memory server cache to minimize TTFB & database latency on Atlas queries
// Dev: 10s TTL allows seeing changes quickly; prod: 60s for max performance
const CACHE_TTL_MS = process.env.NODE_ENV === 'development' ? 10 * 1000 : 60 * 1000;
let cacheSettings: { data: SiteSettings; expires: number } | null = null;
let cacheNavItems: { data: NavItem[]; expires: number } | null = null;
let cacheGlobalTheme: { data: GlobalThemeSettings; expires: number } | null = null;
let cachePublishedPages: { data: PageRow[]; expires: number } | null = null;

export function invalidateDataCache() {
  cacheSettings = null;
  cacheNavItems = null;
  cacheGlobalTheme = null;
  cachePublishedPages = null;
}

export async function getSettings(): Promise<SiteSettings | null> {
  const now = Date.now();
  if (cacheSettings && cacheSettings.expires > now) {
    return cacheSettings.data;
  }

  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
    if (data) {
      cacheSettings = { data: data as SiteSettings, expires: now + CACHE_TTL_MS };
      return data as SiteSettings;
    }
  } catch (err) {
    console.warn('getSettings fallback:', err);
  }
  const fallback = {
    id: 'prestige-default',
    site_name: 'Prestige',
    tagline: 'Luxury Living',
    logo_url: '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.webp',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as SiteSettings;
  cacheSettings = { data: fallback, expires: now + CACHE_TTL_MS };
  return fallback;
}

export async function getNavItems(): Promise<NavItem[]> {
  const now = Date.now();
  if (cacheNavItems && cacheNavItems.expires > now) {
    return cacheNavItems.data;
  }

  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: NavItemModel } = await import('./models/NavItem');
    await connectToDatabase();
    const count = await NavItemModel.countDocuments();
    if (count > 0) {
      const docs = await NavItemModel.find({ is_active: true }).sort({ sort_order: 1 }).lean();
      const items = (docs || []).map((d) => ({
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
      cacheNavItems = { data: items, expires: now + CACHE_TTL_MS };
      return items;
    }
  } catch (err) {
    console.warn('MongoDB nav items fallback:', err);
  }

  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('nav_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (data && data.length > 0) {
      cacheNavItems = { data: data as NavItem[], expires: now + CACHE_TTL_MS };
      return data as NavItem[];
    }
  } catch (err) {
    console.warn('Supabase nav items fallback:', err);
  }

  // Instant luxury navigation fallback for Vercel cold starts
  const fallback = [
    { id: 'nav-1', label: 'Overview', url: '#overview', parent_id: null, sort_order: 1, target: '_self', is_active: true, created_at: '', updated_at: '' },
    { id: 'nav-2', label: 'Pricing', url: '#pricing', parent_id: null, sort_order: 2, target: '_self', is_active: true, created_at: '', updated_at: '' },
    { id: 'nav-3', label: 'Amenities', url: '#amenities', parent_id: null, sort_order: 3, target: '_self', is_active: true, created_at: '', updated_at: '' },
    { id: 'nav-4', label: 'Floor Plans', url: '#floor-plans', parent_id: null, sort_order: 4, target: '_self', is_active: true, created_at: '', updated_at: '' },
    { id: 'nav-5', label: 'Gallery', url: '#gallery', parent_id: null, sort_order: 5, target: '_self', is_active: true, created_at: '', updated_at: '' },
    { id: 'nav-6', label: 'Location', url: '#location', parent_id: null, sort_order: 6, target: '_self', is_active: true, created_at: '', updated_at: '' },
    { id: 'nav-7', label: 'FAQ', url: '#faq', parent_id: null, sort_order: 7, target: '_self', is_active: true, created_at: '', updated_at: '' },
  ];
  cacheNavItems = { data: fallback, expires: now + CACHE_TTL_MS };
  return fallback;
}

export async function getFooter(): Promise<{ columns: FooterColumn[]; links: FooterLink[] }> {
  try {
    const supabase = getSupabaseServer();
    const [cols, links] = await Promise.all([
      supabase.from('footer_columns').select('*').order('sort_order', { ascending: true }),
      supabase.from('footer_links').select('*').order('sort_order', { ascending: true }),
    ]);
    return {
      columns: (cols.data as FooterColumn[]) ?? [],
      links: (links.data as FooterLink[]) ?? [],
    };
  } catch (err) {
    console.warn('getFooter fallback:', err);
    return {
      columns: [],
      links: [],
    };
  }
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
  advisor_chat_enabled?: boolean;
  advisor_chat_title?: string;
  advisor_chat_subtitle?: string;
  advisor_chat_welcome_title?: string;
  advisor_chat_welcome_msg?: string;
  advisor_chat_action_1?: string;
  advisor_chat_action_2?: string;
  advisor_chat_whatsapp?: string;
  advisor_chat_prefill?: string;
  advisor_chat_advisors?: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    avatar: string;
    status: string;
  }>;
}

export async function getGlobalThemeSettings(): Promise<GlobalThemeSettings> {
  const now = Date.now();
  if (cacheGlobalTheme && cacheGlobalTheme.expires > now) {
    return cacheGlobalTheme.data;
  }

  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: ThemeSetting } = await import('./models/ThemeSetting');
    await connectToDatabase();
    const doc = await ThemeSetting.findOne({}).lean() as any;
    if (doc) {
      const res: GlobalThemeSettings = {
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
        advisor_chat_enabled: doc.advisor_chat_enabled !== false,
        advisor_chat_title: doc.advisor_chat_title || 'Prestige Thane Desk',
        advisor_chat_subtitle: doc.advisor_chat_subtitle || 'Pre-Launch Advisor Online',
        advisor_chat_welcome_title: doc.advisor_chat_welcome_title || 'Welcome to Prestige Thane!',
        advisor_chat_welcome_msg: doc.advisor_chat_welcome_msg || 'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.',
        advisor_chat_action_1: doc.advisor_chat_action_1 || 'Request Price Updates',
        advisor_chat_action_2: doc.advisor_chat_action_2 || 'Request Master & Floor Plan Layouts',
        advisor_chat_whatsapp: doc.advisor_chat_whatsapp || '919022222448',
        advisor_chat_prefill: doc.advisor_chat_prefill || 'Hi, I would like to receive pre-launch early access updates',
        advisor_chat_advisors:
          Array.isArray(doc.advisor_chat_advisors) && doc.advisor_chat_advisors.length > 0
            ? doc.advisor_chat_advisors
            : undefined,
      };
      cacheGlobalTheme = { data: res, expires: now + CACHE_TTL_MS };
      return res;
    }
  } catch {
    // Fallback if MongoDB is temporarily unreachable
  }
  const fallback: GlobalThemeSettings = {
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
    advisor_chat_enabled: true,
    advisor_chat_title: 'Prestige Thane Desk',
    advisor_chat_subtitle: 'Pre-Launch Advisor Online',
    advisor_chat_welcome_title: 'Welcome to Prestige Thane!',
    advisor_chat_welcome_msg: 'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.',
    advisor_chat_action_1: 'Request Price Updates',
    advisor_chat_action_2: 'Request Master & Floor Plan Layouts',
    advisor_chat_whatsapp: '919022222448',
    advisor_chat_prefill: 'Hi, I would like to receive pre-launch early access updates',
  };
  cacheGlobalTheme = { data: fallback, expires: now + CACHE_TTL_MS };
  return fallback;
}

export async function getBanners(): Promise<Banner[]> {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return (data as Banner[]) ?? [];
  } catch (err) {
    console.warn('getBanners fallback:', err);
    return [];
  }
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

  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    return (data as PageRow | null) ?? null;
  } catch (err) {
    console.warn('Supabase page lookup fallback:', err);
    return null;
  }
}

export async function getPublishedPages(): Promise<PageRow[]> {
  const now = Date.now();
  if (cachePublishedPages && cachePublishedPages.expires > now) {
    return cachePublishedPages.data;
  }

  try {
    const { connectToDatabase } = await import('./mongodb');
    const { default: PageModel } = await import('./models/Page');
    await connectToDatabase();
    const count = await PageModel.countDocuments();
    if (count > 0) {
      const docs = await PageModel.find({ status: 'published' }).sort({ sort_order: 1 }).lean();
      const pages = (docs || []).map((doc) => ({
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
      cachePublishedPages = { data: pages, expires: now + CACHE_TTL_MS };
      return pages;
    }
  } catch (err) {
    console.warn('MongoDB pages lookup fallback:', err);
  }

  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });
    const pages = (data as PageRow[]) ?? [];
    if (pages.length > 0) {
      cachePublishedPages = { data: pages, expires: now + CACHE_TTL_MS };
    }
    return pages;
  } catch (err) {
    console.warn('Supabase pages lookup fallback:', err);
    return [];
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    return (data as BlogPost[]) ?? [];
  } catch (err) {
    console.warn('getPublishedPosts fallback:', err);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    return (data as BlogPost | null) ?? null;
  } catch (err) {
    console.warn('getPublishedPost fallback:', err);
    return null;
  }
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    return (data as ContactSubmission[]) ?? [];
  } catch (err) {
    console.warn('getSubmissions fallback:', err);
    return [];
  }
}
