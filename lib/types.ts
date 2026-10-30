export type PageStatus = 'draft' | 'published';

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  logo_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  newsletter_enabled: boolean;
  copyright_text: string;
  created_at: string;
  updated_at: string;
}

export interface PageRow {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  content: string;
  custom_css?: string | null;
  custom_js?: string | null;
  seo_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  hero_image: string | null;
  is_homepage: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  target: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  column_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  status: PageStatus;
  author_name: string | null;
  seo_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string | null;
  entity_id: string | null;
  details: string | null;
  admin_email: string | null;
  created_at: string;
}
