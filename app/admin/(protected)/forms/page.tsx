'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormInput,
  Plus,
  Loader2,
  Trash2,
  Pencil,
  Sliders,
  Phone,
  Mail,
  Settings2,
  ChevronRight,
  Sparkles,
  Home,
  Type,
  AlignLeft,
  X,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Layers,
  Search,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Download,
  Calendar,
  ArrowRight,
  Send,
  MessageSquare,
} from 'lucide-react';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface FormRow {
  _id: string;
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  fields: FormField[];
  button_1_text?: string;
  button_2_text?: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
}

const TEMPLATE_PRESETS = [
  {
    title: 'Brochure & Pricing Sheet Download',
    slug: 'brochure-download-modal',
    description: 'Instant digital brochure, official price breakup, and floor layout download.',
    fields: [
      { id: 'f_name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { id: 'f_phone', name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: 'Enter 10-digit mobile number', required: true },
      { id: 'f_email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'name@example.com', required: true },
      { id: 'f_config', name: 'configuration', label: 'Interested Configuration', type: 'pills', placeholder: '', required: false, options: ['2 BHK', '3 BHK', '4 BHK', 'All Details'] },
    ],
  },
  {
    title: 'VIP Site Visit & Free Cab Booking',
    slug: 'schedule-site-visit-modal',
    description: 'Book an exclusive guided site tour with complimentary round-trip cab pickup.',
    fields: [
      { id: 'f_name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
      { id: 'f_phone', name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: 'Enter 10-digit mobile number', required: true },
      { id: 'f_date', name: 'preferred_date', label: 'Preferred Visit Date', type: 'text', placeholder: 'e.g. This Saturday / Sunday', required: true },
      { id: 'f_pickup', name: 'pickup_location', label: 'Pickup City / Area', type: 'text', placeholder: 'e.g. Thane, Mulund, Powai', required: false },
    ],
  },
  {
    title: 'Express 10-Minute VIP Callback',
    slug: 'fast-callback-modal',
    description: 'Connect with a certified Prestige project specialist for confidential pricing details.',
    fields: [
      { id: 'f_name', name: 'name', label: 'Your Name', type: 'text', placeholder: 'Your name', required: true },
      { id: 'f_phone', name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile number', required: true },
      { id: 'f_time', name: 'call_time', label: 'Best Time to Call', type: 'pills', placeholder: '', required: false, options: ['Right Now', 'Morning', 'Evening'] },
    ],
  },
];

let cachedFormsList: FormRow[] | null = null;

export default function FormsAdminPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[]>(() => cachedFormsList || []);
  const [loading, setLoading] = useState(() => !cachedFormsList);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewForm, setPreviewForm] = useState<FormRow | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATE_PRESETS[0] | null>(null);

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    if (!cachedFormsList) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/forms', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const list = json.forms || [];
        cachedFormsList = list;
        setForms(list);
      }
    } catch (err) {
      console.error('Failed to load forms:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  // Filtered list
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && f.is_active) ||
        (filter === 'disabled' && !f.is_active);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [forms, filter, searchQuery]);

  // Aggregate stats
  const totalCount = forms.length;
  const activeCount = forms.filter((f) => f.is_active).length;
  const disabledCount = forms.filter((f) => !f.is_active).length;
  const totalFields = forms.reduce((acc, f) => acc + (f.fields?.length || 0), 0);

  function openCreateWithTemplate(preset?: typeof TEMPLATE_PRESETS[0]) {
    if (preset) {
      setSelectedTemplate(preset);
      setNewTitle(preset.title);
      setNewSlug(preset.slug);
      setNewDescription(preset.description);
    } else {
      setSelectedTemplate(null);
      setNewTitle('');
      setNewSlug('');
      setNewDescription('');
    }
    setShowCreateModal(true);
  }

  async function createForm() {
    if (!newTitle.trim() || !newSlug.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Details',
        text: 'Please provide both a form title and slug.',
      });
      return;
    }
    setCreating(true);

    const defaultFields = selectedTemplate
      ? selectedTemplate.fields
      : [
          {
            id: 'field_phone',
            name: 'phone',
            label: 'Mobile Number',
            type: 'tel',
            placeholder: 'Enter 10-digit mobile number',
            required: true,
            options: [],
            sort_order: 0,
          },
          {
            id: 'field_email',
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'your.email@example.com',
            required: true,
            options: [],
            sort_order: 1,
          },
          {
            id: 'field_config',
            name: 'configuration',
            label: 'Configuration',
            type: 'pills',
            placeholder: '',
            required: true,
            options: ['2 BHK', '3 BHK', '4 BHK', 'All Units'],
            sort_order: 2,
          },
        ];

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: newSlug.trim().toLowerCase().replace(/\s+/g, '-'),
          description: newDescription.trim() || 'Official project enquiry form.',
          fields: defaultFields,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setShowCreateModal(false);
        const createdTitle = newTitle;
        setNewTitle('');
        setNewSlug('');
        setNewDescription('');
        setSelectedTemplate(null);
        cachedFormsList = null;

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('forms-updated'));
        }

        await Swal.fire({
          icon: 'success',
          title: 'Form Created!',
          text: `"${createdTitle}" was successfully created. Opening builder...`,
          timer: 1400,
          showConfirmButton: false,
        });

        router.push(`/admin/forms/${json.form._id || json.form.slug}`);
      } else {
        const errJson = await res.json().catch(() => ({}));
        Swal.fire({
          icon: 'error',
          title: 'Failed to Create Form',
          text: errJson.error || 'A form with this slug may already exist.',
        });
      }
    } catch (err: any) {
      console.error('Error creating form:', err);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: err?.message || 'Could not connect to the server.',
      });
    } finally {
      setCreating(false);
    }
  }

  async function toggleStatus(id: string, current: boolean) {
    try {
      await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      });
      setForms((prev) =>
        prev.map((f) => (f._id === id || f.slug === id ? { ...f, is_active: !current } : f))
      );
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: !current ? 'success' : 'info',
        title: `Form is now ${!current ? 'Active' : 'Disabled'}`,
        showConfirmButton: false,
        timer: 1600,
      });
    } catch (err) {
      console.error('Error toggling form:', err);
    }
  }

  async function deleteForm(id: string, title: string) {
    const result = await Swal.fire({
      title: 'Delete this form?',
      text: `Are you sure you want to delete "${title}"? This cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setForms((prev) => prev.filter((f) => f._id !== id && f.slug !== id));
      cachedFormsList = null;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('forms-updated'));
      }
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `"${title}" has been deleted successfully.`,
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error deleting form:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Failed to delete the form. Please try again.',
      });
    }
  }

  function handleCopyTriggerCode(slug: string) {
    const code = `data-modal="${slug}"`;
    navigator.clipboard.writeText(code);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  function getFieldIcon(type: string, name: string) {
    if (type === 'tel' || name.includes('phone') || name.includes('mobile')) {
      return <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
    }
    if (type === 'email' || name.includes('email') || name.includes('mail')) {
      return <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
    }
    if (type === 'pills' || type === 'select' || name.includes('config')) {
      return <Settings2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
    }
    if (type === 'textarea') {
      return <AlignLeft className="w-3.5 h-3.5 text-purple-500 shrink-0" />;
    }
    return <Type className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ─── BREADCRUMBS & TOP HEADER ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div className="space-y-3">
          {/* Breadcrumb */}
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
            <span className="font-semibold text-foreground">Forms &amp; Modals</span>
          </div>

          {/* Title with Badge & Icon */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500/15 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
              <FormInput className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-normal text-foreground leading-normal sm:leading-snug py-0.5">
                  Forms &amp; Modal Builder
                </h1>
                <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] px-2.5 py-0.5 rounded-md h-fit">
                  {totalCount} Form Configs
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Design lead capture modal popups, customize field labels &amp; validation, route to WhatsApp, and monitor customer inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Right side Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-end">
          <Button
            variant="outline"
            size="sm"
            onClick={loadForms}
            disabled={isRefreshing}
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold shadow-xs hover:border-primary/50"
            title="Refresh forms"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-border/80 gap-1.5 text-xs font-semibold shadow-xs hover:border-primary/50"
          >
            <Link href="/admin/contact">
              <Mail className="h-3.5 w-3.5 text-blue-600" />
              <span>Inquiries Inbox</span>
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => openCreateWithTemplate()}
            className="rounded-xl gap-1.5 text-xs font-bold shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Form</span>
          </Button>
        </div>
      </div>

      {/* ─── QUICK STATS KPI ROW ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Total Forms</span>
            <span className="text-2xl font-bold text-foreground mt-0.5 block">{totalCount}</span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
            <FormInput className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Active Modals</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            </div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Total Form Fields</span>
            <span className="text-2xl font-bold text-foreground mt-0.5 block">{totalFields}</span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <Sliders className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-border/80 bg-card/60 shadow-xs rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">HTML Trigger</span>
            <span className="text-xs font-mono font-bold text-blue-600 block mt-1">data-modal=&quot;...&quot;</span>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
            <Sparkles className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* ─── SEARCH & FILTER BAR ─── */}
      <Card className="p-3 sm:p-4 border-border/80 bg-card shadow-xs rounded-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-muted/60 border border-border/70 rounded-xl shrink-0">
            {(
              [
                { id: 'all', label: 'All Forms', count: totalCount },
                { id: 'active', label: 'Active', count: activeCount },
                { id: 'disabled', label: 'Disabled', count: disabledCount },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === tab.id
                    ? 'bg-background text-foreground shadow-xs border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    filter === tab.id
                      ? 'bg-blue-500/10 text-blue-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search forms by title or slug..."
              className="h-9 pl-8 pr-8 text-xs rounded-xl bg-background border-border/80"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ─── MAIN FORMS GRID ─── */}
      {loading ? (
        <Card className="p-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3 rounded-2xl">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <span className="font-medium">Loading form builder configurations...</span>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {filteredForms.map((form) => {
              const hasMultipleDuplicates = forms.filter((f) => f.slug === form.slug).length > 1;
              const canDelete = forms.length > 1 || form.slug !== 'early-access-modal';

              return (
                <Card
                  key={form._id}
                  className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <FormInput className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground leading-snug line-clamp-1">
                            {form.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[11px] text-muted-foreground font-medium">Slug:</span>
                            <code className="text-[11px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-semibold border border-blue-500/20">
                              {form.slug}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Active Status Badge Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleStatus(form._id, form.is_active)}
                        title={form.is_active ? 'Click to disable' : 'Click to activate'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition cursor-pointer shrink-0 ${
                          form.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-muted text-muted-foreground border-border hover:bg-accent'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${form.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {form.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    {/* Description */}
                    {form.description ? (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {form.description}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/60 italic">
                        No description provided.
                      </p>
                    )}

                    {/* Trigger Code Pill */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/70 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[11px] font-semibold text-muted-foreground shrink-0">Trigger:</span>
                        <code className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate">
                          data-modal=&quot;{form.slug}&quot;
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyTriggerCode(form.slug)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition shrink-0"
                        title="Copy HTML data-modal trigger code"
                      >
                        {copiedSlug === form.slug ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Configured Fields Section */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-blue-500" />
                          <span>{form.fields.length} Configured Fields</span>
                        </span>
                        <span className="text-[11px] text-muted-foreground font-normal">Click to edit</span>
                      </div>

                      {/* Field Tags Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {form.fields.map((f) => (
                          <Link
                            key={f.id}
                            href={`/admin/forms/${form._id}`}
                            className="group/field flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-border/70 bg-background hover:bg-accent hover:border-primary/40 transition text-xs font-medium text-foreground shadow-2xs"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {getFieldIcon(f.type, f.name)}
                              <span className="truncate">{f.label}</span>
                              {f.required && <span className="text-amber-500 font-bold">*</span>}
                            </div>
                            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover/field:text-foreground shrink-0 ml-1 transition-transform group-hover/field:translate-x-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-xs"
                    >
                      <Link href={`/admin/forms/${form._id}`}>
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Fields &amp; Validation</span>
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewForm(form)}
                      className="rounded-xl text-xs font-semibold gap-1 px-2.5"
                      title="Preview this modal"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold gap-1 px-2.5"
                      title="View inquiries submitted from this form"
                    >
                      <Link href={`/admin/contact?form=${encodeURIComponent(form.slug || form.title)}`}>
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Messages</span>
                      </Link>
                    </Button>

                    {(canDelete || hasMultipleDuplicates) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteForm(form._id, form.title)}
                        className="h-9 w-9 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title={hasMultipleDuplicates ? 'Delete Duplicate Form' : 'Delete Form'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}

            {/* Quick Interactive Add Form Card (Maintains grid symmetry) */}
            <Card
              onClick={() => openCreateWithTemplate()}
              className="p-6 rounded-2xl border-2 border-dashed border-border/80 hover:border-blue-500/60 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center text-center cursor-pointer group min-h-[280px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs mb-3">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-bold text-foreground group-hover:text-blue-600 transition-colors">
                Create Another Form
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
                Add a new lead capture modal, brochure download gate, or site visit booking dialog in seconds.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:underline">
                <span>Configure New Modal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </div>

          {/* ─── READY-MADE PRESET TEMPLATES SECTION ─── */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Quick Form Templates &amp; Presets</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  One-click launch real-estate lead capture templates configured with industry-standard fields.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {TEMPLATE_PRESETS.map((preset) => (
                <Card
                  key={preset.slug}
                  onClick={() => openCreateWithTemplate(preset)}
                  className="p-4 rounded-xl border border-border/80 bg-card hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer transition group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded">
                        Preset
                      </span>
                      <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                    <Sliders className="w-3 h-3 text-blue-500" />
                    <span>{preset.fields.length} pre-configured fields</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── CREATE FORM MODAL DIALOG ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <FormInput className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Create New Form / Modal</h3>
                  <p className="text-[11px] text-muted-foreground">Configure form title, identifier slug, and description.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-bold text-foreground mb-1 block">
                  Form Title <span className="text-amber-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Schedule Site Visit & Cab"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug || newSlug === newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="rounded-xl h-10 text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-foreground mb-1 block">
                  Form Identifier Slug <span className="text-amber-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. schedule-site-visit-modal"
                  value={newSlug}
                  onChange={(e) =>
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))
                  }
                  className="rounded-xl h-10 text-xs font-mono"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  HTML trigger will be: <code>data-modal=&quot;{newSlug || 'your-slug'}&quot;</code>
                </span>
              </div>

              <div>
                <Label className="text-xs font-bold text-foreground mb-1 block">
                  Form Description (Optional)
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Official pre-launch enquiry form for verified buyers."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="rounded-xl h-10 text-xs"
                />
              </div>

              {selectedTemplate && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-bold">Template fields to be added:</span>{' '}
                  {selectedTemplate.fields.map((f) => f.label).join(', ')}
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={creating || !newTitle.trim() || !newSlug.trim()}
                  onClick={createForm}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-1.5 shadow-xs"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create &amp; Open Builder</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIVE MODAL PREVIEW DIALOG ─── */}
      {previewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setPreviewForm(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 pt-1">
              <Badge variant="outline" className="text-[10px] font-bold uppercase text-amber-600 border-amber-500/30 bg-amber-500/10">
                Interactive Preview
              </Badge>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                {previewForm.title}
              </h3>
              {previewForm.description && (
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {previewForm.description}
                </p>
              )}
            </div>

            {/* Mock Form Inputs */}
            <div className="space-y-3 pt-2">
              {previewForm.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {field.label} {field.required && <span className="text-amber-500">*</span>}
                  </label>

                  {field.type === 'pills' && Array.isArray(field.options) && field.options.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {field.options.map((opt, oIdx) => (
                        <span
                          key={oIdx}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                            oIdx === 0
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={2}
                      disabled
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
                    />
                  ) : (
                    <input
                      type={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                      disabled
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Mock Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md"
              >
                {previewForm.button_1_text || 'Option 1 • Instant Details'}
              </button>
              <button
                type="button"
                className="w-full py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                {previewForm.button_2_text || 'Option 2 • Guided Tour'}
              </button>
            </div>

            <div className="text-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewForm(null)}
                className="rounded-xl text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
