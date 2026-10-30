'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

interface FormRow {
  _id: string;
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  fields: Array<{
    id: string;
    name: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  created_at: string;
  updated_at: string;
}

export default function FormsAdminPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    try {
      const res = await fetch('/api/forms', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setForms(json.forms || []);
      }
    } catch (err) {
      console.error('Failed to load forms:', err);
    } finally {
      setLoading(false);
    }
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
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          slug: newSlug.trim().toLowerCase().replace(/\s+/g, '-'),
          fields: [
            {
              id: 'field_phone',
              name: 'phone',
              label: 'Mobile Number',
              type: 'tel',
              placeholder: 'Enter 10-digit mobile number',
              required: true,
              options: [],
              validation: { pattern: '^[0-9]{10}$', errorMessage: 'Please enter a valid 10-digit mobile number.' },
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
          ],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setShowCreateModal(false);
        const createdTitle = newTitle;
        setNewTitle('');
        setNewSlug('');

        await Swal.fire({
          icon: 'success',
          title: 'Form Created!',
          text: `"${createdTitle}" was successfully created. Opening builder...`,
          timer: 1500,
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
        timer: 1800,
      });
    } catch (err) {
      console.error('Error toggling form:', err);
    }
  }

  async function deleteForm(id: string, title: string) {
    const result = await Swal.fire({
      title: 'Delete this form?',
      text: `Are you sure you want to delete "${title}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setForms((prev) => prev.filter((f) => f._id !== id && f.slug !== id));
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `"${title}" has been deleted successfully.`,
        timer: 1600,
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

  function getFieldIcon(type: string, name: string) {
    if (type === 'tel' || name.includes('phone') || name.includes('mobile')) {
      return <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />;
    }
    if (type === 'email' || name.includes('email') || name.includes('mail')) {
      return <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />;
    }
    if (type === 'pills' || type === 'select' || name.includes('config')) {
      return <Settings2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />;
    }
    if (type === 'textarea') {
      return <AlignLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />;
    }
    return <Type className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Breadcrumb Navigation matching screenshot */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/admin" className="hover:text-slate-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-semibold">Forms &amp; Modals</span>
      </div>

      {/* Page Header matching screenshot */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <FormInput className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Forms &amp; Modal Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create and customize lead capture forms, modal enquiry dialogs, dynamic fields, labels, and validation rules.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Form
        </button>
      </div>

      {/* Forms Cards Layout */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <span className="font-medium">Loading form builder configurations...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Configured Form Cards */}
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100/70 flex items-center justify-center text-blue-600 shrink-0">
                      <FormInput className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {form.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400 font-medium">Slug:</span>
                        <code className="text-xs font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-semibold border border-blue-100/60">
                          {form.slug}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Active Status Badge */}
                  <button
                    onClick={() => toggleStatus(form._id, form.is_active)}
                    title={form.is_active ? 'Click to disable' : 'Click to activate'}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 hover:bg-emerald-100/80 transition cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {form.is_active ? 'Active' : 'Disabled'}
                  </button>
                </div>

                {/* Description */}
                {form.description && (
                  <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {form.description}
                  </p>
                )}

                {/* Divider */}
                <div className="border-t border-slate-100 my-5"></div>

                {/* Configured Fields Section */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 mb-3">
                    <span className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-slate-500" /> {form.fields.length} Configured Fields
                    </span>
                  </div>

                  {/* Field Pills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {form.fields.map((f) => (
                      <Link
                        key={f.id}
                        href={`/admin/forms/${form._id}`}
                        className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 transition text-xs font-medium text-slate-700 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {getFieldIcon(f.type, f.name)}
                          <span className="truncate">{f.label}</span>
                          {f.required && <span className="text-amber-500 font-bold">*</span>}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/admin/forms/${form._id}`}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Fields &amp; Validation
                </Link>

                {form.slug !== 'early-access-modal' && (
                  <button
                    onClick={() => deleteForm(form._id, form.title)}
                    title="Delete Form"
                    className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Right Column "Build your next form" Card matching screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            {/* Form Vector Illustration */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Soft decorative background glow */}
              <div className="absolute w-48 h-48 bg-blue-50/80 rounded-full blur-xl pointer-events-none -z-0"></div>

              {/* Form Window Card Mockup */}
              <div className="relative z-10 w-48 bg-white border border-blue-200/80 rounded-2xl p-4 shadow-md">
                {/* Browser dots */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                </div>
                {/* Skeleton title */}
                <div className="w-20 h-2 bg-slate-300/80 rounded-full mb-3"></div>
                {/* Input line 1 */}
                <div className="w-full h-4 rounded-md border border-blue-200/70 bg-blue-50/30 mb-2"></div>
                {/* Input line 2 */}
                <div className="w-full h-4 rounded-md border border-blue-200/70 bg-blue-50/30 mb-3"></div>
                {/* Primary Button line */}
                <div className="w-full h-4 rounded-md bg-blue-600/90"></div>

                {/* Floating Plus Action Badge */}
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>

              {/* Subtle decorative sparkle dashes */}
              <div className="absolute -left-6 top-1/2 w-2.5 h-0.5 bg-blue-300 rounded-full transform -rotate-12"></div>
              <div className="absolute -left-4 bottom-6 w-2 h-0.5 bg-blue-300 rounded-full transform rotate-45"></div>
              <div className="absolute -right-4 top-4 w-2.5 h-0.5 bg-blue-300 rounded-full transform rotate-45"></div>
            </div>

            {/* Title & Copy */}
            <h2 className="text-xl font-bold text-slate-900 mt-4">
              Build your next form
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
              Create custom lead capture forms and modal enquiry dialogs to engage your audience and grow your business.
            </p>

            {/* Bottom Features Line */}
            <div className="mt-8 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Easy to build</span>
              <span className="text-slate-300">•</span>
              <span>Fully customizable</span>
              <span className="text-slate-300">•</span>
              <span>Works everywhere</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create New Form / Modal</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter a name and unique slug for this form configuration.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Form Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Schedule Site Visit Form"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug || newSlug === newTitle.toLowerCase().replace(/\s+/g, '-')) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Form Slug <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. schedule-site-visit"
                  value={newSlug}
                  onChange={(e) =>
                    setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={creating || !newTitle.trim() || !newSlug.trim()}
                  onClick={createForm}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create &amp; Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

