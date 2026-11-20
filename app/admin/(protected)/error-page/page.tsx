'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  FileQuestion,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Home,
  ArrowLeft,
  Compass,
  Building2,
  Tag,
  Phone,
  MessageCircle,
  Eye,
  Sliders,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Check,
  Grid,
} from 'lucide-react';

interface QuickLinkItem {
  id: string;
  label: string;
  desc: string;
  url: string;
  icon?: string;
  enabled?: boolean;
}

interface ErrorPageConfig {
  badge_text: string;
  error_code: string;
  heading: string;
  subheading: string;
  primary_btn_text: string;
  primary_btn_url: string;
  secondary_btn_text: string;
  show_secondary_btn: boolean;
  quick_links: QuickLinkItem[];
  support_phone: string;
  whatsapp_number: string;
  whatsapp_text: string;
  show_support_strip: boolean;
}

const DEFAULT_CONFIG: ErrorPageConfig = {
  badge_text: 'Page Not Found • 404',
  error_code: '404',
  heading: 'The Luxury Residence You Are Looking For Seems Relocated',
  subheading:
    'The page or layout you requested does not exist or might have been renamed during recent pre-launch updates. Let us guide you back to the official township showcase.',
  primary_btn_text: 'Return to Homepage',
  primary_btn_url: '/',
  secondary_btn_text: 'Go Back',
  show_secondary_btn: true,
  quick_links: [
    {
      id: 'ql_1',
      label: 'Project Overview',
      desc: 'Master layout & 30+ acre luxury township',
      url: '/#overview',
      icon: 'compass',
      enabled: true,
    },
    {
      id: 'ql_2',
      label: 'Floor Plans',
      desc: '2, 3 & 4 BHK architectural layouts',
      url: '/#floor-plans',
      icon: 'building',
      enabled: true,
    },
    {
      id: 'ql_3',
      label: 'Pricing & Configurations',
      desc: 'Starting from ₹1.59 Cr* with early benefits',
      url: '/#pricing',
      icon: 'tag',
      enabled: true,
    },
    {
      id: 'ql_4',
      label: 'Official Sales Desk',
      desc: 'Speak with our certified project specialist',
      url: '/contact',
      icon: 'phone',
      enabled: true,
    },
  ],
  support_phone: '+91 90222 22448',
  whatsapp_number: '919022222448',
  whatsapp_text: 'Hi Prestige Thane Desk, I need assistance finding project details.',
  show_support_strip: true,
};

const ICON_MAP: Record<string, any> = {
  compass: Compass,
  building: Building2,
  tag: Tag,
  phone: Phone,
  home: Home,
};

export default function AdminErrorPageManager() {
  const [config, setConfig] = useState<ErrorPageConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'links' | 'support' | 'preview'>('content');

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings/error-page', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setConfig({
          badge_text: data.badge_text || DEFAULT_CONFIG.badge_text,
          error_code: data.error_code || DEFAULT_CONFIG.error_code,
          heading: data.heading || DEFAULT_CONFIG.heading,
          subheading: data.subheading || DEFAULT_CONFIG.subheading,
          primary_btn_text: data.primary_btn_text || DEFAULT_CONFIG.primary_btn_text,
          primary_btn_url: data.primary_btn_url || DEFAULT_CONFIG.primary_btn_url,
          secondary_btn_text: data.secondary_btn_text || DEFAULT_CONFIG.secondary_btn_text,
          show_secondary_btn: data.show_secondary_btn !== false,
          quick_links: Array.isArray(data.quick_links) ? data.quick_links : DEFAULT_CONFIG.quick_links,
          support_phone: data.support_phone || DEFAULT_CONFIG.support_phone,
          whatsapp_number: data.whatsapp_number || DEFAULT_CONFIG.whatsapp_number,
          whatsapp_text: data.whatsapp_text || DEFAULT_CONFIG.whatsapp_text,
          show_support_strip: data.show_support_strip !== false,
        });
      }
    } catch (err) {
      console.error('Failed to load error page config:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveConfig() {
    try {
      setSaving(true);
      setSavedNotice(false);

      const res = await fetch('/api/settings/error-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error('Failed to save error page configuration');
      }

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Error saving error page configuration');
    } finally {
      setSaving(false);
    }
  }

  function addQuickLink() {
    const newId = `ql_${Date.now()}`;
    setConfig((prev) => ({
      ...prev,
      quick_links: [
        ...prev.quick_links,
        {
          id: newId,
          label: 'New Section Link',
          desc: 'Brief description of this section',
          url: '/#new-section',
          icon: 'compass',
          enabled: true,
        },
      ],
    }));
  }

  function updateQuickLink(id: string, updates: Partial<QuickLinkItem>) {
    setConfig((prev) => ({
      ...prev,
      quick_links: prev.quick_links.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  }

  function removeQuickLink(id: string) {
    setConfig((prev) => ({
      ...prev,
      quick_links: prev.quick_links.filter((item) => item.id !== id),
    }));
  }

  function resetToDefaults() {
    if (confirm('Are you sure you want to restore default Prestige 404 page content?')) {
      setConfig(DEFAULT_CONFIG);
    }
  }

  if (loading) {
    return (
      <Card className="p-12 border border-border/80 bg-card rounded-2xl flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Loading Error Page configuration...</span>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* ─── TOP HEADER BAR ─── */}
      <Card className="p-6 border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileQuestion className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  404 Error Page Manager
                </h1>
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10">
                  Live Customizable
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize titles, explanations, CTA buttons, quick-jump shortcuts, and customer support links on your 404 page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
            <Link
              href="/test-404-preview-url"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-input bg-background hover:bg-muted text-foreground transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview in New Tab</span>
            </Link>

            <Button
              onClick={saveConfig}
              disabled={saving}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>404 Error page updated and saved successfully!</span>
          </div>
        )}
      </Card>

      {/* ─── NAVIGATION TABS ─── */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'content'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sliders className="h-4 w-4" /> Main Content &amp; Buttons
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'links'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Grid className="h-4 w-4" /> Quick Link Shortcut Cards ({config.quick_links.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'support'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Phone className="h-4 w-4" /> Helpline &amp; WhatsApp Strip
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
            activeTab === 'preview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="h-4 w-4" /> Live Page Preview
        </button>
      </div>

      {/* ─── TAB 1: CONTENT & BUTTONS ─── */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card className="p-6 border border-border/80 bg-card rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Header &amp; Error Code</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Error Code Display</Label>
                <Input
                  value={config.error_code}
                  onChange={(e) => setConfig({ ...config, error_code: e.target.value })}
                  placeholder="404"
                  className="font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold">Badge Pill Text</Label>
                <Input
                  value={config.badge_text}
                  onChange={(e) => setConfig({ ...config, badge_text: e.target.value })}
                  placeholder="Page Not Found • 404"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-semibold">Main Error Heading</Label>
              <Input
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                placeholder="The Luxury Residence You Are Looking For Seems Relocated"
                className="font-semibold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description / Subtitle</Label>
              <textarea
                rows={3}
                value={config.subheading}
                onChange={(e) => setConfig({ ...config, subheading: e.target.value })}
                placeholder="The page or layout you requested does not exist..."
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </Card>

          <Card className="p-6 border border-border/80 bg-card rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground">Call-to-Action Buttons</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Button Text</Label>
                <Input
                  value={config.primary_btn_text}
                  onChange={(e) => setConfig({ ...config, primary_btn_text: e.target.value })}
                  placeholder="Return to Homepage"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Button URL Destination</Label>
                <Input
                  value={config.primary_btn_url}
                  onChange={(e) => setConfig({ ...config, primary_btn_url: e.target.value })}
                  placeholder="/"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <div>
                <Label htmlFor="sec-btn-switch" className="text-xs font-semibold cursor-pointer block">
                  Show Secondary &quot;Go Back&quot; Button
                </Label>
                <span className="text-[11px] text-muted-foreground block">
                  Allows visitors to navigate directly back to their previous browser page.
                </span>
              </div>
              <Switch
                id="sec-btn-switch"
                checked={config.show_secondary_btn}
                onCheckedChange={(checked) => setConfig({ ...config, show_secondary_btn: checked })}
              />
            </div>

            {config.show_secondary_btn && (
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold">Secondary Button Label</Label>
                <Input
                  value={config.secondary_btn_text}
                  onChange={(e) => setConfig({ ...config, secondary_btn_text: e.target.value })}
                  placeholder="Go Back"
                />
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ─── TAB 2: QUICK LINK SHORTCUT CARDS ─── */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              These cards are displayed in a clean grid at the bottom of the 404 page to guide lost visitors back to key township sections.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQuickLink}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Card
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.quick_links.map((item, index) => (
              <Card key={item.id} className="p-5 border border-border/80 bg-card rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.enabled !== false}
                      onCheckedChange={(checked) => updateQuickLink(item.id, { enabled: checked })}
                    />
                    <button
                      type="button"
                      onClick={() => removeQuickLink(item.id)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Card Title</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateQuickLink(item.id, { label: e.target.value })}
                      placeholder="e.g. Master Plan"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Destination URL</Label>
                    <Input
                      value={item.url}
                      onChange={(e) => updateQuickLink(item.id, { url: e.target.value })}
                      placeholder="e.g. /#overview"
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Short Description</Label>
                  <Input
                    value={item.desc}
                    onChange={(e) => updateQuickLink(item.id, { desc: e.target.value })}
                    placeholder="e.g. Master layout & 30+ acre luxury township"
                    className="text-xs h-9"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: HELPLINE & WHATSAPP ─── */}
      {activeTab === 'support' && (
        <Card className="p-6 border border-border/80 bg-card rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-foreground">Immediate Assistance Strip</h3>
              <p className="text-xs text-muted-foreground">
                Give users quick direct communication channels in the footer of the 404 page.
              </p>
            </div>
            <Switch
              checked={config.show_support_strip}
              onCheckedChange={(checked) => setConfig({ ...config, show_support_strip: checked })}
            />
          </div>

          {config.show_support_strip && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Call Desk Phone Number</Label>
                  <Input
                    value={config.support_phone}
                    onChange={(e) => setConfig({ ...config, support_phone: e.target.value })}
                    placeholder="+91 90222 22448"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">WhatsApp Receiving Number</Label>
                  <Input
                    value={config.whatsapp_number}
                    onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value.replace(/\D/g, '') })}
                    placeholder="919022222448"
                    className="font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Country code + 10 digits without + sign.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">WhatsApp Prefilled Message</Label>
                <Input
                  value={config.whatsapp_text}
                  onChange={(e) => setConfig({ ...config, whatsapp_text: e.target.value })}
                  placeholder="Hi Prestige Thane Desk, I need assistance finding project details."
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ─── TAB 4: LIVE PREVIEW ─── */}
      {activeTab === 'preview' && (
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-b from-[#060D17] via-[#0A1628] to-[#040810] text-slate-100 p-6 sm:p-10 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{config.badge_text}</span>
            </div>

            <div className="text-7xl sm:text-8xl font-serif font-black tracking-tight leading-none bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 bg-clip-text text-transparent">
              {config.error_code}
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
              {config.heading}
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              {config.subheading}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold text-xs shadow-md">
                <Home className="w-4 h-4" />
                <span>{config.primary_btn_text}</span>
              </div>

              {config.show_secondary_btn && (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-semibold text-xs">
                  <ArrowLeft className="w-4 h-4" />
                  <span>{config.secondary_btn_text}</span>
                </div>
              )}
            </div>

            {config.quick_links.filter((l) => l.enabled !== false).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-left border-t border-white/10 mt-6">
                {config.quick_links
                  .filter((l) => l.enabled !== false)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between"
                    >
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{item.desc}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── RESET BUTTON BAR ─── */}
      <div className="flex items-center justify-between pt-4 border-t border-border/80">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToDefaults}
          className="text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset to Defaults</span>
        </Button>

        <Button
          onClick={saveConfig}
          disabled={saving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>
    </div>
  );
}
