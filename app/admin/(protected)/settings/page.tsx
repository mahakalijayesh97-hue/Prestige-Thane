'use client';

import { useEffect, useState, useRef } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Settings as SettingsIcon,
  Send,
  Globe,
  Sparkles,
  Palette,
  Type,
  Code2,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Calendar,
  Crown,
  Trash2,
  Camera,
  Pencil,
  Link2,
  Plus,
  Users,
  UserCheck,
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

export interface AdvisorItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  status: string;
}

const COLOR_PRESETS = [
  { name: 'Prestige Gold', hex: '#d97706' },
  { name: 'Corporate Blue', hex: '#2563eb' },
  { name: 'Emerald Luxury', hex: '#059669' },
  { name: 'Royal Violet', hex: '#7c3aed' },
  { name: 'Crimson Rose', hex: '#dc2626' },
  { name: 'Obsidian Black', hex: '#0f172a' },
];

const TEXT_COLOR_PRESETS = [
  {
    name: 'Modern Charcoal',
    heading: '#1f172a',
    body: '#4b5563',
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

const QUICK_COLORS_SITE = ['#08172A', '#0F2942', '#0284C7', '#D97706', '#2563EB', '#334155'];
const QUICK_COLORS_SUB = ['#000000', '#D97706', '#059669', '#0284C7', '#2563EB', '#64748B'];

const ADVISOR_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
];

export default function AdminSettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedProject, setSavedProject] = useState(false);
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
  const [textColor, setTextColor] = useState('#4b5563');
  const [headingColor, setHeadingColor] = useState('#1f172a');
  const [mutedTextColor, setMutedTextColor] = useState('#64748b');
  const [siteNameColor, setSiteNameColor] = useState('#08172a');
  const [subSiteName, setSubSiteName] = useState('PHASE 1');
  const [subSiteNameColor, setSubSiteNameColor] = useState('#d97706');
  const [customCss, setCustomCss] = useState(`// Add your custom CSS or JS here */\nbody { font-family: 'Inter', sans-serif; }`);
  const [customJs, setCustomJs] = useState('');
  const [headerScripts, setHeaderScripts] = useState('');

  // Prestige Project Showcase & Launch States
  const [projectTitle, setProjectTitle] = useState('Prestige Thane');
  const [projectCategory, setProjectCategory] = useState('PRE-LAUNCH LUXURY TOWNSHIP');
  const [projectSubtitle, setProjectSubtitle] = useState('Luxury Living in the Heart of Thane');
  const [projectLocation, setProjectLocation] = useState('Balkum, Kapurbawdi, Thane West, Maharashtra');
  const [projectDescription, setProjectDescription] = useState(
    'Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.'
  );
  const [projectStartingPrice, setProjectStartingPrice] = useState('₹1.59 Cr*');
  const [projectConfiguration, setProjectConfiguration] = useState('2, 3 & 4 BHK');
  const [projectPossession, setProjectPossession] = useState('Dec 2028');
  const [projectRera, setProjectRera] = useState('MAHARERA - MH/IT/N5/ RERA');
  const [projectDeveloper, setProjectDeveloper] = useState('BY PRESTIGE GROUP');
  const [projectTagline, setProjectTagline] = useState('Live the Prestige Life');
  const [projectHeroImage, setProjectHeroImage] = useState('/assets/prestige-hero-bg.webp');
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadHeroImageError, setUploadHeroImageError] = useState('');
  const [showHeroUrlInput, setShowHeroUrlInput] = useState(false);
  const [heroUrlDraft, setHeroUrlDraft] = useState('');
  const heroImageInputRef = useRef<HTMLInputElement>(null);

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
  const [advisorChatWhatsapp, setAdvisorChatWhatsapp] = useState('9102222448');
  const [advisorChatPrefill, setAdvisorChatPrefill] = useState(
    'Hi, I would like to receive pre-launch early access'
  );

  const [advisors, setAdvisors] = useState<AdvisorItem[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      role: 'Senior Property Specialist',
      phone: '9102222448',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      status: 'Online',
    },
    {
      id: '2',
      name: 'Rahul Verma',
      role: 'Site Visit Coordinator',
      phone: '9102222448',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      status: 'Available',
    },
  ]);
  const [uploadingAdvisorAvatarId, setUploadingAdvisorAvatarId] = useState<string | null>(null);
  const [activeAdvisorUploadId, setActiveAdvisorUploadId] = useState<string | null>(null);
  const [editingUrlAdvisorId, setEditingUrlAdvisorId] = useState<string | null>(null);
  const [advisorUrlDraft, setAdvisorUrlDraft] = useState('');
  const advisorFileInputRef = useRef<HTMLInputElement>(null);

  const addCdnPreset = (type: 'bootstrap' | 'jquery' | 'css' | 'js') => {
    let snippet = '';
    if (type === 'bootstrap') {
      snippet = `<!-- Bootstrap 5 CDN -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`;
    } else if (type === 'jquery') {
      snippet = `<!-- jQuery 3.7.1 -->\n<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>`;
    } else if (type === 'css') {
      snippet = `/* Global Custom Styles */\n:root {\n  --brand-primary: ${primaryColor};\n}`;
    } else if (type === 'js') {
      snippet = `// Global Custom Scripts\nconsole.log('Prestige site loaded');`;
    }

    if (!customCss.includes(snippet.trim())) {
      setCustomCss((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
    }
  };

  useEffect(() => {
    loadSettings();
    loadThemeSettings();
  }, []);

  async function loadSettings() {
    try {
      const supabase = getSupabaseBrowser();
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();
      if (data) {
        setS(data as Settings);
      } else {
        setS({
          id: 'default',
          site_name: 'Prestige Thane',
          tagline: 'Luxury Living in the Heart of Thane',
          logo_url: '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png',
          contact_email: 'contact@company.com',
          contact_phone: '+1 5555 000-000',
          contact_address: '123 Market St, Suite 400',
          social_twitter: 'https://x.com/yourhandle',
          social_facebook: 'https://facebook.com/yourpage',
          social_instagram: 'https://instagram.com/yourhandle',
          social_linkedin: 'https://linkedin.com/company/yourorg',
          newsletter_enabled: true,
          copyright_text: '© 2026 Prestige Group. All rights reserved.',
        });
      }
    } catch {
      setS({
        id: 'default',
        site_name: 'Prestige Thane',
        tagline: 'Luxury Living in the Heart of Thane',
        logo_url: '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png',
        contact_email: 'contact@company.com',
        contact_phone: '+1 5555 000-000',
        contact_address: '123 Market St, Suite 400',
        social_twitter: 'https://x.com/yourhandle',
        social_facebook: 'https://facebook.com/yourpage',
        social_instagram: 'https://instagram.com/yourhandle',
        social_linkedin: 'https://linkedin.com/company/yourorg',
        newsletter_enabled: true,
        copyright_text: '© 2026 Prestige Group. All rights reserved.',
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadThemeSettings() {
    try {
      const res = await fetch('/api/settings/theme', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.primary_color) setPrimaryColor(data.primary_color);
        if (data.accent_color) setAccentColor(data.accent_color);
        if (data.text_color) setTextColor(data.text_color);
        if (data.heading_color) setHeadingColor(data.heading_color);
        if (data.muted_text_color) setMutedTextColor(data.muted_text_color);
        if (data.site_name_color) setSiteNameColor(data.site_name_color);
        if (data.sub_site_name !== undefined) setSubSiteName(data.sub_site_name);
        if (data.sub_site_name_color) setSubSiteNameColor(data.sub_site_name_color);
        if (data.favicon_url) setFaviconUrl(data.favicon_url);
        if (data.custom_css) setCustomCss(data.custom_css);
        if (data.custom_js) setCustomJs(data.custom_js);
        if (data.header_scripts) setHeaderScripts(data.header_scripts);

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
        if (Array.isArray(data.advisor_chat_advisors) && data.advisor_chat_advisors.length > 0) {
          setAdvisors(data.advisor_chat_advisors);
        }
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
      try {
        const supabase = getSupabaseBrowser();
        await supabase
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
      } catch {}

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
          advisor_chat_advisors: advisors,
        }),
      });

      if (!themeRes.ok) {
        throw new Error('Failed to save settings');
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

  async function saveProjectInfo() {
    setSavingProject(true);
    try {
      const res = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });
      if (res.ok) {
        setSavedProject(true);
        setTimeout(() => setSavedProject(false), 2500);
      }
    } catch (err) {
      console.error('Error saving project info:', err);
    } finally {
      setSavingProject(false);
    }
  }

  function up<K extends keyof Settings>(key: K, value: Settings[K]) {
    setS((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

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
      if (faviconInputRef.current) faviconInputRef.current.value = '';
    }
  }

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadHeroImageError('');
    setUploadingHeroImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProjectHeroImage(data.url);
      } else {
        setUploadHeroImageError(data.error || 'Failed to upload showcase image.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadHeroImageError(msg);
    } finally {
      setUploadingHeroImage(false);
      if (heroImageInputRef.current) heroImageInputRef.current.value = '';
    }
  }

  const handleAddAdvisor = () => {
    const newAdv: AdvisorItem = {
      id: `adv_${Date.now()}`,
      name: `Advisor ${advisors.length + 1}`,
      role: 'Property Specialist',
      phone: advisorChatWhatsapp || '9102222448',
      avatar:
        advisors.length % 2 === 0
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      status: 'Online',
    };
    setAdvisors((prev) => [...prev, newAdv]);
  };

  const handleUpdateAdvisor = (id: string, field: keyof AdvisorItem, val: string) => {
    setAdvisors((prev) =>
      prev.map((adv) => (adv.id === id ? { ...adv, [field]: val } : adv))
    );
  };

  const handleDeleteAdvisor = (id: string) => {
    if (advisors.length <= 1) return;
    setAdvisors((prev) => prev.filter((adv) => adv.id !== id));
  };

  const handleAdvisorAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeAdvisorUploadId) return;

    setUploadingAdvisorAvatarId(activeAdvisorUploadId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        handleUpdateAdvisor(activeAdvisorUploadId, 'avatar', data.url);
      }
    } catch (err) {
      console.error('Failed to upload advisor avatar:', err);
    } finally {
      setUploadingAdvisorAvatarId(null);
      setActiveAdvisorUploadId(null);
      if (advisorFileInputRef.current) advisorFileInputRef.current.value = '';
    }
  };

  if (loading || !s) {
    return (
      <div className="grid min-h-[400px] place-items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 pb-12">
      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your site configuration, branding and custom features
            </p>
          </div>
        </div>

        <Button
          onClick={save}
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white font-medium text-xs shadow-md shadow-indigo-900/15 flex items-center gap-2 transition-all active:scale-[0.99] self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
        </Button>
      </div>

      {/* ─── TOP 2-COLUMN GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ══════ LEFT COLUMN ══════ */}
        <div className="space-y-6">
          {/* 1. Site Identity & Branding */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Globe className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Site Identity &amp; Branding</h2>
            </div>

            {/* Site Name & Text Color */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Site Name</Label>
                <input
                  type="text"
                  value={s.site_name}
                  onChange={(e) => up('site_name', e.target.value)}
                  placeholder="Prestige Thane"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Text Color</Label>
                <div className="relative flex items-center h-10 rounded-xl border border-slate-200 bg-white px-2">
                  <input
                    type="color"
                    value={siteNameColor}
                    onChange={(e) => setSiteNameColor(e.target.value)}
                    className="h-6 w-6 rounded-md border-0 cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={siteNameColor.toUpperCase()}
                    onChange={(e) => setSiteNameColor(e.target.value)}
                    className="w-full pl-2 text-xs font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quick Colors for Site Name */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[11px] text-slate-500 font-medium">Quick Colors:</span>
              <div className="flex items-center gap-1.5">
                {QUICK_COLORS_SITE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSiteNameColor(color)}
                    style={{ backgroundColor: color }}
                    className="h-4 w-4 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Sub-site Name & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Sub-site Name (Under Site Name)
                </Label>
                <input
                  type="text"
                  value={subSiteName}
                  onChange={(e) => setSubSiteName(e.target.value)}
                  placeholder="PHASE 1"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Color</Label>
                <div className="relative flex items-center h-10 rounded-xl border border-slate-200 bg-white px-2">
                  <input
                    type="color"
                    value={subSiteNameColor}
                    onChange={(e) => setSubSiteNameColor(e.target.value)}
                    className="h-6 w-6 rounded-md border-0 cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={subSiteNameColor.toUpperCase()}
                    onChange={(e) => setSubSiteNameColor(e.target.value)}
                    className="w-full pl-2 text-xs font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quick Colors for Sub-site */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[11px] text-slate-500 font-medium">Quick Colors:</span>
              <div className="flex items-center gap-1.5">
                {QUICK_COLORS_SUB.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSubSiteNameColor(color)}
                    style={{ backgroundColor: color }}
                    className="h-4 w-4 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Upload Logo & Favicon Boxes */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Logo Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/20 p-4 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="h-8 w-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">Support: PNG, JPG, SVG</span>
                {s.logo_url && (
                  <span className="mt-1 text-[9px] font-semibold text-emerald-600">✓ Logo Active</span>
                )}
              </div>

              {/* Favicon Box */}
              <div
                onClick={() => faviconInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/20 p-4 text-center cursor-pointer transition-colors"
              >
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
                <div className="h-8 w-8 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800">
                  {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">ICO, PNG, Max 64KB</span>
                {faviconUrl && (
                  <span className="mt-1 text-[9px] font-semibold text-emerald-600">✓ Favicon Active</span>
                )}
              </div>
            </div>

            {uploadError && <p className="text-xs text-rose-600">{uploadError}</p>}
            {uploadFaviconError && <p className="text-xs text-rose-600">{uploadFaviconError}</p>}

            {/* Tagline */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Tagline</Label>
              <input
                type="text"
                value={s.tagline}
                onChange={(e) => up('tagline', e.target.value)}
                placeholder="Luxury Living in the Heart of Thane"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Newsletter Section in Footer Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Newsletter Section in Footer</h4>
                  <p className="text-[11px] text-slate-500">Toggle footer newsletter signup prompt.</p>
                </div>
              </div>
              <Switch
                checked={s.newsletter_enabled}
                onCheckedChange={(val) => up('newsletter_enabled', val)}
              />
            </div>
          </div>

          {/* 2. Contact Details */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Phone className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Contact Details</h2>
            </div>

            <div className="space-y-3">
              {/* Public Contact Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Public Contact Email</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-3.5 text-slate-400 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={s.contact_email || ''}
                    onChange={(e) => up('contact_email', e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full h-10 border-0 bg-transparent px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Phone Number</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-3.5 text-slate-400 pointer-events-none">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={s.contact_phone || ''}
                    onChange={(e) => up('contact_phone', e.target.value)}
                    placeholder="+1 5555 000-000"
                    className="w-full h-10 border-0 bg-transparent px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Physical Address</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-3.5 text-slate-400 pointer-events-none">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={s.contact_address || ''}
                    onChange={(e) => up('contact_address', e.target.value)}
                    placeholder="123 Market St, Suite 400"
                    className="w-full h-10 border-0 bg-transparent px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ RIGHT COLUMN ══════ */}
        <div className="space-y-6">
          {/* 3. Brand Theme Colors */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Brand Theme Colors</h2>
                <p className="text-[11px] text-slate-500">
                  Customize the primary and accent colors applied across buttons, badges, links.
                </p>
              </div>
            </div>

            {/* Presets Row */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Brand Color Presets:</span>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(p.hex);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      primaryColor.toLowerCase() === p.hex.toLowerCase()
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.hex }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary & Accent Inputs + Live Preview Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Primary Brand Color</Label>
                  <div className="flex items-center h-10 rounded-xl border border-slate-200 bg-white px-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-6 w-6 rounded-md border-0 cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryColor.toUpperCase()}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full pl-2 text-xs font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Accent Color</Label>
                  <div className="flex items-center h-10 rounded-xl border border-slate-200 bg-white px-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-6 w-6 rounded-md border-0 cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={accentColor.toUpperCase()}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full pl-2 text-xs font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Inset Live Preview Card */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-blue-50/70 to-white p-4 text-center shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Live Preview
                </span>
                <div className="mt-3 flex flex-col items-center justify-center">
                  {s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo_url}
                      alt="Logo Preview"
                      className="h-10 object-contain drop-shadow-xs"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-base">
                      <Sparkles className="h-5 w-5" />
                      <span>{s.site_name || 'Acme CMS'}</span>
                    </div>
                  )}
                  <h4
                    className="text-sm font-bold mt-1 tracking-tight"
                    style={{ color: primaryColor }}
                  >
                    {s.site_name || 'Acme CMS'}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {subSiteName || 'Build. Manage. Grow.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Text & Typography Colors */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Type className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Text &amp; Typography Colors</h2>
                <p className="text-[11px] text-slate-500">
                  Configure heading text color, body paragraph color, and muted subtitles.
                </p>
              </div>
            </div>

            {/* Presets Row */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Text Color Presets:</span>
              <div className="flex flex-wrap gap-2">
                {TEXT_COLOR_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setHeadingColor(p.heading);
                      setTextColor(p.body);
                      setMutedTextColor(p.muted);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      headingColor.toLowerCase() === p.heading.toLowerCase()
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.heading }}
                    />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Color Pickers */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700 truncate block">
                  Heading H1-H6
                </Label>
                <div className="flex items-center h-9 rounded-xl border border-slate-200 bg-white px-2">
                  <input
                    type="color"
                    value={headingColor}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="h-5 w-5 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={headingColor.toUpperCase()}
                    onChange={(e) => setHeadingColor(e.target.value)}
                    className="w-full pl-1.5 text-[10px] font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700 truncate block">
                  Body Text
                </Label>
                <div className="flex items-center h-9 rounded-xl border border-slate-200 bg-white px-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-5 w-5 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={textColor.toUpperCase()}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full pl-1.5 text-[10px] font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700 truncate block">
                  Muted / Subtitles
                </Label>
                <div className="flex items-center h-9 rounded-xl border border-slate-200 bg-white px-2">
                  <input
                    type="color"
                    value={mutedTextColor}
                    onChange={(e) => setMutedTextColor(e.target.value)}
                    className="h-5 w-5 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={mutedTextColor.toUpperCase()}
                    onChange={(e) => setMutedTextColor(e.target.value)}
                    className="w-full pl-1.5 text-[10px] font-mono text-slate-700 uppercase focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Global Custom CSS & JavaScript */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Global Custom CSS &amp; JavaScript
                </h2>
                <p className="text-[11px] text-slate-500">
                  Add your custom CSS styles, Google Analytics (GA4), Meta Pixel, chat widgets, or tracking scripts applied across the website.
                </p>
              </div>
            </div>

            {/* CDN quick pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium">CDN Libraries:</span>
              <button
                type="button"
                onClick={() => addCdnPreset('bootstrap')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50/70 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <span>📦 Bootstrap 5</span>
              </button>
              <button
                type="button"
                onClick={() => addCdnPreset('jquery')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-purple-200 bg-purple-50/70 text-[11px] font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <span>🎵 jQuery</span>
              </button>
              <button
                type="button"
                onClick={() => addCdnPreset('css')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50/70 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <span>🌿 Global CSS</span>
              </button>
              <button
                type="button"
                onClick={() => addCdnPreset('js')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-amber-200 bg-amber-50/70 text-[11px] font-medium text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <span>⚡ Global JavaScript</span>
              </button>
            </div>

            {/* Monospace Code Editor Area */}
            <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-3 font-mono text-xs">
              <textarea
                rows={4}
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="// Add your custom CSS or JS here */"
                className="w-full bg-transparent border-0 text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* 6. Social Profiles */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Social Profiles</h2>
                <p className="text-[11px] text-slate-500">
                  Add your social media links to connect with your audience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Twitter / X */}
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700">Twitter / X Profile</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-2.5 text-slate-700 font-bold text-xs">𝕏</div>
                  <input
                    type="url"
                    value={s.social_twitter || ''}
                    onChange={(e) => up('social_twitter', e.target.value)}
                    placeholder="https://x.com/yourhandle"
                    className="w-full h-9 border-0 bg-transparent px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700">Facebook</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-2.5 text-blue-600">
                    <Facebook className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="url"
                    value={s.social_facebook || ''}
                    onChange={(e) => up('social_facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full h-9 border-0 bg-transparent px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-slate-700">LinkedIn</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-2.5 text-blue-700">
                    <Linkedin className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="url"
                    value={s.social_linkedin || ''}
                    onChange={(e) => up('social_linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourorg"
                    className="w-full h-9 border-0 bg-transparent px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Instagram Row */}
            <div className="space-y-1 sm:w-1/2">
              <Label className="text-[11px] font-semibold text-slate-700">Instagram</Label>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <div className="pl-2.5 text-pink-600">
                  <Instagram className="h-3.5 w-3.5" />
                </div>
                <input
                  type="url"
                  value={s.social_instagram || ''}
                  onChange={(e) => up('social_instagram', e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full h-9 border-0 bg-transparent px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── WIDE SECTION 1: PRESTIGE PROJECT LAUNCH & SHOWCASE ─── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Prestige Project Launch &amp; Showcase
              </h2>
              <p className="text-xs text-slate-500">
                Configure the luxury real-estate showcase displayed on the Admin Dashboard and inquiry page.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={saveProjectInfo}
            disabled={savingProject}
            className="h-9 px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            {savingProject ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : savedProject ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Crown className="h-3.5 w-3.5" />
            )}
            <span>{savedProject ? 'Saved!' : 'Save Project Info'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Inputs Grid (2 columns on left) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Project Title</Label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Prestige Thane"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Category Badge</Label>
                <input
                  type="text"
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  placeholder="PRE-LAUNCH LUXURY TOWNSHIP"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Project Subtitle</Label>
                <input
                  type="text"
                  value={projectSubtitle}
                  onChange={(e) => setProjectSubtitle(e.target.value)}
                  placeholder="Luxury Living in the Heart of Thane"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Location</Label>
                <input
                  type="text"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  placeholder="Balkum, Kapurbawdi, Thane West, Maharashtra"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Starting Price</Label>
                <input
                  type="text"
                  value={projectStartingPrice}
                  onChange={(e) => setProjectStartingPrice(e.target.value)}
                  placeholder="₹1.59 Cr*"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Configuration</Label>
                <input
                  type="text"
                  value={projectConfiguration}
                  onChange={(e) => setProjectConfiguration(e.target.value)}
                  placeholder="2, 3 & 4 BHK"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Possession Date</Label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                  <div className="pl-3 text-slate-400 pointer-events-none">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={projectPossession}
                    onChange={(e) => setProjectPossession(e.target.value)}
                    placeholder="Dec 2028"
                    className="w-full h-10 border-0 bg-transparent px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  RERA Registration Status
                </Label>
                <input
                  type="text"
                  value={projectRera}
                  onChange={(e) => setProjectRera(e.target.value)}
                  placeholder="MAHARERA - MH/IT/N5/ RERA"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Developer RERA</Label>
                <input
                  type="text"
                  value={projectDeveloper}
                  onChange={(e) => setProjectDeveloper(e.target.value)}
                  placeholder="BY PRESTIGE GROUP"
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="flex flex-col gap-2">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group bg-slate-900/5">
              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                className="hidden"
              />

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={projectHeroImage || '/assets/prestige-hero-bg.webp'}
                alt="Project Showcase"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Golden PRESTIGE Badge overlay */}
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-xs border border-amber-500/40 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md z-10 pointer-events-none">
                <Crown className="h-3 w-3 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  PRESTIGE
                </span>
              </div>

              {/* Uploading State Overlay */}
              {uploadingHeroImage && (
                <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
                  <Loader2 className="h-7 w-7 animate-spin text-amber-400 mb-2" />
                  <span className="text-xs font-semibold">Uploading Showcase Image...</span>
                </div>
              )}

              {/* Hover Edit Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 z-10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => heroImageInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHeroUrlDraft(projectHeroImage || '');
                      setShowHeroUrlInput((prev) => !prev);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-medium border border-white/20 transition-transform active:scale-95 cursor-pointer"
                    title="Paste Image URL"
                  >
                    <Link2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>URL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons Below Image */}
            <div className="flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={() => heroImageInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Change Image (Upload)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroUrlDraft(projectHeroImage || '');
                  setShowHeroUrlInput((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer font-medium transition-colors"
              >
                <Pencil className="h-3 w-3" />
                <span>{showHeroUrlInput ? 'Hide URL Input' : 'Paste / Edit URL'}</span>
              </button>
            </div>

            {/* Collapsible Direct URL Input */}
            {showHeroUrlInput && (
              <div className="flex items-center gap-2 mt-0.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="text"
                  value={heroUrlDraft}
                  onChange={(e) => setHeroUrlDraft(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /assets/..."
                  className="flex-1 h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (heroUrlDraft.trim()) {
                      setProjectHeroImage(heroUrlDraft.trim());
                      setShowHeroUrlInput(false);
                    }
                  }}
                  className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>
            )}

            {uploadHeroImageError && (
              <p className="text-[11px] text-red-500 px-1">{uploadHeroImageError}</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── WIDE SECTION 2: PROPERTY ADVISOR LIVE CHAT WIDGET ─── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Property Advisor Live Chat Widget
                </h2>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure the floating premium advisor chat widget, welcome greetings, quick action buttons, and WhatsApp routing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Label className="text-xs font-semibold text-slate-700">Show Widget on Website:</Label>
            <Switch
              checked={advisorChatEnabled}
              onCheckedChange={setAdvisorChatEnabled}
            />
          </div>
        </div>

        {/* Hidden input for advisor avatar upload */}
        <input
          ref={advisorFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAdvisorAvatarUpload}
          className="hidden"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Live Customer Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Live Customer Widget Preview
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {advisors.length} Advisor{advisors.length > 1 ? 's' : ''} Active
              </span>
            </div>

            {/* Interactive Preview Container styled like the live frontend popup */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-md">
              {/* Green Header */}
              <div className="bg-[#008A5E] px-4 py-3 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs truncate">
                      {advisorChatTitle || 'Prestige Thane Desk'}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      <span className="text-[10px] text-emerald-100 font-medium truncate">
                        {advisorChatSubtitle || 'Pre-Launch Advisor Online'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Body Preview */}
              <div className="p-3.5 bg-slate-50/70 space-y-2.5 max-h-[460px] overflow-y-auto">
                {/* Welcome Bubble */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <h5 className="font-bold text-slate-900 text-[11px]">
                    {advisorChatWelcomeTitle || 'Welcome to Prestige Thane!'}
                  </h5>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    {advisorChatWelcomeMsg ||
                      'Prestige Thane is an upcoming pre-launch project. Register your interest for official updates.'}
                  </p>
                </div>

                {/* Multiple Advisors List Preview */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block px-1">
                    Select an Advisor to chat:
                  </span>
                  <div className="space-y-1.5">
                    {advisors.map((adv) => (
                      <div
                        key={adv.id}
                        className="w-full p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-emerald-50/40 transition-colors flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Interactive Avatar in Preview */}
                          <div
                            onClick={() => {
                              setActiveAdvisorUploadId(adv.id);
                              advisorFileInputRef.current?.click();
                            }}
                            className="relative shrink-0 group/av cursor-pointer"
                            title="Click to change/upload photo"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                adv.avatar ||
                                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={adv.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60 group-hover/av:scale-105 group-hover/av:opacity-85 transition-all shadow-xs"
                            />
                            {/* Hover Camera Overlay */}
                            <div className="absolute inset-0 bg-slate-900/60 rounded-full opacity-0 group-hover/av:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                            {uploadingAdvisorAvatarId === adv.id && (
                              <div className="absolute inset-0 bg-slate-900/70 rounded-full flex items-center justify-center text-white z-10">
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                          </div>
                          <div className="min-w-0">
                            <h6 className="text-xs font-bold text-slate-900 truncate">
                              {adv.name}
                            </h6>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 truncate">
                                {adv.role || 'Advisor'}
                              </span>
                              {adv.status && (
                                <span className="text-[8.5px] text-emerald-600 font-semibold bg-emerald-50 px-1 py-0.2 rounded">
                                  {adv.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <a
                          href={`https://wa.me/${adv.phone || advisorChatWhatsapp}?text=${encodeURIComponent(
                            `Hello ${adv.name}, ${advisorChatPrefill}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-semibold shrink-0 shadow-2xs flex items-center gap-1"
                        >
                          <span>Chat</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action Pills Preview */}
                {advisorChatAction1 && (
                  <div className="p-2 rounded-lg border border-amber-300 bg-amber-50/80 text-amber-950 font-bold text-[10.5px] flex items-center justify-between">
                    <span>{advisorChatAction1}</span>
                    <span className="text-amber-700">→</span>
                  </div>
                )}
                {advisorChatAction2 && (
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-100/80 text-slate-900 font-bold text-[10.5px] flex items-center justify-between">
                    <span>{advisorChatAction2}</span>
                    <span className="text-slate-500">→</span>
                  </div>
                )}
              </div>

              {/* Bottom input area mock */}
              <div className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={advisorChatPrefill}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10.5px] text-slate-500"
                />
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 font-bold">
                  ✓
                </div>
              </div>
            </div>
          </div>

          {/* Right Inputs & Multi-Advisor Manager (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. General Chat Desk Configuration */}
            <div className="space-y-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                General Chat Widget Settings
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Desk Header Title</Label>
                  <input
                    type="text"
                    value={advisorChatTitle}
                    onChange={(e) => setAdvisorChatTitle(e.target.value)}
                    placeholder="Prestige Thane Desk"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Advisor Status Subtitle
                  </Label>
                  <input
                    type="text"
                    value={advisorChatSubtitle}
                    onChange={(e) => setAdvisorChatSubtitle(e.target.value)}
                    placeholder="Pre-Launch Advisor Online"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Default WhatsApp Number
                  </Label>
                  <div className="relative flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                    <div className="pl-3 text-emerald-600 pointer-events-none">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={advisorChatWhatsapp}
                      onChange={(e) => setAdvisorChatWhatsapp(e.target.value)}
                      placeholder="9102222448"
                      className="w-full h-10 border-0 bg-transparent px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Quick Action (1) (Mobile Button)
                  </Label>
                  <input
                    type="text"
                    value={advisorChatAction1}
                    onChange={(e) => setAdvisorChatAction1(e.target.value)}
                    placeholder="Request Price Updates"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Quick Action (2) (Mobile Button)
                  </Label>
                  <input
                    type="text"
                    value={advisorChatAction2}
                    onChange={(e) => setAdvisorChatAction2(e.target.value)}
                    placeholder="Request Master & Floor Plan Layouts"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Welcome Card Title</Label>
                  <input
                    type="text"
                    value={advisorChatWelcomeTitle}
                    onChange={(e) => setAdvisorChatWelcomeTitle(e.target.value)}
                    placeholder="Welcome to Prestige Thane!"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">
                    Default Input Prefill Text
                  </Label>
                  <input
                    type="text"
                    value={advisorChatPrefill}
                    onChange={(e) => setAdvisorChatPrefill(e.target.value)}
                    placeholder="Hi, I would like to receive pre-launch early access"
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Multiple Advisors List & Manager */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Property Advisors &amp; Agents ({advisors.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Add multiple team members with individual photos, titles, and WhatsApp numbers.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddAdvisor}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Advisor</span>
                </button>
              </div>

              {/* Advisor Cards */}
              <div className="space-y-3">
                {advisors.map((adv, idx) => (
                  <div
                    key={adv.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {adv.name || `Advisor #${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {adv.status || 'Online'}
                        </span>
                      </div>

                      {advisors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdvisor(adv.id)}
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Advisor"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      {/* Avatar Photo, Upload & URL Controls */}
                      <div className="flex flex-col items-center gap-2 shrink-0 self-center sm:self-start">
                        <div
                          onClick={() => {
                            setActiveAdvisorUploadId(adv.id);
                            advisorFileInputRef.current?.click();
                          }}
                          className="relative group cursor-pointer"
                          title="Click to upload new photo"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              adv.avatar ||
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={adv.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm group-hover:opacity-85 transition-opacity"
                          />
                          <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Camera className="h-4 w-4" />
                          </div>
                          {uploadingAdvisorAvatarId === adv.id && (
                            <div className="absolute inset-0 bg-slate-900/70 rounded-full flex items-center justify-center text-white">
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveAdvisorUploadId(adv.id);
                              advisorFileInputRef.current?.click();
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-lg border border-indigo-200 transition-colors"
                          >
                            <Upload className="h-3 w-3" />
                            <span>Upload</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setAdvisorUrlDraft(adv.avatar || '');
                              setEditingUrlAdvisorId(editingUrlAdvisorId === adv.id ? null : adv.id);
                            }}
                            className="text-[10px] font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg border border-slate-200 transition-colors"
                          >
                            <Link2 className="h-3 w-3" />
                            <span>URL</span>
                          </button>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex items-center gap-1 pt-0.5" title="Quick pick photo">
                          {ADVISOR_AVATAR_PRESETS.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleUpdateAdvisor(adv.id, 'avatar', preset)}
                              className={`w-5 h-5 rounded-full overflow-hidden border transition-transform hover:scale-125 cursor-pointer ${
                                adv.avatar === preset ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-300'
                              }`}
                              title={`Choose photo preset #${pIdx + 1}`}
                            >
                              <img src={preset} alt={`Preset ${pIdx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Advisor Field Inputs */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-slate-700">
                            Advisor Name
                          </Label>
                          <input
                            type="text"
                            value={adv.name}
                            onChange={(e) => handleUpdateAdvisor(adv.id, 'name', e.target.value)}
                            placeholder="Priya Sharma"
                            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-slate-700">
                            Role / Department
                          </Label>
                          <input
                            type="text"
                            value={adv.role}
                            onChange={(e) => handleUpdateAdvisor(adv.id, 'role', e.target.value)}
                            placeholder="Senior Sales Specialist"
                            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-slate-700">
                            WhatsApp Number
                          </Label>
                          <input
                            type="text"
                            value={adv.phone}
                            onChange={(e) => handleUpdateAdvisor(adv.id, 'phone', e.target.value)}
                            placeholder="9102222448"
                            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-slate-700">
                            Status Text
                          </Label>
                          <input
                            type="text"
                            value={adv.status}
                            onChange={(e) => handleUpdateAdvisor(adv.id, 'status', e.target.value)}
                            placeholder="Online"
                            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Photo URL Input */}
                    {editingUrlAdvisorId === adv.id && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={advisorUrlDraft}
                          onChange={(e) => setAdvisorUrlDraft(e.target.value)}
                          placeholder="Paste photo URL (https://...)"
                          className="flex-1 h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (advisorUrlDraft.trim()) {
                              handleUpdateAdvisor(adv.id, 'avatar', advisorUrlDraft.trim());
                              setEditingUrlAdvisorId(null);
                            }
                          }}
                          className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUrlAdvisorId(null)}
                          className="h-8 px-2.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
