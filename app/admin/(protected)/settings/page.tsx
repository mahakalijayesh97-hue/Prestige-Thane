'use client';

import { useEffect, useState, useRef } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
  Loader2,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Link as LinkIcon,
  Sparkles,
  Palette,
  Terminal,
  FileCode,
  Type,
  Globe,
  Boxes,
  Plus,
  MessageSquare,
  MessageCircle,
  Phone,
} from 'lucide-react';

interface Settings {
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
}

const COLOR_PRESETS = [
  { name: 'Prestige Gold', hex: '#d97706' },
  { name: 'Corporate Blue', hex: '#2563eb' },
  { name: 'Emerald Luxury', hex: '#059669' },
  { name: 'Royal Violet', hex: '#7c3aed' },
  { name: 'Crimson Rose', hex: '#dc2626' },
  { name: 'Obsidian Slate', hex: '#0f172a' },
];

const TEXT_COLOR_PRESETS = [
  {
    name: 'Modern Charcoal',
    heading: '#0f172a',
    body: '#334155',
    muted: '#64748b',
  },
  {
    name: 'Obsidian Black',
    heading: '#000000',
    body: '#111827',
    muted: '#4b5563',
  },
  {
    name: 'Midnight Navy',
    heading: '#0f2942',
    body: '#1e3a5f',
    muted: '#5c738e',
  },
  {
    name: 'Luxury Warm',
    heading: '#291811',
    body: '#4a3b32',
    muted: '#786c65',
  },
];

export default function AdminSettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Favicon states
  const [faviconUrl, setFaviconUrl] = useState('');
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadFaviconError, setUploadFaviconError] = useState('');
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Brand Color, Text Color & Script states
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [textColor, setTextColor] = useState('#1e293b');
  const [headingColor, setHeadingColor] = useState('#0f172a');
  const [mutedTextColor, setMutedTextColor] = useState('#64748b');
  const [siteNameColor, setSiteNameColor] = useState('#0f172a');
  const [subSiteName, setSubSiteName] = useState('');
  const [subSiteNameColor, setSubSiteNameColor] = useState('#64748b');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  const [headerScripts, setHeaderScripts] = useState('');
  const [scriptTab, setScriptTab] = useState<'cdn' | 'css' | 'js'>('cdn');

  // Prestige Project Showcase & Launch States
  const [projectTitle, setProjectTitle] = useState('Prestige Thane');
  const [projectCategory, setProjectCategory] = useState('PRE-LAUNCH LUXURY TOWNSHIP');
  const [projectSubtitle, setProjectSubtitle] = useState('Luxury Living in the Heart of Thane');
  const [projectLocation, setProjectLocation] = useState('Balkum, Kapurbawadi, Thane West, Maharashtra');
  const [projectDescription, setProjectDescription] = useState(
    'Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.'
  );
  const [projectStartingPrice, setProjectStartingPrice] = useState('₹1.59 Cr*');
  const [projectConfiguration, setProjectConfiguration] = useState('2, 3 & 4 BHK');
  const [projectPossession, setProjectPossession] = useState('Dec 2028');
  const [projectRera, setProjectRera] = useState('MAHARERA: AWAITING RERA');
  const [projectDeveloper, setProjectDeveloper] = useState('BY PRESTIGE GROUP');
  const [projectTagline, setProjectTagline] = useState('Live the Prestige Life');
  const [projectHeroImage, setProjectHeroImage] = useState('/assets/prestige-hero-bg.webp');

  // Property Advisor Live Chat States
  const [advisorChatEnabled, setAdvisorChatEnabled] = useState(true);
  const [advisorChatTitle, setAdvisorChatTitle] = useState('Prestige Thane Desk');
  const [advisorChatSubtitle, setAdvisorChatSubtitle] = useState('Pre-Launch Advisor Online');
  const [advisorChatTooltip, setAdvisorChatTooltip] = useState('Chat with Property Advisor');
  const [advisorChatWelcomeTitle, setAdvisorChatWelcomeTitle] = useState('Welcome to Prestige Thane!');
  const [advisorChatWelcomeMsg, setAdvisorChatWelcomeMsg] = useState(
    'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.'
  );
  const [advisorChatAction1, setAdvisorChatAction1] = useState('Request Price Updates');
  const [advisorChatAction2, setAdvisorChatAction2] = useState('Request Master & Floor Plan Layouts');
  const [advisorChatWhatsapp, setAdvisorChatWhatsapp] = useState('919022222448');
  const [advisorChatPrefill, setAdvisorChatPrefill] = useState(
    'Hi, I would like to receive pre-launch early access updates'
  );

  const addCdnPreset = (type: 'bootstrap' | 'jquery' | 'tailwind' | 'fontawesome') => {
    let snippet = '';
    if (type === 'bootstrap') {
      snippet = `<!-- Bootstrap 5.3.3 CSS & JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`;
    } else if (type === 'jquery') {
      snippet = `<!-- jQuery 3.7.1 -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>`;
    } else if (type === 'tailwind') {
      snippet = `<!-- Tailwind CSS Play CDN -->
<script src="https://cdn.tailwindcss.com"></script>`;
    } else if (type === 'fontawesome') {
      snippet = `<!-- Font Awesome 6.5.1 Free Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />`;
    }

    if (!headerScripts.includes(snippet.trim())) {
      setHeaderScripts((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
    }
  };

  useEffect(() => {
    loadSettings();
    loadThemeSettings();
  }, []);

  async function loadSettings() {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();
    setS(data as Settings | null);
    setLoading(false);
  }

  async function loadThemeSettings() {
    try {
      const res = await fetch('/api/settings/theme', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPrimaryColor(data.primary_color || '#2563eb');
        setAccentColor(data.accent_color || '#f59e0b');
        setTextColor(data.text_color || '#1e293b');
        setHeadingColor(data.heading_color || '#0f172a');
        setMutedTextColor(data.muted_text_color || '#64748b');
        setSiteNameColor(data.site_name_color || '#0f172a');
        setSubSiteName(data.sub_site_name || '');
        setSubSiteNameColor(data.sub_site_name_color || '#64748b');
        setFaviconUrl(data.favicon_url || '');
        setCustomCss(data.custom_css || '');
        setCustomJs(data.custom_js || '');
        setHeaderScripts(data.header_scripts || '');

        // Project Launch & Showcase info
        if (data.project_title !== undefined) setProjectTitle(data.project_title);
        if (data.project_category !== undefined) setProjectCategory(data.project_category);
        if (data.project_subtitle !== undefined) setProjectSubtitle(data.project_subtitle);
        if (data.project_location !== undefined) setProjectLocation(data.project_location);
        if (data.project_description !== undefined) setProjectDescription(data.project_description);
        if (data.project_starting_price !== undefined) setProjectStartingPrice(data.project_starting_price);
        if (data.project_configuration !== undefined) setProjectConfiguration(data.project_configuration);
        if (data.project_possession !== undefined) setProjectPossession(data.project_possession);
        if (data.project_rera !== undefined) setProjectRera(data.project_rera);
        if (data.project_developer !== undefined) setProjectDeveloper(data.project_developer);
        if (data.project_tagline !== undefined) setProjectTagline(data.project_tagline);
        if (data.project_hero_image !== undefined) setProjectHeroImage(data.project_hero_image);

        // Property Advisor Live Chat
        if (data.advisor_chat_enabled !== undefined) setAdvisorChatEnabled(data.advisor_chat_enabled);
        if (data.advisor_chat_title !== undefined) setAdvisorChatTitle(data.advisor_chat_title);
        if (data.advisor_chat_subtitle !== undefined) setAdvisorChatSubtitle(data.advisor_chat_subtitle);
        if (data.advisor_chat_tooltip !== undefined) setAdvisorChatTooltip(data.advisor_chat_tooltip);
        if (data.advisor_chat_welcome_title !== undefined) setAdvisorChatWelcomeTitle(data.advisor_chat_welcome_title);
        if (data.advisor_chat_welcome_msg !== undefined) setAdvisorChatWelcomeMsg(data.advisor_chat_welcome_msg);
        if (data.advisor_chat_action_1 !== undefined) setAdvisorChatAction1(data.advisor_chat_action_1);
        if (data.advisor_chat_action_2 !== undefined) setAdvisorChatAction2(data.advisor_chat_action_2);
        if (data.advisor_chat_whatsapp !== undefined) setAdvisorChatWhatsapp(data.advisor_chat_whatsapp);
        if (data.advisor_chat_prefill !== undefined) setAdvisorChatPrefill(data.advisor_chat_prefill);
      }
    } catch (err) {
      console.error('Failed to load theme settings:', err);
    }
  }

  async function save() {
    if (!s) return;
    setSaving(true);

    try {
      // 1. Save Supabase site settings
      const supabase = getSupabaseBrowser();
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: s.site_name,
          tagline: s.tagline,
          logo_url: s.logo_url,
          contact_email: s.contact_email,
          contact_phone: s.contact_phone,
          contact_address: s.contact_address,
          social_twitter: s.social_twitter,
          social_facebook: s.social_facebook,
          social_instagram: s.social_instagram,
          social_linkedin: s.social_linkedin,
          newsletter_enabled: s.newsletter_enabled,
          copyright_text: s.copyright_text,
        })
        .eq('id', s.id);

      if (error) {
        console.error('Supabase settings update error:', error);
      }

      // 2. Save Theme Colors, Text Colors, Global JS/CSS & Project Showcase in MongoDB
      const themeRes = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_color: primaryColor,
          accent_color: accentColor,
          text_color: textColor,
          heading_color: headingColor,
          muted_text_color: mutedTextColor,
          site_name_color: siteNameColor,
          sub_site_name: subSiteName,
          sub_site_name_color: subSiteNameColor,
          favicon_url: faviconUrl,
          custom_css: customCss,
          custom_js: customJs,
          header_scripts: headerScripts,
          project_title: projectTitle,
          project_category: projectCategory,
          project_subtitle: projectSubtitle,
          project_location: projectLocation,
          project_description: projectDescription,
          project_starting_price: projectStartingPrice,
          project_configuration: projectConfiguration,
          project_possession: projectPossession,
          project_rera: projectRera,
          project_developer: projectDeveloper,
          project_tagline: projectTagline,
          project_hero_image: projectHeroImage,
          advisor_chat_enabled: advisorChatEnabled,
          advisor_chat_title: advisorChatTitle,
          advisor_chat_subtitle: advisorChatSubtitle,
          advisor_chat_tooltip: advisorChatTooltip,
          advisor_chat_welcome_title: advisorChatWelcomeTitle,
          advisor_chat_welcome_msg: advisorChatWelcomeMsg,
          advisor_chat_action_1: advisorChatAction1,
          advisor_chat_action_2: advisorChatAction2,
          advisor_chat_whatsapp: advisorChatWhatsapp,
          advisor_chat_prefill: advisorChatPrefill,
        }),
      });

      if (!themeRes.ok) {
        throw new Error('Failed to save theme settings to database');
      }

      await logActivity('update', 'site_settings', s.site_name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  }

  function up<K extends keyof Settings>(key: K, value: Settings[K]) {
    setS((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  // Handle Logo File Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        up('logo_url', data.url);
      } else {
        setUploadError(data.error || 'Failed to upload image.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  // Handle Favicon File Upload
  async function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFaviconError('');
    setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setFaviconUrl(data.url);
      } else {
        setUploadFaviconError(data.error || 'Failed to upload favicon.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadFaviconError(msg);
    } finally {
      setUploadingFavicon(false);
      if (faviconInputRef.current) {
        faviconInputRef.current.value = '';
      }
    }
  }

  if (loading || !s) {
    return (
      <div className="grid place-items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <AdminHeader
        title="Settings"
        description="Global site configuration, logo, brand colors, text typography colors, and custom scripts."
        backHref="/admin"
        action={
          <Button onClick={save} disabled={saving} className="gap-1.5">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? 'Saved!' : 'Save changes'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Identity & Logo & Contact */}
        <div className="space-y-6">
          <Card className="space-y-5 p-5 shadow-sm border-border">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" /> Site Identity & Branding
            </h3>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="site_name">Site name</Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Text color:</span>
                  <input
                    type="color"
                    id="site_name_color"
                    value={siteNameColor}
                    onChange={(e) => setSiteNameColor(e.target.value)}
                    className="h-6 w-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    title="Change Site Name text color"
                  />
                  <input
                    type="text"
                    value={siteNameColor}
                    onChange={(e) => setSiteNameColor(e.target.value)}
                    className="h-6 w-20 rounded border border-input bg-background px-1.5 text-[11px] font-mono uppercase"
                    placeholder="#0F172A"
                  />
                </div>
              </div>
              <Input
                id="site_name"
                value={s.site_name}
                onChange={(e) => up('site_name', e.target.value)}
                placeholder="e.g. Prestige Thane"
              />
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-muted-foreground">Quick colors:</span>
                  {['#0f172a', '#d97706', '#2563eb', '#059669', '#7c3aed', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSiteNameColor(c)}
                      className="h-4 w-4 rounded-full border border-border/60 transition hover:scale-110"
                      style={{ backgroundColor: c }}
                      title={`Set color ${c}`}
                    />
                  ))}
                </div>
                <div className="text-[11px] font-semibold" style={{ color: siteNameColor }}>
                  {s.site_name || 'Preview'}
                </div>
              </div>
            </div>

            {/* Sub site name (under Site name) */}
            <div className="space-y-2 rounded-lg border border-border/70 bg-muted/15 p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sub_site_name" className="text-xs font-semibold">
                    Sub site name (under site name)
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Displays directly under the main site name in navbar & footer
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Color:</span>
                  <input
                    type="color"
                    id="sub_site_name_color"
                    value={subSiteNameColor}
                    onChange={(e) => setSubSiteNameColor(e.target.value)}
                    className="h-6 w-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    title="Change Sub site name text color"
                  />
                  <input
                    type="text"
                    value={subSiteNameColor}
                    onChange={(e) => setSubSiteNameColor(e.target.value)}
                    className="h-6 w-20 rounded border border-input bg-background px-1.5 text-[11px] font-mono uppercase"
                    placeholder="#64748B"
                  />
                </div>
              </div>
              <Input
                id="sub_site_name"
                value={subSiteName}
                onChange={(e) => setSubSiteName(e.target.value)}
                placeholder="e.g. Luxury Residences, By Prestige Group, or Thane West"
              />
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-muted-foreground">Quick colors:</span>
                  {['#64748b', '#0f172a', '#d97706', '#2563eb', '#059669', '#94a3b8', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSubSiteNameColor(c)}
                      className="h-4 w-4 rounded-full border border-border/60 transition hover:scale-110"
                      style={{ backgroundColor: c }}
                      title={`Set color ${c}`}
                    />
                  ))}
                </div>
                {subSiteName && (
                  <div className="text-[11px] font-medium" style={{ color: subSiteNameColor }}>
                    {subSiteName}
                  </div>
                )}
              </div>

              {/* Combined Live Header Preview */}
              <div className="mt-2.5 flex items-center gap-2.5 rounded-md border border-border/60 bg-background/90 px-3 py-2 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Live Preview:
                </span>
                <div className="flex items-center gap-2 border-l border-border pl-2.5">
                  {s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo_url} alt="Logo" className="h-6 w-auto object-contain" />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
                      {s.site_name?.charAt(0) ?? 'P'}
                    </span>
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold" style={{ color: siteNameColor }}>
                      {s.site_name || 'Site Name'}
                    </span>
                    {subSiteName && (
                      <span className="text-[10px] font-medium -mt-0.5" style={{ color: subSiteNameColor }}>
                        {subSiteName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={s.tagline}
                onChange={(e) => up('tagline', e.target.value)}
                placeholder="e.g. Luxury Living Redefined"
              />
            </div>

            {/* Logo Upload & Preview Section */}
            <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-primary" /> Site Logo
                </Label>
                {s.logo_url && (
                  <button
                    type="button"
                    onClick={() => up('logo_url', null)}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Remove logo
                  </button>
                )}
              </div>

              {/* Logo Preview */}
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-background p-1 shadow-inner">
                  {s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo_url}
                      alt="Logo Preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
                      {s.site_name?.charAt(0) ?? 'P'}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    className="hidden"
                    id="logo-upload-input"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2 border-dashed border-primary/40 bg-background hover:bg-primary/5 hover:border-primary"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="h-4 w-4 text-primary" />
                    )}
                    {uploadingLogo ? 'Uploading logo...' : 'Upload Logo from Device'}
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Supports PNG, JPG, WebP, or SVG (max 5MB).
                  </p>
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-destructive">{uploadError}</p>
              )}

              {/* Manual URL Input */}
              <div className="space-y-1 pt-1 border-t border-border/60">
                <Label
                  htmlFor="logo_url"
                  className="text-[11px] text-muted-foreground flex items-center gap-1"
                >
                  <LinkIcon className="h-3 w-3" /> Or specify external Logo URL
                </Label>
                <Input
                  id="logo_url"
                  value={s.logo_url ?? ''}
                  onChange={(e) => up('logo_url', e.target.value || null)}
                  placeholder="https://... or /uploads/..."
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Favicon Upload & Browser Tab Preview */}
            <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary" /> Site Favicon (Browser Tab Icon)
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Small icon displayed on browser tabs, bookmarks, and shortcuts
                  </p>
                </div>
                {faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setFaviconUrl('')}
                    className="flex items-center gap-1 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Remove favicon
                  </button>
                )}
              </div>

              {/* Browser Tab Simulation Preview */}
              <div className="rounded-lg border border-border/80 bg-background/90 p-2.5 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Browser Tab Preview</span>
                  <span className="text-[9px] font-normal text-muted-foreground">Live simulation</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-t-md border-t border-x border-border bg-muted/50 px-3 py-1.5 text-xs font-medium shadow-xs max-w-full">
                  <div className="grid h-4 w-4 shrink-0 place-items-center overflow-hidden rounded">
                    {faviconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={faviconUrl}
                        alt="Favicon Preview"
                        className="h-4 w-4 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : s.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.logo_url}
                        alt="Logo Fallback"
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="truncate max-w-[150px] text-[11px] font-medium text-foreground">
                    {s.site_name || 'My Website'}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">×</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-inner">
                  {faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faviconUrl}
                      alt="Favicon"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Globe className="h-6 w-6 text-muted-foreground/60" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={handleFaviconUpload}
                    accept=".ico,.png,.svg,.webp,.jpg,.jpeg,image/x-icon,image/png,image/svg+xml,image/webp"
                    className="hidden"
                    id="favicon-upload-input"
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingFavicon}
                      onClick={() => faviconInputRef.current?.click()}
                      className="flex-1 gap-1.5 border-dashed border-primary/40 bg-background hover:bg-primary/5 hover:border-primary text-xs"
                    >
                      {uploadingFavicon ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      ) : (
                        <Upload className="h-3.5 w-3.5 text-primary" />
                      )}
                      {uploadingFavicon ? 'Uploading...' : 'Upload Favicon (.ico, .png, .svg)'}
                    </Button>

                    {s.logo_url && s.logo_url !== faviconUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFaviconUrl(s.logo_url!)}
                        className="text-xs text-primary hover:bg-primary/10"
                        title="Copy logo URL to favicon"
                      >
                        Use Site Logo
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Recommended: 32×32 or 48×48 square image (.ico, .png, or .svg).
                  </p>
                </div>
              </div>

              {uploadFaviconError && (
                <p className="text-xs text-destructive">{uploadFaviconError}</p>
              )}

              {/* Manual URL Input */}
              <div className="space-y-1 pt-1 border-t border-border/60">
                <Label
                  htmlFor="favicon_url"
                  className="text-[11px] text-muted-foreground flex items-center gap-1"
                >
                  <LinkIcon className="h-3 w-3" /> Or specify external / custom Favicon URL
                </Label>
                <Input
                  id="favicon_url"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://... or /uploads/..."
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="copyright">Copyright text</Label>
              <Input
                id="copyright"
                value={s.copyright_text}
                onChange={(e) => up('copyright_text', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <div>
                <Label htmlFor="news" className="text-sm font-medium cursor-pointer">
                  Newsletter section in footer
                </Label>
                <p className="text-xs text-muted-foreground">
                  Toggle footer newsletter signup prompt
                </p>
              </div>
              <Switch
                id="news"
                checked={s.newsletter_enabled}
                onCheckedChange={(v) => up('newsletter_enabled', v)}
              />
            </div>
          </Card>

          {/* Contact Details Card */}
          <Card className="space-y-4 p-5 shadow-sm border-border">
            <h3 className="text-sm font-semibold">Contact Details</h3>
            <div className="space-y-1.5">
              <Label htmlFor="email">Public Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={s.contact_email ?? ''}
                onChange={(e) => up('contact_email', e.target.value || null)}
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={s.contact_phone ?? ''}
                onChange={(e) => up('contact_phone', e.target.value || null)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Physical Address</Label>
              <Textarea
                id="address"
                value={s.contact_address ?? ''}
                onChange={(e) => up('contact_address', e.target.value || null)}
                rows={2}
                placeholder="123 Market St, Suite 400"
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Brand Colors, Text Typography Colors & Global Scripts */}
        <div className="space-y-6">
          {/* Brand Colors Card */}
          <Card className="space-y-5 p-5 shadow-sm border-border">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-primary" /> Brand Theme Colors
            </h3>
            <p className="text-xs text-muted-foreground">
              Customize the primary and accent colors applied across buttons, badges, links, and navbar highlights.
            </p>

            {/* Quick Color Presets */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Brand Color Presets:
              </Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setPrimaryColor(p.hex)}
                    className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition hover:border-foreground"
                    style={{
                      borderColor: primaryColor === p.hex ? p.hex : undefined,
                      backgroundColor:
                        primaryColor === p.hex ? `${p.hex}15` : undefined,
                    }}
                  >
                    <span
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: p.hex }}
                    />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary & Accent Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="primary_color" className="text-xs font-semibold">
                  Primary Brand Color
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="primary_color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#2563EB"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent_color" className="text-xs font-semibold">
                  Accent Color
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="accent_color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-9 w-12 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <Input
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#F59E0B"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Text & Typography Colors Card */}
          <Card className="space-y-5 p-5 shadow-sm border-border">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Type className="h-4 w-4 text-primary" /> Text & Typography Colors
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure heading text color, body paragraph color, and muted subtitle colors across the website.
            </p>

            {/* Typography Presets */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Text Color Presets:
              </Label>
              <div className="flex flex-wrap gap-2">
                {TEXT_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setHeadingColor(preset.heading);
                      setTextColor(preset.body);
                      setMutedTextColor(preset.muted);
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium transition hover:border-foreground"
                    style={{
                      borderColor:
                        headingColor === preset.heading ? preset.heading : undefined,
                    }}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-border/40 shadow-sm"
                      style={{ backgroundColor: preset.heading }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Text Color Pickers: Headings, Body Text, Muted Text */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Heading / Titles Color */}
              <div className="space-y-1.5">
                <Label htmlFor="heading_color" className="text-xs font-semibold">
                  Headings (H1-H6)
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="heading_color"
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <Input
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#0F172A"
                  />
                </div>
              </div>

              {/* Main Body Text Color */}
              <div className="space-y-1.5">
                <Label htmlFor="text_color" className="text-xs font-semibold">
                  Body Text
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="text_color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#1E293B"
                  />
                </div>
              </div>

              {/* Muted Text Color */}
              <div className="space-y-1.5">
                <Label htmlFor="muted_text_color" className="text-xs font-semibold">
                  Muted / Subtitles
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="muted_text_color"
                    value={mutedTextColor}
                    onChange={(e) => setMutedTextColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  />
                  <Input
                    value={mutedTextColor}
                    onChange={(e) => setMutedTextColor(e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#64748B"
                  />
                </div>
              </div>
            </div>

            {/* Typography Live Preview */}
            <div className="rounded-xl border border-border bg-background p-4 shadow-inner space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Live Text Color Preview:
              </span>
              <div className="space-y-1">
                <h4
                  className="text-base font-bold tracking-tight"
                  style={{ color: headingColor }}
                >
                  Example Heading 1 & Page Titles
                </h4>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: textColor }}
                >
                  This is how your standard body text, article paragraphs, descriptions, and list items will appear to site visitors.
                </p>
                <p
                  className="text-[11px] font-medium"
                  style={{ color: mutedTextColor }}
                >
                  Subtitle or secondary meta details (dates, author bylines, captions)
                </p>
              </div>
            </div>
          </Card>

          {/* Global Scripts (CSS & JavaScript) Card */}
          <Card className="space-y-4 p-5 shadow-sm border-border">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-primary" /> Global Custom CSS & JavaScript
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add global CSS styles, Google Analytics (GA4), Meta Pixel, chat widgets, or tracking scripts applied across the whole website.
              </p>
            </div>

            {/* Tabs for Global CSS and Global JS */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setScriptTab('cdn')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    scriptTab === 'cdn'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  <Boxes className="h-3.5 w-3.5 text-emerald-500" />
                  CDN Libraries (Bootstrap 5, jQuery, Tailwind)
                  {headerScripts && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setScriptTab('css')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    scriptTab === 'css'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-blue-500" />
                  Global CSS
                  {customCss && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setScriptTab('js')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    scriptTab === 'js'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-yellow-500" />
                  Global JavaScript
                  {customJs && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  )}
                </button>
              </div>

              <div className="p-3.5">
                {scriptTab === 'cdn' && (
                  <div className="space-y-3.5">
                    {/* Quick Preset Buttons */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        1-Click Popular CDN Library Presets
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Click any button below to instantly append its official CDN links into your project:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCdnPreset('bootstrap')}
                          className="h-8 text-xs font-semibold gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-900 dark:border-purple-800 dark:text-purple-300"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          + Bootstrap 5.3 (CSS & Bundle JS)
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCdnPreset('jquery')}
                          className="h-8 text-xs font-semibold gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900 dark:border-blue-800 dark:text-blue-300"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          + jQuery 3.7.1
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCdnPreset('tailwind')}
                          className="h-8 text-xs font-semibold gap-1.5 border-sky-200 text-sky-700 hover:bg-sky-50 hover:text-sky-900 dark:border-sky-800 dark:text-sky-300"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          + Tailwind CSS CDN
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addCdnPreset('fontawesome')}
                          className="h-8 text-xs font-semibold gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-900 dark:border-amber-800 dark:text-amber-300"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          + Font Awesome 6 Icons
                        </Button>
                      </div>
                    </div>

                    {/* Detected Libraries Status Bar */}
                    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/60 text-xs">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Active in Project:
                      </span>
                      {headerScripts.includes('bootstrap') ? (
                        <span className="inline-flex items-center gap-1 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 border border-purple-300/50">
                          ✓ Bootstrap 5 Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60">Bootstrap 5 inactive</span>
                      )}
                      {headerScripts.includes('jquery') ? (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-300/50">
                          ✓ jQuery Active ($ available)
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60">jQuery inactive</span>
                      )}
                      {headerScripts.includes('tailwindcss') ? (
                        <span className="inline-flex items-center gap-1 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5 border border-sky-300/50">
                          ✓ Tailwind CSS Active
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60">Tailwind CDN inactive</span>
                      )}
                    </div>

                    {/* Code Textarea */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="header-scripts"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          External CDN Links &amp; Head Tags (&lt;link&gt;, &lt;script&gt;)
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {headerScripts.length} chars
                        </span>
                      </div>
                      <Textarea
                        id="header-scripts"
                        value={headerScripts}
                        onChange={(e) => setHeaderScripts(e.target.value)}
                        rows={8}
                        placeholder="<!-- Paste your CDN tags here -->&#10;<link rel=&quot;stylesheet&quot; href=&quot;https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css&quot;>&#10;<script src=&quot;https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js&quot;></script>&#10;<script src=&quot;https://code.jquery.com/jquery-3.7.1.min.js&quot;></script>&#10;<script src=&quot;https://cdn.tailwindcss.com&quot;></script>"
                        className="font-mono text-xs leading-relaxed text-emerald-900 dark:text-emerald-200"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Injected automatically into the project&apos;s &lt;head&gt; across all pages. Supports standard CDN &lt;link&gt; and &lt;script&gt; tags.
                      </p>
                    </div>
                  </div>
                )}

                {scriptTab === 'css' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="global-css"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Global CSS Stylesheet
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {customCss.length} chars
                      </span>
                    </div>
                    <Textarea
                      id="global-css"
                      value={customCss}
                      onChange={(e) => setCustomCss(e.target.value)}
                      rows={8}
                      placeholder="/* Custom site-wide CSS */&#10;body { font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; }&#10;.custom-hero { letter-spacing: -0.02em; }"
                      className="font-mono text-xs leading-relaxed text-blue-900 dark:text-blue-200"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Injected into every page to override styling across the entire site.
                    </p>
                  </div>
                )}

                {scriptTab === 'js' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="global-js"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Global JavaScript (Analytics, Pixels, Chatbots)
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {customJs.length} chars
                      </span>
                    </div>
                    <Textarea
                      id="global-js"
                      value={customJs}
                      onChange={(e) => setCustomJs(e.target.value)}
                      rows={8}
                      placeholder="// Global scripts (GA4, Pixel, Tag Manager, Chatbot)&#10;console.log('Site initialized');"
                      className="font-mono text-xs leading-relaxed text-amber-900 dark:text-amber-200"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Executes on every page load across your website.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Social Profiles Card */}
          <Card className="space-y-4 p-5 shadow-sm border-border">
            <h3 className="text-sm font-semibold">Social Profiles</h3>
            <div className="space-y-1.5">
              <Label htmlFor="twitter">Twitter / X Profile</Label>
              <Input
                id="twitter"
                value={s.social_twitter ?? ''}
                onChange={(e) => up('social_twitter', e.target.value || null)}
                placeholder="https://x.com/yourhandle"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={s.social_facebook ?? ''}
                onChange={(e) => up('social_facebook', e.target.value || null)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={s.social_instagram ?? ''}
                onChange={(e) => up('social_instagram', e.target.value || null)}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={s.social_linkedin ?? ''}
                onChange={(e) => up('social_linkedin', e.target.value || null)}
                placeholder="https://linkedin.com/company/yourorg"
              />
            </div>
          </Card>
        </div>

        {/* Full Width: Prestige Project Launch & Showcase Details Card */}
        <div className="lg:col-span-2">
          <Card id="project-info" className="space-y-5 p-6 shadow-sm border-border">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C59137]" /> Prestige Project Launch &amp; Showcase
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure the luxury real-estate showcase displayed on the Admin Dashboard and Sign-In page.
                </p>
              </div>
              <Button onClick={save} disabled={saving} size="sm" className="bg-[#B87D28] hover:bg-[#A87022] text-white">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Save className="h-3.5 w-3.5 mr-1" />}
                Save Project Info
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="project_title" className="text-xs font-semibold">Project Title</Label>
                <Input
                  id="project_title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Prestige Thane"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_category" className="text-xs font-semibold">Category Badge</Label>
                <Input
                  id="project_category"
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  placeholder="e.g. PRE-LAUNCH LUXURY TOWNSHIP"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_subtitle" className="text-xs font-semibold">Project Subtitle</Label>
                <Input
                  id="project_subtitle"
                  value={projectSubtitle}
                  onChange={(e) => setProjectSubtitle(e.target.value)}
                  placeholder="e.g. Luxury Living in the Heart of Thane"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_location" className="text-xs font-semibold">Location</Label>
                <Input
                  id="project_location"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  placeholder="e.g. Balkum, Kapurbawadi, Thane West, Maharashtra"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_starting_price" className="text-xs font-semibold">Starting Price</Label>
                <Input
                  id="project_starting_price"
                  value={projectStartingPrice}
                  onChange={(e) => setProjectStartingPrice(e.target.value)}
                  placeholder="e.g. ₹1.59 Cr*"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_configuration" className="text-xs font-semibold">Configuration</Label>
                <Input
                  id="project_configuration"
                  value={projectConfiguration}
                  onChange={(e) => setProjectConfiguration(e.target.value)}
                  placeholder="e.g. 2, 3 & 4 BHK"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_possession" className="text-xs font-semibold">Possession Date</Label>
                <Input
                  id="project_possession"
                  value={projectPossession}
                  onChange={(e) => setProjectPossession(e.target.value)}
                  placeholder="e.g. Dec 2028"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_rera" className="text-xs font-semibold">RERA Registration Status</Label>
                <Input
                  id="project_rera"
                  value={projectRera}
                  onChange={(e) => setProjectRera(e.target.value)}
                  placeholder="e.g. MAHARERA: AWAITING RERA"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_developer" className="text-xs font-semibold">Developer Byline</Label>
                <Input
                  id="project_developer"
                  value={projectDeveloper}
                  onChange={(e) => setProjectDeveloper(e.target.value)}
                  placeholder="e.g. BY PRESTIGE GROUP"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="project_tagline" className="text-xs font-semibold">Signature Script / Tagline</Label>
                <Input
                  id="project_tagline"
                  value={projectTagline}
                  onChange={(e) => setProjectTagline(e.target.value)}
                  placeholder="e.g. Live the Prestige Life"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="project_hero_image" className="text-xs font-semibold">Hero Background Image Path</Label>
                <Input
                  id="project_hero_image"
                  value={projectHeroImage}
                  onChange={(e) => setProjectHeroImage(e.target.value)}
                  placeholder="/assets/prestige-hero-bg.webp"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <Label htmlFor="project_description" className="text-xs font-semibold">Project Overview Description</Label>
                <Textarea
                  id="project_description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  placeholder="Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres..."
                />
              </div>
            </div>
          </Card>

          {/* ────────────────── PROPERTY ADVISOR LIVE CHAT CARD ────────────────── */}
          <Card className="p-6 border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Property Advisor Live Chat Widget
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        advisorChatEnabled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {advisorChatEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the floating pre-launch advisor chat desk, welcome greetings, quick action buttons, and WhatsApp routing.
                  </p>
                </div>
              </div>

              {/* Enable / Disable Toggle */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl shrink-0">
                <Label htmlFor="advisor_chat_enabled" className="text-xs font-semibold cursor-pointer">
                  Show Widget on Website
                </Label>
                <Switch
                  id="advisor_chat_enabled"
                  checked={advisorChatEnabled}
                  onCheckedChange={setAdvisorChatEnabled}
                />
              </div>
            </div>

            {/* Live Visual Widget Preview */}
            <div className="rounded-2xl border border-emerald-100/90 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-slate-50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Live Chatdesk Visual Preview
                </span>
                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Visitors on your website will see this branded advisor card and can start a pre-launch inquiry directly into WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Simulated Bubble */}
                <div className="relative w-12 h-12 rounded-full bg-[#00A86B] text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
                </div>
              </div>
            </div>

            {/* Advisor Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="advisor_chat_title" className="text-xs font-semibold">
                  Desk Header Title
                </Label>
                <Input
                  id="advisor_chat_title"
                  value={advisorChatTitle}
                  onChange={(e) => setAdvisorChatTitle(e.target.value)}
                  placeholder="e.g. Prestige Thane Desk"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="advisor_chat_subtitle" className="text-xs font-semibold">
                  Advisor Status Subtitle
                </Label>
                <Input
                  id="advisor_chat_subtitle"
                  value={advisorChatSubtitle}
                  onChange={(e) => setAdvisorChatSubtitle(e.target.value)}
                  placeholder="e.g. Pre-Launch Advisor Online"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="advisor_chat_whatsapp" className="text-xs font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Advisor WhatsApp Number</span>
                </Label>
                <Input
                  id="advisor_chat_whatsapp"
                  value={advisorChatWhatsapp}
                  onChange={(e) => setAdvisorChatWhatsapp(e.target.value)}
                  placeholder="e.g. 919022222448 or +91 90222 22448"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="advisor_chat_action_1" className="text-xs font-semibold">
                  Quick Action 1 (Golden Button)
                </Label>
                <Input
                  id="advisor_chat_action_1"
                  value={advisorChatAction1}
                  onChange={(e) => setAdvisorChatAction1(e.target.value)}
                  placeholder="e.g. Request Price Updates"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="advisor_chat_action_2" className="text-xs font-semibold">
                  Quick Action 2 (Slate Button)
                </Label>
                <Input
                  id="advisor_chat_action_2"
                  value={advisorChatAction2}
                  onChange={(e) => setAdvisorChatAction2(e.target.value)}
                  placeholder="e.g. Request Master & Floor Plan Layouts"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="advisor_chat_welcome_title" className="text-xs font-semibold">
                  Welcome Card Title
                </Label>
                <Input
                  id="advisor_chat_welcome_title"
                  value={advisorChatWelcomeTitle}
                  onChange={(e) => setAdvisorChatWelcomeTitle(e.target.value)}
                  placeholder="e.g. Welcome to Prestige Thane!"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="advisor_chat_prefill" className="text-xs font-semibold">
                  Default Input Prefill Text
                </Label>
                <Input
                  id="advisor_chat_prefill"
                  value={advisorChatPrefill}
                  onChange={(e) => setAdvisorChatPrefill(e.target.value)}
                  placeholder="e.g. Hi, I would like to receive pre-launch early access updates"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <Label htmlFor="advisor_chat_welcome_msg" className="text-xs font-semibold">
                  Welcome Greeting Message
                </Label>
                <Textarea
                  id="advisor_chat_welcome_msg"
                  value={advisorChatWelcomeMsg}
                  onChange={(e) => setAdvisorChatWelcomeMsg(e.target.value)}
                  rows={2}
                  placeholder="Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates."
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
