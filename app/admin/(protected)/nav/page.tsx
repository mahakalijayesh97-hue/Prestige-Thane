'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Link2,
  CornerDownRight,
  Eye,
  Sparkles,
  Layers,
  Globe,
  Compass,
  Type,
  FolderPlus,
  ChevronDown,
  Navigation,
  Loader2,
  FileText,
  Phone,
  Save,
} from 'lucide-react';

interface NavRow {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  target: string;
  is_active: boolean;
}

interface AvailablePage {
  id: string;
  title: string;
  slug: string;
}

const PROJECT_PRESETS = [
  { label: 'Overview', url: '/overview' },
  { label: 'Projects', url: '/projects' },
  { label: 'Properties', url: '/properties' },
  { label: 'Pricing', url: '#pricing' },
  { label: 'Amenities', url: '/amenities' },
  { label: 'Floor Plans', url: '/floor-plans' },
  { label: 'Master Plan', url: '/master-plan' },
  { label: 'Gallery', url: '/gallery' },
  { label: 'Location', url: '/location' },
  { label: 'Brochure', url: '#brochure' },
  { label: 'FAQ', url: '/faq' },
];

const GENERAL_PRESETS = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Services', url: '/services' },
  { label: 'Blog', url: '/blog' },
  { label: 'Contact', url: '/contact' },
];

export default function AdminNavPage() {
  const [items, setItems] = useState<NavRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('/');
  const [newParent, setNewParent] = useState<string>('');
  const [newTarget, setNewTarget] = useState<string>('_self');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  // Brand and available pages state for preview & selector
  const [siteName, setSiteName] = useState('Prestige Thane');
  const [subSiteName, setSubSiteName] = useState('Luxury Residences');
  const [logoUrl, setLogoUrl] = useState('/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png');
  const [pages, setPages] = useState<AvailablePage[]>([]);

  // Dynamic Header Right-Side Action & Phone states
  const [navbarPhone, setNavbarPhone] = useState('+91 90222 22448');
  const [navbarPhoneShow, setNavbarPhoneShow] = useState(true);
  const [navbarCtaText, setNavbarCtaText] = useState('Book Site Visit');
  const [navbarCtaUrl, setNavbarCtaUrl] = useState('#book-site-visit');
  const [navbarCtaShow, setNavbarCtaShow] = useState(true);
  const [savingCta, setSavingCta] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // 1. Load Nav Items from API
      const navRes = await fetch('/api/nav', { cache: 'no-store' });
      if (navRes.ok) {
        const json = await navRes.json();
        setItems(json.items || []);
      }

      // 2. Load Brand Settings for Preview
      try {
        const themeRes = await fetch('/api/settings/theme', { cache: 'no-store' });
        if (themeRes.ok) {
          const themeJson = await themeRes.json();
          if (themeJson.sub_site_name) setSubSiteName(themeJson.sub_site_name);
          if (themeJson.navbar_phone !== undefined) setNavbarPhone(themeJson.navbar_phone);
          if (themeJson.navbar_phone_show !== undefined) setNavbarPhoneShow(themeJson.navbar_phone_show);
          if (themeJson.navbar_cta_text !== undefined) setNavbarCtaText(themeJson.navbar_cta_text);
          if (themeJson.navbar_cta_url !== undefined) setNavbarCtaUrl(themeJson.navbar_cta_url);
          if (themeJson.navbar_cta_show !== undefined) setNavbarCtaShow(themeJson.navbar_cta_show);
        }
      } catch {}

      // 3. Load Available Pages for Quick Picker
      try {
        const pagesRes = await fetch('/api/pages', { cache: 'no-store' });
        if (pagesRes.ok) {
          const pagesJson = await pagesRes.json();
          setPages(pagesJson.pages || []);
        }
      } catch {}
    } catch (err) {
      console.error('Failed to load navigation data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveCtaSettings() {
    setSavingCta(true);
    try {
      const res = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navbar_phone: navbarPhone,
          navbar_phone_show: navbarPhoneShow,
          navbar_cta_text: navbarCtaText,
          navbar_cta_url: navbarCtaUrl,
          navbar_cta_show: navbarCtaShow,
        }),
      });
      if (res.ok) {
        notifySaved();
      }
    } catch (err) {
      console.error('Failed to save navbar action settings:', err);
    } finally {
      setSavingCta(false);
    }
  }

  function notifySaved() {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  // Add new menu item
  async function add() {
    if (!newLabel.trim()) return;
    setAdding(true);

    const payload = {
      label: newLabel.trim(),
      url: newUrl.trim() || '/',
      parent_id: newParent || null,
      sort_order: items.length,
      target: newTarget || '_self',
      is_active: true,
    };

    try {
      const res = await fetch('/api/nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        await logActivity('create', 'nav_item', newLabel);
        setNewLabel('');
        setNewUrl('/');
        setNewParent('');
        setNewTarget('_self');
        if (json.item) {
          setItems((prev) => [...prev, json.item]);
        } else {
          await loadData();
        }
        notifySaved();
      }
    } catch (err) {
      console.error('Error adding nav item:', err);
    } finally {
      setAdding(false);
    }
  }

  // Update item field (label, url, target, is_active)
  async function update(
    id: string,
    field: keyof NavRow,
    value: string | boolean
  ) {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );

    try {
      const res = await fetch(`/api/nav/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        notifySaved();
      } else {
        console.error('Failed to update nav item:', await res.text());
      }
    } catch (err) {
      console.error('Error updating nav item:', err);
    }
  }

  // Delete item
  async function remove(id: string, label: string) {
    if (!confirm(`Delete "${label}" from the navigation menu? Sub-menu items will also be removed.`)) return;

    // Optimistic removal
    setItems((prev) => prev.filter((i) => i.id !== id && i.parent_id !== id));

    try {
      await fetch(`/api/nav/${id}`, { method: 'DELETE' });
      await logActivity('delete', 'nav_item', label, id);
      notifySaved();
    } catch (err) {
      console.error('Error deleting nav item:', err);
    }
  }

  // Move item up or down
  async function moveItem(id: string, direction: 'up' | 'down') {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const siblings = items
      .filter((i) => i.parent_id === item.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const currentIndex = siblings.findIndex((i) => i.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const targetItem = siblings[targetIndex];

    const reordered = [...siblings];
    reordered[currentIndex] = targetItem;
    reordered[targetIndex] = item;

    const updates = reordered.map((p, idx) => ({
      id: p.id,
      sort_order: idx,
      parent_id: p.parent_id,
    }));

    setItems((prev) =>
      prev.map((i) => {
        const u = updates.find((up) => up.id === i.id);
        return u ? { ...i, sort_order: u.sort_order } : i;
      })
    );

    notifySaved();

    try {
      await fetch('/api/nav', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      });
    } catch (err) {
      console.error('Error updating nav order:', err);
    }
  }

  // Drag and Drop
  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedId || draggedId === targetId) return;

    const draggedItem = items.find((i) => i.id === draggedId);
    const targetItem = items.find((i) => i.id === targetId);
    if (!draggedItem || !targetItem) return;

    if (draggedItem.parent_id !== targetItem.parent_id) return;

    const siblings = items
      .filter((i) => i.parent_id === draggedItem.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const fromIndex = siblings.findIndex((i) => i.id === draggedId);
    const toIndex = siblings.findIndex((i) => i.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...siblings];
    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);

    const updates = reordered.map((p, idx) => ({
      id: p.id,
      sort_order: idx,
      parent_id: p.parent_id,
    }));

    setItems((prev) =>
      prev.map((i) => {
        const u = updates.find((up) => up.id === i.id);
        return u ? { ...i, sort_order: u.sort_order } : i;
      })
    );

    setDraggedId(null);
    notifySaved();

    try {
      await fetch('/api/nav', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updates }),
      });
    } catch (err) {
      console.error('Error updating order on drop:', err);
    }
  }

  // Quick preset click handler
  function applyPreset(preset: { label: string; url: string }) {
    setNewLabel(preset.label);
    setNewUrl(preset.url);
  }

  // Quick page picker handler
  function applyPage(page: AvailablePage) {
    setNewLabel(page.title);
    setNewUrl(page.slug === 'home' ? '/' : `/${page.slug}`);
  }

  const topLevel = items
    .filter((i) => !i.parent_id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const childrenOf = (parentId: string) =>
    items
      .filter((i) => i.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order);

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
            <span className="font-semibold text-foreground">Navigation Menu</span>
          </div>

          {/* Title with Badge & Icon */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-foreground leading-normal sm:leading-snug py-0.5">
                  Navigation Menu
                </h1>
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-bold text-[11px] px-2.5 py-0.5 rounded-md h-fit">
                  {items.length} Links
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Design and organize your website's header links, create multi-level dropdowns, and rearrange link positions.
              </p>
            </div>
          </div>
        </div>

        {/* Right side Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-end">
          {savedNotice && (
            <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-xs animate-in fade-in dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Synced with live site!</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold shadow-xs hover:border-primary/50"
          >
            <Link href="/" target="_blank">
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>View Live Site</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              const el = document.getElementById('add-menu-form');
              el?.scrollIntoView({ behavior: 'smooth' });
              const input = document.getElementById('menu-label');
              input?.focus();
            }}
            className="rounded-xl gap-1.5 text-xs font-bold shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Add Menu Item</span>
          </Button>
        </div>
      </div>

      {/* Modern Live Navbar Preview Widget */}
      <Card className="overflow-hidden border border-border bg-gradient-to-br from-amber-50/40 via-background to-slate-50 p-4 sm:p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-2 text-foreground font-semibold">
            <Eye className="h-4 w-4 text-amber-600" />
            <span>Interactive Live Header Preview</span>
          </span>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline lowercase tracking-normal"
          >
            Open live site <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white px-5 py-3.5 shadow-sm">
          {/* Brand Logo & Title Preview */}
          <div className="flex items-center gap-2.5">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={siteName}
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-600 text-xs font-bold text-white">
                P
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {siteName}
              </span>
              {subSiteName && (
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 -mt-0.5">
                  {subSiteName}
                </span>
              )}
            </div>
          </div>

          {/* Nav Links in Preview */}
          <div className="hidden items-center gap-1 md:flex">
            {topLevel
              .filter((i) => i.is_active)
              .map((item) => {
                const sub = childrenOf(item.id).filter((c) => c.is_active);
                return (
                  <div
                    key={item.id}
                    className="group relative flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer select-none"
                  >
                    <span>{item.label}</span>
                    {sub.length > 0 && (
                      <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-700 transition-transform" />
                    )}

                    {/* Submenu preview popup */}
                    {sub.length > 0 && (
                      <div className="invisible absolute left-0 top-full mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 z-50">
                        {sub.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          >
                            {c.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Live Right-side Phone & CTA Preview */}
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
              {navbarPhoneShow && navbarPhone && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>{navbarPhone}</span>
                </div>
              )}

              {navbarCtaShow && navbarCtaText && (
                <div className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm whitespace-nowrap">
                  {navbarCtaText}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Menu Items List & Add Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Menu Items Drag & Reorder List */}
        <div className="space-y-3.5 lg:col-span-8">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-primary" /> Active Menu Hierarchy
              </h2>
              <span className="rounded-full bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5">
                {topLevel.length} Links
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Drag handles or use arrows to reorder</span>
          </div>

          {loading ? (
            <Card className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Loading navigation menu...</span>
            </Card>
          ) : topLevel.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <Compass className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-semibold">No menu links configured</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Use the form on the right to add your navigation links.
              </p>
            </Card>
          ) : (
            topLevel.map((item, idx) => {
              const children = childrenOf(item.id);
              const isFirst = idx === 0;
              const isLast = idx === topLevel.length - 1;
              const isDragging = draggedId === item.id;
              const isDragOver = dragOverId === item.id;

              return (
                <div
                  key={item.id}
                  className={`space-y-2 transition-all ${
                    isDragging ? 'opacity-40 scale-[0.99]' : 'opacity-100'
                  } ${isDragOver ? 'ring-2 ring-primary ring-offset-2 rounded-2xl' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDrop={(e) => handleDrop(e, item.id)}
                >
                  {/* Top-Level Item Card */}
                  <Card className="border border-border/80 bg-card p-3 sm:p-4 shadow-xs hover:border-primary/50 hover:shadow-md transition-all rounded-2xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Left: Drag Handle, Number, Up/Down */}
                      <div className="flex items-center gap-2">
                        <div
                          title="Drag to rearrange"
                          className="grid h-8 w-6 cursor-grab place-items-center rounded-lg text-muted-foreground/50 hover:bg-muted hover:text-foreground active:cursor-grabbing transition"
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Order Badge */}
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-xs font-black text-foreground border border-border/60">
                          {idx + 1}
                        </span>

                        {/* Arrows */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Move link up"
                            disabled={isFirst}
                            onClick={() => moveItem(item.id, 'up')}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-foreground disabled:opacity-25"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Move link down"
                            disabled={isLast}
                            onClick={() => moveItem(item.id, 'down')}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:bg-accent hover:text-foreground disabled:opacity-25"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Center: Label and URL Inputs */}
                      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        {/* Label Input */}
                        <div className="relative sm:w-48 xl:w-56 shrink-0">
                          <Input
                            value={item.label}
                            onChange={(e) => update(item.id, 'label', e.target.value)}
                            className="h-9 font-semibold text-xs pl-8"
                            placeholder="Link Label"
                          />
                          <Type className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>

                        {/* URL Input */}
                        <div className="relative flex-1 min-w-[160px]">
                          <Input
                            value={item.url}
                            onChange={(e) => update(item.id, 'url', e.target.value)}
                            className="h-9 font-mono text-xs pl-8 text-foreground"
                            placeholder="/destination or #section"
                          />
                          <Link2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                        </div>

                        {/* Target Select */}
                        <select
                          value={item.target}
                          onChange={(e) => update(item.id, 'target', e.target.value)}
                          className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-muted-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
                        >
                          <option value="_self">Same Tab</option>
                          <option value="_blank">New Tab ↗</option>
                        </select>
                      </div>

                      {/* Right: Visibility Switch, Add Sub-item & Delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                        <div className="flex items-center gap-1.5">
                          <Switch
                            checked={item.is_active}
                            onCheckedChange={(v) => update(item.id, 'is_active', v)}
                            title={item.is_active ? 'Active on site' : 'Hidden from site'}
                          />
                          <Badge
                            variant={item.is_active ? 'default' : 'secondary'}
                            className="text-[10px] font-bold"
                          >
                            {item.is_active ? 'Active' : 'Hidden'}
                          </Badge>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewParent(item.id);
                            setNewLabel('');
                            setNewUrl(`${item.url}/sub-item`);
                          }}
                          className="h-8 gap-1 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
                          title="Add a nested child link under this menu item"
                        >
                          <FolderPlus className="h-3.5 w-3.5 text-primary" />
                          <span className="hidden xl:inline">+ Sub</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(item.id, item.label)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"
                          title="Delete link"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Submenu Dropdown Items */}
                  {children.map((child, cIdx) => {
                    const isChildFirst = cIdx === 0;
                    const isChildLast = cIdx === children.length - 1;

                    return (
                      <div
                        key={child.id}
                        className="ml-6 sm:ml-10 flex items-center gap-2 pt-0.5"
                      >
                        <CornerDownRight className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                        <Card className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-muted/30 border-border/60 rounded-xl">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0 w-fit">
                            Sub {cIdx + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={isChildFirst}
                              onClick={() => moveItem(child.id, 'up')}
                              className="grid h-6 w-6 place-items-center rounded border border-border bg-background text-muted-foreground disabled:opacity-25"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={isChildLast}
                              onClick={() => moveItem(child.id, 'down')}
                              className="grid h-6 w-6 place-items-center rounded border border-border bg-background text-muted-foreground disabled:opacity-25"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>

                          <Input
                            value={child.label}
                            onChange={(e) => update(child.id, 'label', e.target.value)}
                            className="h-8 text-xs font-semibold sm:w-44 xl:w-52 shrink-0"
                            placeholder="Sub-item label"
                          />

                          <Input
                            value={child.url}
                            onChange={(e) => update(child.id, 'url', e.target.value)}
                            className="h-8 text-xs font-mono flex-1 min-w-[140px] text-foreground"
                            placeholder="/destination"
                          />

                          <select
                            value={child.target}
                            onChange={(e) => update(child.id, 'target', e.target.value)}
                            className="h-8 rounded-lg border border-input bg-background px-2 text-[11px] font-medium text-muted-foreground shrink-0"
                          >
                            <option value="_self">Same Tab</option>
                            <option value="_blank">New Tab ↗</option>
                          </select>

                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <Switch
                              checked={child.is_active}
                              onCheckedChange={(v) => update(child.id, 'is_active', v)}
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(child.id, child.label)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Header Action Settings & "+ Add Menu Item" Card */}
        <div className="lg:col-span-4 space-y-5">
          {/* Header Action & Phone Settings Card */}
          <Card className="p-5 border-border shadow-md rounded-2xl bg-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Header Action &amp; Phone</h3>
                  <p className="text-[11px] text-muted-foreground">Right-side Call &amp; CTA Button</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Phone number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="navbar-phone" className="text-xs font-bold">
                    Call / WhatsApp Number
                  </Label>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span>Show</span>
                    <Switch
                      checked={navbarPhoneShow}
                      onCheckedChange={setNavbarPhoneShow}
                    />
                  </div>
                </div>
                <Input
                  id="navbar-phone"
                  value={navbarPhone}
                  onChange={(e) => setNavbarPhone(e.target.value)}
                  placeholder="+91 90222 22448"
                  className="h-9 text-xs"
                />
              </div>

              {/* CTA Button Label */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="navbar-cta-text" className="text-xs font-bold">
                    CTA Button Label
                  </Label>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span>Show</span>
                    <Switch
                      checked={navbarCtaShow}
                      onCheckedChange={setNavbarCtaShow}
                    />
                  </div>
                </div>
                <Input
                  id="navbar-cta-text"
                  value={navbarCtaText}
                  onChange={(e) => setNavbarCtaText(e.target.value)}
                  placeholder="Book Site Visit"
                  className="h-9 text-xs font-bold"
                />
              </div>

              {/* CTA Target / URL */}
              <div className="space-y-1">
                <Label htmlFor="navbar-cta-url" className="text-xs font-bold">
                  CTA Action / URL
                </Label>
                <Input
                  id="navbar-cta-url"
                  value={navbarCtaUrl}
                  onChange={(e) => setNavbarCtaUrl(e.target.value)}
                  placeholder="#book-site-visit"
                  className="h-9 text-xs font-mono"
                />
                <p className="text-[10px] text-muted-foreground">
                  Use <code>#book-site-visit</code> to open the modal popup, or any page URL.
                </p>
              </div>

              <Button
                type="button"
                onClick={saveCtaSettings}
                disabled={savingCta}
                className="w-full h-9 gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white mt-1"
              >
                {savingCta ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-4 w-4" />}
                {savingCta ? 'Saving Settings...' : 'Save Header Action & Phone'}
              </Button>
            </div>
          </Card>

          <Card id="add-menu-form" className="p-5 border-border shadow-md rounded-2xl bg-card space-y-4 scroll-mt-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Add Menu Item</h3>
                  <p className="text-[11px] text-muted-foreground">New link or nested dropdown</p>
                </div>
              </div>
            </div>

            {/* Quick Presets Section */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Quick Project Presets
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {PROJECT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="rounded-lg border border-amber-300/80 bg-amber-50/70 px-2 py-1 text-[11px] font-bold text-amber-900 transition hover:bg-amber-100 hover:border-amber-400 active:scale-95 cursor-pointer"
                  >
                    +{p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {GENERAL_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
                  >
                    +{p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing Pages Quick Picker */}
            {pages.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-border/60">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Pick from Created Pages
                </Label>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const selected = pages.find((p) => p.slug === e.target.value);
                      if (selected) applyPage(selected);
                    }}
                    defaultValue=""
                    className="w-full h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>Select a site page to populate...</option>
                    {pages.map((pg) => (
                      <option key={pg.id} value={pg.slug}>
                        {pg.title} ({pg.slug === 'home' ? '/' : `/${pg.slug}`})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Form Inputs */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                add();
              }}
              className="space-y-3 pt-1 border-t border-border/60"
            >
              <div className="space-y-1">
                <Label htmlFor="menu-label" className="text-xs font-bold">
                  Menu Label <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="menu-label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Amenities, Pricing"
                    className="h-9 text-xs pl-8"
                    required
                  />
                  <Type className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="menu-url" className="text-xs font-bold">
                  Destination URL <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="menu-url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g. /amenities, #pricing, https://..."
                    className="h-9 text-xs font-mono pl-8"
                    required
                  />
                  <Link2 className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="menu-placement" className="text-xs font-bold">
                  Placement (Dropdown Parent)
                </Label>
                <select
                  id="menu-placement"
                  value={newParent}
                  onChange={(e) => setNewParent(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">— Top Level (Main Bar) —</option>
                  {topLevel.map((p) => (
                    <option key={p.id} value={p.id}>
                      Under &quot;{p.label}&quot; (Dropdown Sub-item)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="menu-target" className="text-xs font-bold">
                  Open In
                </Label>
                <select
                  id="menu-target"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="_self">Same Tab (_self)</option>
                  <option value="_blank">New Tab / Window (_blank ↗)</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={adding || !newLabel.trim()}
                className="w-full h-9 gap-1.5 text-xs font-bold mt-2"
              >
                {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-4 w-4" />}
                {adding ? 'Adding Link...' : '+ Add Item to Menu'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
