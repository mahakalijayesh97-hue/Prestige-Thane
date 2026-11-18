'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { logActivity } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  FileCode,
  Palette,
  Terminal,
  Eye,
  CheckCircle2,
  Sparkles,
  Loader2,
  Layers,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Link2,
  FolderPlus,
  Copy,
  Check,
  RotateCcw,
  Smartphone,
  Monitor,
  Columns,
  Search,
  X,
  Upload,
  ChevronDown,
  Code2,
  SlidersHorizontal,
  LayoutTemplate,
  CheckCheck,
} from 'lucide-react';

interface Col {
  id: string;
  title: string;
  sort_order: number;
}

interface LinkItem {
  id: string;
  label: string;
  url: string;
  column_id: string;
  sort_order: number;
}

interface AvailablePage {
  id: string;
  title: string;
  slug: string;
}

interface MediaItem {
  id?: string;
  _id?: string;
  url: string;
  filename?: string;
  alt_text?: string;
}

type TabType = 'html' | 'css' | 'js' | 'preview';
type ViewLayout = 'split' | 'tabs';
type DeviceMode = 'desktop' | 'mobile';

let cachedFooterCols: Col[] | null = null;
let cachedFooterLinks: LinkItem[] | null = null;
let cachedFooterCustom: any = null;

const DEMO_PRESETS = [
  {
    name: 'Luxury Real Estate Footer',
    badge: 'Recommended',
    description: 'High-end developer branding, RERA badges, quick links, contact strip & back-to-top.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    html: `<div class="prestige-luxury-footer">
  <div class="footer-grid">
    <div class="footer-col-brand">
      <div class="brand-title">PRESTIGE THANE</div>
      <div class="brand-tagline">Phase 1 • Ultra-Luxury High-Rise Residences</div>
      <p class="brand-desc">Experience an elevated lifestyle spread across 30+ acres of verdant greenery, world-class sky amenities, and seamless urban connectivity.</p>
      <div class="rera-pill">
        <span class="rera-dot"></span>
        <span>MAHARERA NO: P51700000123 • Verified Project</span>
      </div>
    </div>
    <div class="footer-col-links">
      <div class="col-heading">Quick Navigation</div>
      <ul class="footer-nav-list">
        <li><a href="/project-overview">Project Overview</a></li>
        <li><a href="/pricing">Pricing & Cost Sheets</a></li>
        <li><a href="/amenities">Clubhouse & Amenities</a></li>
        <li><a href="/floor-plans">Floor Plans & Layouts</a></li>
        <li><a href="/location">Location & Directions</a></li>
      </ul>
    </div>
    <div class="footer-col-contact">
      <div class="col-heading">Sales & Site Office</div>
      <p class="contact-addr">Ghodbunder Road, Kasarvadavali, Thane West, Maharashtra 400615</p>
      <div class="contact-phone">
        <a href="tel:+919022222448">📞 +91 90222 22448</a>
      </div>
      <button class="btn-enquire-footer" onclick="window.location.hash='book-site-visit'">
        Book Private Site Tour
      </button>
    </div>
  </div>
  <div class="footer-bottom-strip">
    <div class="copyright-text">© 2026 Prestige Group & Authorized Sales Partners. All rights reserved.</div>
    <button class="back-to-top-btn" id="luxury-scroll-top">↑ Back to Top</button>
  </div>
</div>`,
    css: `.prestige-luxury-footer {
  background: #090d16;
  color: #94a3b8;
  padding: 3.5rem 2rem 2rem;
  border-top: 1px solid rgba(217, 119, 6, 0.25);
  font-family: system-ui, -apple-system, sans-serif;
}
.footer-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 2.5rem;
}
@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
}
.brand-title {
  color: #f59e0b;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.brand-tagline {
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.25rem;
}
.brand-desc {
  font-size: 0.825rem;
  line-height: 1.6;
  margin: 0.85rem 0 1.25rem;
  color: #94a3b8;
}
.rera-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(217, 119, 6, 0.12);
  border: 1px solid rgba(217, 119, 6, 0.3);
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.725rem;
  font-weight: 700;
  color: #fbbf24;
}
.rera-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}
.col-heading {
  color: #f8fafc;
  font-size: 0.925rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  border-bottom: 2px solid #d97706;
  display: inline-block;
  padding-bottom: 0.25rem;
}
.footer-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-nav-list li { margin-bottom: 0.5rem; }
.footer-nav-list a {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}
.footer-nav-list a:hover { color: #f59e0b; }
.contact-addr { font-size: 0.825rem; line-height: 1.5; color: #cbd5e1; margin-bottom: 0.75rem; }
.contact-phone a {
  color: #f59e0b;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
}
.btn-enquire-footer {
  margin-top: 1rem;
  width: 100%;
  padding: 0.65rem 1rem;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
  transition: transform 0.2s;
}
.btn-enquire-footer:hover { transform: translateY(-1px); }
.footer-bottom-strip {
  max-width: 1200px;
  margin: 2.5rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.75rem;
}
.back-to-top-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.75rem;
}`,
    js: `const scrollTopBtn = document.getElementById('luxury-scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}`,
  },
  {
    name: 'Modern Newsletter Promo',
    badge: 'Lead Capture',
    description: 'Interactive newsletter capture card with email confirmation & quick links.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    html: `<div class="custom-footer-promo">
  <div class="promo-content">
    <h3>✨ Stay Updated with Exclusive Project Launches</h3>
    <p>Join over 10,000+ home buyers receiving early access pricing & priority inventory.</p>
  </div>
  <div class="promo-form">
    <input type="email" placeholder="Enter your email address" id="footer-newsletter-input" />
    <button id="footer-subscribe-btn">Subscribe Now</button>
  </div>
  <div id="footer-status-msg"></div>
</div>
<div class="footer-scroll-top">
  <button id="scroll-top-btn" title="Back to top">↑ Top</button>
</div>`,
    css: `.custom-footer-promo {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #fff;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.promo-content h3 {
  margin: 0 0 0.4rem 0;
  font-size: 1.25rem;
  color: #38bdf8;
}
.promo-content p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.875rem;
}
.promo-form {
  display: flex;
  gap: 0.5rem;
}
.promo-form input {
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #fff;
  font-size: 0.875rem;
  outline: none;
}
.promo-form button {
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  background: #38bdf8;
  color: #0f172a;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.promo-form button:hover { opacity: 0.9; }
.footer-scroll-top {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
#scroll-top-btn {
  background: transparent;
  color: #64748b;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
}`,
    js: `const subBtn = document.getElementById('footer-subscribe-btn');
const emailInput = document.getElementById('footer-newsletter-input');
const statusMsg = document.getElementById('footer-status-msg');
const scrollTopBtn = document.getElementById('scroll-top-btn');

if (subBtn && emailInput && statusMsg) {
  subBtn.onclick = () => {
    if (!emailInput.value) {
      statusMsg.textContent = 'Please enter an email!';
      statusMsg.style.color = '#ef4444';
      return;
    }
    statusMsg.textContent = '🎉 Thank you for subscribing!';
    statusMsg.style.color = '#22c55e';
    emailInput.value = '';
  };
}

if (scrollTopBtn) {
  scrollTopBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}`,
  },
];

const STARTER_COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Project Overview', url: '/project-overview' },
      { label: 'Pricing & Configurations', url: '/pricing' },
      { label: 'World-Class Amenities', url: '/amenities' },
      { label: 'Floor Plans & Layouts', url: '/floor-plans' },
      { label: 'Interactive Gallery', url: '/gallery' },
    ],
  },
  {
    title: 'Location & Connectivity',
    links: [
      { label: 'Strategic Location', url: '/location' },
      { label: 'Site Address & Directions', url: '/location#map' },
      { label: 'Transit & Highways', url: '/location#connectivity' },
      { label: 'Book Site Visit', url: '#book-site-visit' },
    ],
  },
  {
    title: 'Legal & Transparency',
    links: [
      { label: 'Compliance & Disclosures', url: '/compliance-notice-strip' },
      { label: 'Terms & Conditions', url: '/terms' },
      { label: 'Privacy Policy', url: '/privacy' },
      { label: 'Authorized Partner Info', url: '/developer' },
    ],
  },
];

export default function AdminFooterPage() {
  const [columns, setColumns] = useState<Col[]>(() => cachedFooterCols || []);
  const [links, setLinks] = useState<LinkItem[]>(() => cachedFooterLinks || []);
  const [loading, setLoading] = useState(() => !cachedFooterCols);
  const [newCol, setNewCol] = useState('');

  // Custom Footer State
  const [footerImage, setFooterImage] = useState(() => cachedFooterCustom?.footer_image || '');
  const [customHtml, setCustomHtml] = useState(() => cachedFooterCustom?.custom_html || '');
  const [customCss, setCustomCss] = useState(() => cachedFooterCustom?.custom_css || '');
  const [customJs, setCustomJs] = useState(() => cachedFooterCustom?.custom_js || '');
  const [showDefaultLinks, setShowDefaultLinks] = useState(
    () => (cachedFooterCustom ? cachedFooterCustom.show_default_links !== false : true)
  );

  // Editor controls & layout modes
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('split');
  const [previewDevice, setPreviewDevice] = useState<DeviceMode>('desktop');
  const [savingCustom, setSavingCustom] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [copied, setCopied] = useState(false);

  // Available pages for fast link picker
  const [availablePages, setAvailablePages] = useState<AvailablePage[]>([]);

  // Media picker modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bootstrap preset state
  const [bootstrappingCols, setBootstrappingCols] = useState(false);

  useEffect(() => {
    load();
    loadCustomSettings();
    loadPages();
  }, []);

  async function load() {
    if (!cachedFooterCols) setLoading(true);
    try {
      const [resCols, resLinks] = await Promise.all([
        fetch('/api/footer/columns', { cache: 'no-store' }),
        fetch('/api/footer/links', { cache: 'no-store' }),
      ]);
      if (resCols.ok && resLinks.ok) {
        const jsonCols = await resCols.json();
        const jsonLinks = await resLinks.json();
        const cols = (jsonCols.columns as Col[]) ?? [];
        const lnks = (jsonLinks.links as LinkItem[]) ?? [];
        cachedFooterCols = cols;
        cachedFooterLinks = lnks;
        setColumns(cols);
        setLinks(lnks);
      }
    } catch (err) {
      console.warn('Failed to fetch footer data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomSettings() {
    try {
      const res = await fetch('/api/footer/custom', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        cachedFooterCustom = data;
        setFooterImage(data.footer_image || '');
        setCustomHtml(data.custom_html || '');
        setCustomCss(data.custom_css || '');
        setCustomJs(data.custom_js || '');
        setShowDefaultLinks(data.show_default_links !== false);
      }
    } catch (err) {
      console.error('Failed to load custom footer settings:', err);
    }
  }

  async function loadPages() {
    try {
      const res = await fetch('/api/pages', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setAvailablePages(data.pages || []);
      }
    } catch {}
  }

  async function openMediaModal() {
    setMediaModalOpen(true);
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/media', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error('Failed to load media list:', err);
    } finally {
      setLoadingMedia(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setFooterImage(json.url);
          setMediaModalOpen(false);
        }
      } else {
        alert('Upload failed: ' + (await res.text()));
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveCustomSettings() {
    setSavingCustom(true);
    try {
      const res = await fetch('/api/footer/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footer_image: footerImage,
          custom_html: customHtml,
          custom_css: customCss,
          custom_js: customJs,
          show_default_links: showDefaultLinks,
        }),
      });

      if (res.ok) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
        await logActivity('update', 'footer', 'Custom footer settings updated');
      }
    } catch (err) {
      console.error('Error saving custom footer:', err);
    } finally {
      setSavingCustom(false);
    }
  }

  function applyPreset(preset: (typeof DEMO_PRESETS)[0]) {
    if (
      customHtml.trim() &&
      !confirm(`Apply "${preset.name}" preset? This will overwrite your existing custom HTML/CSS/JS code.`)
    ) {
      return;
    }
    if (preset.image) setFooterImage(preset.image);
    setCustomHtml(preset.html);
    setCustomCss(preset.css);
    setCustomJs(preset.js);
    setActiveTab('html');
  }

  function copyCurrentCode() {
    const currentCode =
      activeTab === 'html' ? customHtml : activeTab === 'css' ? customCss : customJs;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  // Quick 1-Click Bootstrap Starter Columns
  async function bootstrapStarterColumns() {
    if (
      columns.length > 0 &&
      !confirm('Add 3 standard real estate columns? Existing columns will be preserved.')
    ) {
      return;
    }

    setBootstrappingCols(true);
    try {
      for (const [idx, colData] of STARTER_COLUMNS.entries()) {
        const resCol = await fetch('/api/footer/columns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: colData.title,
            sort_order: columns.length + idx,
          }),
        });

        if (resCol.ok) {
          const colJson = await resCol.json();
          const colId = colJson.column?.id || colJson.column?._id;
          if (colId) {
            for (const [lIdx, link] of colData.links.entries()) {
              await fetch('/api/footer/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  label: link.label,
                  url: link.url,
                  column_id: colId,
                  sort_order: lIdx,
                }),
              });
            }
          }
        }
      }
      await load();
      await logActivity('create', 'footer_columns', 'Bootstrapped standard real estate columns');
    } catch (err) {
      console.error('Failed to bootstrap columns:', err);
    } finally {
      setBootstrappingCols(false);
    }
  }

  // Column operations
  async function addColumn() {
    if (!newCol.trim()) return;
    try {
      const res = await fetch('/api/footer/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newCol.trim(), sort_order: columns.length }),
      });
      if (res.ok) {
        await logActivity('create', 'footer_column', newCol);
        setNewCol('');
        load();
      }
    } catch (err) {
      console.error('Error adding column:', err);
    }
  }

  async function updateCol(id: string, title: string) {
    try {
      await fetch(`/api/footer/columns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    } catch (err) {
      console.error('Error updating column:', err);
    }
  }

  async function removeCol(id: string, title: string) {
    if (!confirm(`Delete column "${title}" and all its links?`)) return;
    try {
      await fetch(`/api/footer/columns/${id}`, { method: 'DELETE' });
      await logActivity('delete', 'footer_column', title, id);
      load();
    } catch (err) {
      console.error('Error removing column:', err);
    }
  }

  // Link operations
  async function addLink(colId: string, label: string, url: string) {
    if (!label.trim()) return;
    try {
      const colLinks = links.filter((l) => l.column_id === colId);
      const res = await fetch('/api/footer/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: label.trim(),
          url: url || '/',
          column_id: colId,
          sort_order: colLinks.length,
        }),
      });
      if (res.ok) {
        await logActivity('create', 'footer_link', label);
        load();
      }
    } catch (err) {
      console.error('Error adding link:', err);
    }
  }

  async function updateLink(id: string, field: 'label' | 'url', value: string) {
    try {
      await fetch(`/api/footer/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    } catch (err) {
      console.error('Error updating link:', err);
    }
  }

  async function removeLink(id: string, label: string) {
    try {
      await fetch(`/api/footer/links/${id}`, { method: 'DELETE' });
      await logActivity('delete', 'footer_link', label, id);
      load();
    } catch (err) {
      console.error('Error removing link:', err);
    }
  }

  async function moveLink(id: string, colId: string, direction: 'up' | 'down') {
    const colLinks = links
      .filter((l) => l.column_id === colId)
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = colLinks.findIndex((l) => l.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colLinks.length) return;

    const target = colLinks[targetIndex];
    const current = colLinks[index];

    // Swap sort orders
    await Promise.all([
      fetch(`/api/footer/links/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: target.sort_order }),
      }),
      fetch(`/api/footer/links/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: current.sort_order }),
      }),
    ]);
    load();
  }

  const previewSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 1.25rem;
            color: #1e293b;
            background: #0b1120;
          }
          .preview-banner {
            width: 100%;
            max-height: 180px;
            object-fit: cover;
            border-radius: 0.75rem;
            margin-bottom: 1.25rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          ${customCss}
        </style>
      </head>
      <body>
        ${
          footerImage
            ? `<img src="${footerImage}" class="preview-banner" alt="Footer Banner" />`
            : ''
        }
        ${
          customHtml ||
          '<div style="text-align: center; padding: 3rem 1rem; color: #64748b; font-style: italic;">No custom HTML markup entered yet. Start typing or apply a preset above...</div>'
        }
        <script>
          try {
            ${customJs}
          } catch(e) {
            console.error('Footer preview script error:', e);
          }
        </script>
      </body>
    </html>
  `;

  const filteredMedia = mediaList.filter((m) => {
    if (!mediaSearch) return true;
    const term = mediaSearch.toLowerCase();
    return (
      (m.filename && m.filename.toLowerCase().includes(term)) ||
      (m.alt_text && m.alt_text.toLowerCase().includes(term)) ||
      m.url.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div className="space-y-3">
          {/* Breadcrumbs & Back link */}
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/40 transition shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Back to Admin</span>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground font-medium">Dashboard</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-semibold text-foreground">Footer Management</span>
          </div>

          {/* Title with Badge & Icon */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-xs">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-normal sm:leading-snug py-0.5">
                  Footer Customizer
                </h1>
                {customHtml.trim() ? (
                  <Badge
                    variant="outline"
                    className="border-amber-400/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[11px] px-2.5 py-0.5 rounded-md h-fit flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Custom Engine Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-muted bg-muted/40 text-muted-foreground font-medium text-[11px] px-2.5 py-0.5 rounded-md h-fit"
                  >
                    Standard Layout
                  </Badge>
                )}
                {savedNotice && (
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-600 shadow-2xs animate-in fade-in dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Saved & Live!</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Design custom luxury footer HTML, CSS & JS, configure banner images, and manage standard link directories.
              </p>
            </div>
          </div>
        </div>

        {/* Global Save Action */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Site Footer</span>
          </Link>

          <Button
            onClick={saveCustomSettings}
            disabled={savingCustom}
            className="gap-2 font-bold px-4 h-10 shadow-sm"
          >
            {savingCustom ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{savingCustom ? 'Saving Changes...' : 'Save Footer'}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="p-4 border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Footer Engine</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">
            {customHtml.trim() ? 'Custom HTML' : 'Standard'}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {customHtml ? `${customHtml.length.toLocaleString()} chars coded` : 'Using standard directories'}
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Banner Strip</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
              <ImageIcon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">
            {footerImage ? 'Configured' : 'Not Set'}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {footerImage ? 'Header image active' : 'Optional banner strip'}
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Link Columns</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
              <Columns className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">
            {columns.length} {columns.length === 1 ? 'Column' : 'Columns'}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {showDefaultLinks ? 'Active in footer' : 'Suppressed by custom HTML'}
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Directory Links</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <Link2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">
            {links.length} {links.length === 1 ? 'Link' : 'Links'}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {columns.length > 0
              ? `${Math.round(links.length / (columns.length || 1))} links / column avg`
              : 'Add columns below'}
          </div>
        </Card>
      </div>

      {/* SECTION 1: FOOTER BANNER / IMAGE STRIP */}
      <Card className="p-5 border-border rounded-2xl shadow-sm bg-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Footer Banner / Image Strip</h2>
              <p className="text-[11px] text-muted-foreground">
                Optional full-width visual hero or brand banner rendered above footer navigation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openMediaModal}
              className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5 text-primary" />
              Browse Media
            </Button>

            {footerImage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFooterImage('')}
                className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 space-y-1.5">
            <Label htmlFor="footer-banner-url" className="text-xs font-bold">
              Image URL / Source
            </Label>
            <div className="relative">
              <Input
                id="footer-banner-url"
                value={footerImage}
                onChange={(e) => setFooterImage(e.target.value)}
                placeholder="https://images.unsplash.com/... or /uploads/banner.png"
                className="h-9 text-xs font-mono pl-8"
              />
              <Link2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              You can paste an external image link, pick an asset from your Media Library, or upload a custom graphic.
            </p>
          </div>

          <div className="md:col-span-4">
            {footerImage ? (
              <div className="group relative overflow-hidden rounded-xl border border-border bg-muted/30 p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={footerImage}
                  alt="Footer Banner Preview"
                  className="h-20 w-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <a
                    href={footerImage}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-background/90 text-foreground text-xs hover:bg-background"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/60 text-xs">
                <ImageIcon className="h-5 w-5 mb-1 opacity-50" />
                <span>No banner selected</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 2: FOOTER CODE CUSTOMIZER & LIVE INTERACTIVE SPLIT-VIEW */}
      <Card className="border-border rounded-2xl shadow-sm bg-card overflow-hidden">
        {/* Card Header & Controls */}
        <div className="p-5 border-b border-border bg-card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Footer Image & Code Customizer</h2>
              <p className="text-[11px] text-muted-foreground">
                Craft custom HTML markup, CSS styling, and JavaScript logic with live interactive preview.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Template Presets Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline">
                Preset:
              </span>
              {DEMO_PRESETS.map((preset) => (
                <Button
                  key={preset.name}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="h-8 text-xs font-semibold gap-1 hover:border-primary/40 cursor-pointer"
                  title={preset.description}
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  {preset.name.split(' ')[0]}
                </Button>
              ))}
            </div>

            {/* View Layout Toggle: Split View vs Tabs */}
            <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
              <button
                type="button"
                onClick={() => setViewLayout('split')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                  viewLayout === 'split'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Side-by-side code editor and live preview"
              >
                <Columns className="h-3.5 w-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('tabs')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                  viewLayout === 'tabs'
                    ? 'bg-background text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Full-width tabbed editor"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Tabbed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor & Preview Section */}
        <div className={viewLayout === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border' : ''}>
          {/* Left Column: Code Editor */}
          <div className={viewLayout === 'split' ? 'lg:col-span-6 flex flex-col' : 'flex flex-col'}>
            {/* Editor Sub-header with Language Tabs & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-3 py-2 gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('html')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    activeTab === 'html'
                      ? 'bg-background text-foreground shadow-2xs border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-orange-500" />
                  <span>HTML</span>
                  {customHtml && (
                    <span className="ml-1 text-[10px] font-mono text-muted-foreground">
                      {customHtml.length}c
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('css')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    activeTab === 'css'
                      ? 'bg-background text-foreground shadow-2xs border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Palette className="h-3.5 w-3.5 text-blue-500" />
                  <span>CSS</span>
                  {customCss && (
                    <span className="ml-1 text-[10px] font-mono text-muted-foreground">
                      {customCss.length}c
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('js')}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    activeTab === 'js'
                      ? 'bg-background text-foreground shadow-2xs border border-border'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-yellow-500" />
                  <span>JavaScript</span>
                  {customJs && (
                    <span className="ml-1 text-[10px] font-mono text-muted-foreground">
                      {customJs.length}c
                    </span>
                  )}
                </button>

                {viewLayout === 'tabs' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      activeTab === 'preview'
                        ? 'bg-primary text-white shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Live Preview</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyCurrentCode}
                  className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
            </div>

            {/* Editor Textareas */}
            <div className="p-4 flex-1">
              {activeTab === 'html' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-footer-html" className="text-xs font-bold">
                      Footer HTML Structure
                    </Label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {customHtml.length.toLocaleString()} characters
                    </span>
                  </div>
                  <Textarea
                    id="custom-footer-html"
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    rows={viewLayout === 'split' ? 18 : 14}
                    placeholder="<div class='prestige-luxury-footer'>...</div>"
                    className="font-mono text-xs leading-relaxed bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 border-border/80 focus-visible:ring-primary"
                    spellCheck={false}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Injected across every page inside the main site footer container.
                  </p>
                </div>
              )}

              {activeTab === 'css' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-footer-css" className="text-xs font-bold">
                      Footer CSS Stylesheet
                    </Label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {customCss.length.toLocaleString()} characters
                    </span>
                  </div>
                  <Textarea
                    id="custom-footer-css"
                    value={customCss}
                    onChange={(e) => setCustomCss(e.target.value)}
                    rows={viewLayout === 'split' ? 18 : 14}
                    placeholder=".prestige-luxury-footer { background: #090d16; color: #fff; }"
                    className="font-mono text-xs leading-relaxed bg-slate-950 text-blue-200 dark:bg-slate-950 dark:text-blue-200 border-border/80 focus-visible:ring-primary"
                    spellCheck={false}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Custom CSS styling scoped directly to footer classes and typography.
                  </p>
                </div>
              )}

              {activeTab === 'js' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="custom-footer-js" className="text-xs font-bold">
                      Footer JavaScript Runtime
                    </Label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {customJs.length.toLocaleString()} characters
                    </span>
                  </div>
                  <Textarea
                    id="custom-footer-js"
                    value={customJs}
                    onChange={(e) => setCustomJs(e.target.value)}
                    rows={viewLayout === 'split' ? 18 : 14}
                    placeholder="// Footer interactive scripts&#10;console.log('Footer initialized');"
                    className="font-mono text-xs leading-relaxed bg-slate-950 text-amber-200 dark:bg-slate-950 dark:text-amber-200 border-border/80 focus-visible:ring-primary"
                    spellCheck={false}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Client-side scripts executed automatically when the footer renders.
                  </p>
                </div>
              )}

              {viewLayout === 'tabs' && activeTab === 'preview' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">Full Live Preview</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`p-1 rounded-md transition ${
                            previewDevice === 'desktop' ? 'bg-background shadow-2xs text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          <Monitor className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`p-1 rounded-md transition ${
                            previewDevice === 'mobile' ? 'bg-background shadow-2xs text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-emerald-600 font-semibold">Live Sandbox</span>
                    </div>
                  </div>
                  <div className={`mx-auto overflow-hidden rounded-xl border border-border bg-slate-950 shadow-inner ${previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
                    <iframe
                      title="Footer Full Live Preview"
                      srcDoc={previewSrcDoc}
                      className="h-[420px] w-full border-0"
                      sandbox="allow-scripts allow-modals"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Interactive Preview (Shown in Split View) */}
          {viewLayout === 'split' && (
            <div className="lg:col-span-6 flex flex-col bg-muted/10">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">Interactive Live Preview</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold">
                    Real-time
                  </Badge>
                </div>

                {/* Device Switcher */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center rounded-lg border border-border p-0.5 bg-background">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                        previewDevice === 'desktop'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Monitor className="h-3 w-3" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded transition cursor-pointer ${
                        previewDevice === 'mobile'
                          ? 'bg-primary text-white shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Smartphone className="h-3 w-3" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-center items-center">
                <div
                  className={`w-full overflow-hidden rounded-xl border border-border bg-slate-950 shadow-lg transition-all duration-300 ${
                    previewDevice === 'mobile' ? 'max-w-[375px]' : 'w-full'
                  }`}
                >
                  <iframe
                    title="Footer Split Live Preview"
                    srcDoc={previewSrcDoc}
                    className="h-[430px] w-full border-0"
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Standard Columns Toggle Card */}
        <div className="p-4 bg-muted/20 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <Label htmlFor="toggle-links" className="text-xs font-bold cursor-pointer text-foreground">
              Display Standard Columns & Directory Below Custom Content
            </Label>
            <p className="text-[11px] text-muted-foreground">
              When toggled ON, the multi-column link directories configured below will render directly beneath your custom footer.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground">
              {showDefaultLinks ? 'Hybrid Active' : 'Custom Only'}
            </span>
            <Switch
              id="toggle-links"
              checked={showDefaultLinks}
              onCheckedChange={setShowDefaultLinks}
            />
          </div>
        </div>
      </Card>

      {/* SECTION 3: FOOTER COLUMNS & LINK DIRECTORIES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
              <Columns className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Footer Columns & Link Directories</h2>
              <p className="text-xs text-muted-foreground">
                Structured column lists with page links, quick shortcuts, and external documentation.
              </p>
            </div>
          </div>

          {/* Quick Bootstrap Preset Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={bootstrapStarterColumns}
            disabled={bootstrappingCols}
            className="gap-1.5 text-xs font-bold border-amber-300/70 bg-amber-50/70 text-amber-900 hover:bg-amber-100 hover:border-amber-400 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 cursor-pointer self-start sm:self-center"
          >
            {bootstrappingCols ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            )}
            <span>+ Quick Setup Standard Columns</span>
          </Button>
        </div>

        {/* Add New Column Form Card */}
        <Card className="p-4 border-border rounded-2xl shadow-xs bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addColumn();
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="new-col-input" className="text-xs font-bold">
                New Column Title
              </Label>
              <Input
                id="new-col-input"
                value={newCol}
                onChange={(e) => setNewCol(e.target.value)}
                placeholder="e.g. Quick Links, Properties, Legal & RERA"
                className="h-9 text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={!newCol.trim()}
              className="h-9 gap-1.5 font-bold text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Column</span>
            </Button>
          </form>
        </Card>

        {/* Columns Grid or Empty State */}
        {loading ? (
          <Card className="p-12 text-center text-sm text-muted-foreground rounded-2xl">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
            <span>Loading footer directory columns...</span>
          </Card>
        ) : columns.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-border rounded-2xl bg-card space-y-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
              <Columns className="h-6 w-6 opacity-60" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-bold text-foreground">No Footer Columns Configured</h3>
              <p className="text-xs text-muted-foreground">
                You can create custom multi-column link directories or 1-click bootstrap default real estate navigation columns.
              </p>
            </div>
            <Button
              type="button"
              onClick={bootstrapStarterColumns}
              disabled={bootstrappingCols}
              className="gap-2 text-xs font-bold"
            >
              <Sparkles className="h-4 w-4" />
              <span>Bootstrap Standard 3-Column Directory</span>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((col) => {
              const colLinks = links
                .filter((l) => l.column_id === col.id)
                .sort((a, b) => a.sort_order - b.sort_order);

              return (
                <Card
                  key={col.id}
                  className="p-4 border-border rounded-2xl shadow-sm bg-card flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Column Header */}
                    <div className="flex items-center gap-2 border-b border-border pb-2.5">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <FolderPlus className="h-3.5 w-3.5" />
                      </div>
                      <Input
                        value={col.title}
                        onChange={(e) => updateCol(col.id, e.target.value)}
                        className="h-8 text-xs font-bold flex-1"
                        placeholder="Column Title"
                      />
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono px-1.5 py-0.5 border-border shrink-0"
                      >
                        {colLinks.length} links
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCol(col.id, col.title)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                        title="Delete column"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Links List */}
                    <div className="space-y-2">
                      {colLinks.map((link, idx) => (
                        <div
                          key={link.id}
                          className="group flex items-center gap-1.5 p-1.5 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/40 transition"
                        >
                          {/* Reorder Buttons */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => moveLink(link.id, col.id, 'up')}
                              disabled={idx === 0}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="h-2.5 w-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveLink(link.id, col.id, 'down')}
                              disabled={idx === colLinks.length - 1}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          <Input
                            value={link.label}
                            onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                            className="h-7 text-xs font-semibold w-28 shrink-0"
                            placeholder="Label"
                          />

                          <Input
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            className="h-7 text-[11px] font-mono flex-1 min-w-0"
                            placeholder="/url"
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLink(link.id, link.label)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0 cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}

                      {colLinks.length === 0 && (
                        <div className="py-4 text-center text-xs text-muted-foreground/60 italic">
                          No links in this column yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Link to Column with Select2 Page Picker */}
                  <AddLinkBox
                    colId={col.id}
                    availablePages={availablePages}
                    onAdd={(label, url) => addLink(col.id, label, url)}
                  />
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* MEDIA LIBRARY PICKER MODAL */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Select Banner from Media Library</h3>
                  <p className="text-xs text-muted-foreground">Pick an uploaded graphic or upload a new file.</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMediaModalOpen(false)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Search & Upload Strip */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  placeholder="Search media files by name..."
                  className="h-9 text-xs pl-8 w-full"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="h-9 gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
              >
                {uploadingImage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>Upload New</span>
              </Button>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto min-h-[300px] border border-border rounded-xl p-3 bg-muted/10">
              {loadingMedia ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span>Loading media library...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
                  <ImageIcon className="h-8 w-8 opacity-40" />
                  <span>No media files found. Upload a banner above.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((m, idx) => (
                    <div
                      key={m.id || m._id || idx}
                      onClick={() => {
                        setFooterImage(m.url);
                        setMediaModalOpen(false);
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-1.5 hover:border-primary transition shadow-2xs hover:shadow-md"
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.url}
                          alt={m.filename || 'Media'}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="mt-1.5 truncate text-[11px] font-semibold text-foreground px-1">
                        {m.filename || m.alt_text || m.url.split('/').pop()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Add Link Box with Select2 Page Picker
function AddLinkBox({
  colId,
  availablePages,
  onAdd,
}: {
  colId: string;
  availablePages: AvailablePage[];
  onAdd: (label: string, url: string) => void;
}) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('/');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredPages = availablePages.filter((p) => {
    if (!pickerSearch) return true;
    const term = pickerSearch.toLowerCase();
    return p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term);
  });

  return (
    <div className="mt-2 border-t border-border pt-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          + Add New Link
        </span>

        {/* Select2-Style Page Picker Popover */}
        {availablePages.length > 0 && (
          <div className="relative" ref={pickerRef}>
            <button
              type="button"
              onClick={() => setPickerOpen(!pickerOpen)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Pick Site Page</span>
              <ChevronDown className={`h-2.5 w-2.5 transition ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {pickerOpen && (
              <div className="absolute right-0 bottom-full mb-1 z-40 w-60 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-1.5 border-b border-border bg-muted/30">
                  <input
                    type="text"
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Search site pages..."
                    className="w-full h-7 text-[11px] px-2 bg-background rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div className="max-h-44 overflow-y-auto p-1 divide-y divide-border/20">
                  {filteredPages.map((pg) => (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => {
                        setLabel(pg.title);
                        setUrl(pg.slug === 'home' ? '/' : `/${pg.slug}`);
                        setPickerOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-accent/70 transition cursor-pointer"
                    >
                      <div className="font-semibold truncate">{pg.title}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {pg.slug === 'home' ? '/' : `/${pg.slug}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Link Label"
          className="h-8 text-xs font-semibold w-28 shrink-0"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/destination"
          className="h-8 text-xs font-mono flex-1 min-w-0"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (!label.trim()) return;
            onAdd(label, url);
            setLabel('');
            setUrl('/');
          }}
          disabled={!label.trim()}
          className="h-8 px-2.5 font-bold text-xs shrink-0 cursor-pointer"
          title="Add link to column"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
