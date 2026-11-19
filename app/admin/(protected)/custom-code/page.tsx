'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code2,
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  Globe,
  Loader2,
  Trash2,
  FileCode,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

interface PresetLibrary {
  id: string;
  name: string;
  icon: string;
  badgeClass: string;
  category: 'cdn' | 'css' | 'js';
  snippet: string;
  description: string;
}

const PRESET_LIBRARIES: PresetLibrary[] = [
  {
    id: 'bootstrap',
    name: 'Bootstrap 5',
    icon: '📦',
    badgeClass: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 font-semibold',
    category: 'cdn',
    snippet: `<!-- Bootstrap 5 CDN -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`,
    description: 'Bootstrap CSS framework and JS bundle (components, modals, grid).',
  },
  {
    id: 'jquery',
    name: 'jQuery',
    icon: '🎵',
    badgeClass: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-300 font-semibold',
    category: 'cdn',
    snippet: `<!-- jQuery 3.7.1 CDN -->\n<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>`,
    description: 'Fast, small, and feature-rich JavaScript library.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CDN',
    icon: '🌊',
    badgeClass: 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-300 font-semibold',
    category: 'cdn',
    snippet: `<!-- Tailwind CSS CDN Play -->\n<script src="https://cdn.tailwindcss.com"></script>`,
    description: 'Utility-first CSS framework for rapid UI styling.',
  },
  {
    id: 'fontawesome',
    name: 'Font Awesome',
    icon: '🎨',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 font-semibold',
    category: 'cdn',
    snippet: `<!-- Font Awesome 6.5.1 CDN -->\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />`,
    description: 'Vector icons and social logos.',
  },
  {
    id: 'google-fonts',
    name: 'Google Fonts',
    icon: '🔤',
    badgeClass: 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 font-semibold',
    category: 'cdn',
    snippet: `<!-- Google Fonts (Inter & Poppins) -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">`,
    description: 'High-quality web typography.',
  },
  {
    id: 'css-preset',
    name: 'Global CSS',
    icon: '🌿',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 font-semibold',
    category: 'css',
    snippet: `/* Global Custom Styles */\n:root {\n  --brand-primary: #2563eb;\n}\n\nbody {\n  font-family: 'Inter', sans-serif;\n}`,
    description: 'CSS rules applied across all pages.',
  },
  {
    id: 'js-preset',
    name: 'Global JavaScript',
    icon: '⚡',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 font-semibold',
    category: 'js',
    snippet: `// Global Custom Scripts\nconsole.log('Prestige site loaded successfully');`,
    description: 'JavaScript executed sitewide on page load.',
  },
];

export default function AdminCustomCodePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'cdn' | 'css' | 'js'>('cdn');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Core code states
  const [headerScripts, setHeaderScripts] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');

  // Initial copy to detect unsaved changes
  const [initialData, setInitialData] = useState({
    headerScripts: '',
    customCss: '',
    customJs: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/theme', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const scripts = data.header_scripts || '';
        const css = data.custom_css || '';
        const js = data.custom_js || '';

        setHeaderScripts(scripts);
        setCustomCss(css);
        setCustomJs(js);

        setInitialData({
          headerScripts: scripts,
          customCss: css,
          customJs: js,
        });
      }
    } catch (err) {
      console.error('Failed to load theme settings:', err);
    } finally {
      setLoading(false);
    }
  }

  const hasUnsavedChanges =
    headerScripts !== initialData.headerScripts ||
    customCss !== initialData.customCss ||
    customJs !== initialData.customJs;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const addPresetSnippet = (preset: PresetLibrary) => {
    if (preset.category === 'css') {
      setActiveTab('css');
      if (!customCss.includes(preset.snippet.trim())) {
        setCustomCss((prev) => (prev ? `${prev.trim()}\n\n${preset.snippet}` : preset.snippet));
      }
      return;
    }

    if (preset.category === 'js') {
      setActiveTab('js');
      if (!customJs.includes(preset.snippet.trim())) {
        setCustomJs((prev) => (prev ? `${prev.trim()}\n\n${preset.snippet}` : preset.snippet));
      }
      return;
    }

    // Default: CDN library added to headerScripts
    setActiveTab('cdn');
    if (!headerScripts.includes(preset.snippet.trim())) {
      setHeaderScripts((prev) => (prev ? `${prev.trim()}\n\n${preset.snippet}` : preset.snippet));

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Added ${preset.name} CDN`,
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `${preset.name} is already added`,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Intelligently check if user entered <link> or <script> inside customCss
      let cleanedCss = customCss;
      let extraScripts = '';

      const tagsInCss = customCss.match(/<(?:link|script)[^>]*>[\s\S]*?(?:<\/(?:link|script)>|\/?>)/gi);
      if (tagsInCss && tagsInCss.length > 0) {
        extraScripts = tagsInCss.join('\n');
        cleanedCss = customCss
          .replace(/<link[^>]*\/?>/gi, '')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<!--[\s\S]*?-->/gi, '')
          .trim();
      }

      const finalHeaderScripts = extraScripts
        ? `${headerScripts.trim()}\n\n${extraScripts}`
        : headerScripts;

      const res = await fetch('/api/settings/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          header_scripts: finalHeaderScripts,
          custom_css: cleanedCss,
          custom_js: customJs,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      setHeaderScripts(finalHeaderScripts);
      setCustomCss(cleanedCss);
      setInitialData({
        headerScripts: finalHeaderScripts,
        customCss: cleanedCss,
        customJs,
      });

      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Custom Code & CDN Applied Sitewide!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error('Error saving custom code:', err);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.message || 'Could not update custom code. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setHeaderScripts(initialData.headerScripts);
    setCustomCss(initialData.customCss);
    setCustomJs(initialData.customJs);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading custom code settings...</p>
      </div>
    );
  }

  const currentContent =
    activeTab === 'cdn' ? headerScripts : activeTab === 'css' ? customCss : customJs;

  const setCurrentContent = (val: string) => {
    if (activeTab === 'cdn') setHeaderScripts(val);
    else if (activeTab === 'css') setCustomCss(val);
    else setCustomJs(val);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Custom Code &amp; CDN
            </h1>
            <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200">
              ● Applied Sitewide
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add CDN stylesheets, tracking scripts, and global CSS/JS applied across the entire website.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={saving}
              className="text-xs h-9 gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save &amp; Apply to Website</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="text-xs h-9 gap-1.5" title="View live site">
            <Link href="/" target="_blank">
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Unified Box matching reference image */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 flex items-center justify-center font-bold shrink-0">
            <Code2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Global Custom CSS &amp; JavaScript
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Add your custom CSS styles, Google Analytics (GA4), Meta Pixel, chat widgets, or tracking scripts applied across the website.
            </p>
          </div>
        </div>

        {/* CDN Libraries Preset Row (matching reference screenshot pill style!) */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-slate-500 font-semibold select-none">
            CDN Libraries:
          </span>
          {PRESET_LIBRARIES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => addPresetSnippet(preset)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${preset.badgeClass}`}
              title={preset.description}
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Tab selection & Code Editor Area */}
        <div className="space-y-2 pt-2">
          {/* Sub-Tabs */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('cdn')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'cdn'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>CDN &amp; Header Scripts</span>
                {headerScripts.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'css'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Global Custom CSS</span>
                {customCss.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'js'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Global Custom JS</span>
                {customJs.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                )}
              </button>
            </div>

            {/* Actions: Copy & Length */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">
                {currentContent.length} chars
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(currentContent, activeTab)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-background hover:bg-muted text-[11px] font-medium text-slate-600 dark:text-slate-300 transition cursor-pointer"
                title="Copy code"
              >
                {copiedKey === activeTab ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === activeTab ? 'Copied' : 'Copy'}</span>
              </button>
              {currentContent.trim() && (
                <button
                  type="button"
                  onClick={() => setCurrentContent('')}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Clear code"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Monospace Code Editor Box (clean white theme matching reference image) */}
          <div className="relative rounded-xl border border-slate-200 bg-white p-3.5 font-mono text-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-2xs transition-all">
            <textarea
              rows={9}
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder={
                activeTab === 'cdn'
                  ? '<!-- Add your CDN links, stylesheets, Google Analytics, or scripts here -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />\n<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>'
                  : activeTab === 'css'
                  ? '/* Global Custom Styles applied sitewide */\n:root {\n  --brand-primary: #2563eb;\n}\n\nbody {\n  font-family: "Inter", sans-serif;\n}'
                  : '// Global Custom JavaScript executed across all pages\nconsole.log("Prestige site loaded");'
              }
              className="w-full bg-white border-0 text-slate-900 placeholder:text-slate-400 focus:outline-none resize-y font-mono text-xs leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Contextual Notice */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>
                {activeTab === 'cdn'
                  ? 'Injected directly into <head> sitewide: parses <link>, <script>, <meta>, and analytics tags.'
                  : activeTab === 'css'
                  ? 'Injected into critical site stylesheet: served in first byte to eliminate layout shifts (CLS).'
                  : 'Executed safely on page initialization across all pages.'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Save & Status Row */}
        <div className="pt-3 border-t border-border/80 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs">
            {hasUnsavedChanges ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes pending
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" />
                All code saved and active on website
              </span>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save &amp; Apply Sitewide</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
