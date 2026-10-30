'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  FormInput,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  GripVertical,
  ShieldCheck,
  Eye,
  Settings,
  HelpCircle,
  MessageCircle,
  CalendarCheck,
} from 'lucide-react';
import { IFormField } from '@/lib/models/Form';

interface FormDataState {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  is_active: boolean;
  button_1_text: string;
  button_2_text: string;
  whatsapp_number: string;
  partner_name: string;
  disclaimer: string;
  fields: IFormField[];
}

const FIELD_TYPES = [
  { value: 'tel', label: 'Phone / Mobile (+91)', icon: '📞' },
  { value: 'email', label: 'Email Address', icon: '✉️' },
  { value: 'text', label: 'Text Input', icon: '📝' },
  { value: 'pills', label: 'Option Pills (Multi-Choice)', icon: '🔘' },
  { value: 'select', label: 'Dropdown Select', icon: '▾' },
  { value: 'textarea', label: 'Multi-line Textarea', icon: '📄' },
];

export default function FormEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<FormDataState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'fields' | 'settings' | 'preview'>('fields');

  useEffect(() => {
    loadForm();
  }, [params.id]);

  async function loadForm() {
    try {
      const res = await fetch(`/api/forms/${params.id}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setForm(json.form);
      }
    } catch (err) {
      console.error('Error loading form:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveForm() {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form._id || form.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Form configuration and validation rules have been saved.',
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: 'Could not update form settings.',
        });
      }
    } catch (err: any) {
      console.error('Error saving form:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Failed to save form.',
      });
    } finally {
      setSaving(false);
    }
  }

  // Add field
  function addField(type: 'tel' | 'email' | 'text' | 'pills' | 'select' | 'textarea' = 'text') {
    if (!form) return;
    const newId = `field_${Date.now()}`;
    const newField: IFormField = {
      id: newId,
      name: type === 'tel' ? 'phone' : type === 'email' ? 'email' : `field_${form.fields.length + 1}`,
      label: type === 'tel' ? 'Mobile Number' : type === 'email' ? 'Email Address' : type === 'pills' ? 'Configuration' : `Field ${form.fields.length + 1}`,
      type,
      placeholder: type === 'tel' ? 'Enter 10-digit mobile number' : type === 'email' ? 'your.email@example.com' : '',
      required: true,
      options: type === 'pills' ? ['2 BHK', '3 BHK', '4 BHK', 'All Units'] : [],
      validation: {
        pattern: type === 'tel' ? '^[0-9]{10}$' : type === 'email' ? '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' : '',
        errorMessage: type === 'tel' ? 'Please enter a valid 10-digit mobile number.' : type === 'email' ? 'Please enter a valid email address.' : '',
      },
      sort_order: form.fields.length,
    };

    setForm({
      ...form,
      fields: [...form.fields, newField],
    });

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Added "${newField.label}"`,
      timer: 1500,
      showConfirmButton: false,
    });
  }

  // Update field property
  function updateField(index: number, key: keyof IFormField, value: any) {
    if (!form) return;
    const updated = [...form.fields];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, fields: updated });
  }

  // Update field validation property
  function updateValidation(index: number, key: string, value: any) {
    if (!form) return;
    const updated = [...form.fields];
    updated[index] = {
      ...updated[index],
      validation: {
        ...updated[index].validation,
        [key]: value,
      },
    };
    setForm({ ...form, fields: updated });
  }

  // Reorder field
  function moveField(index: number, direction: 'up' | 'down') {
    if (!form) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.fields.length) return;

    const updated = [...form.fields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setForm({ ...form, fields: updated.map((f, i) => ({ ...f, sort_order: i })) });
  }

  // Delete field with SweetAlert
  async function removeField(index: number) {
    if (!form) return;
    const field = form.fields[index];
    const result = await Swal.fire({
      title: 'Remove Field?',
      text: `Are you sure you want to remove "${field?.label || 'this field'}"?`,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'No',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    const updated = form.fields.filter((_, i) => i !== index);
    setForm({ ...form, fields: updated.map((f, i) => ({ ...f, sort_order: i })) });
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Form not found.</p>
        <Link href="/admin/forms" className="mt-4 inline-block text-sm text-primary hover:underline">
          &larr; Back to Forms
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/forms"
            className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">{form.title}</h1>
              <Badge variant={form.is_active ? 'default' : 'secondary'} className="text-[10px]">
                {form.is_active ? 'Active' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Slug: <code className="font-mono bg-muted px-1 py-0.5 rounded text-primary">{form.slug}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" /> Changes Saved!
            </span>
          )}
          <Button onClick={saveForm} disabled={saving} className="gap-1.5 shadow-sm font-semibold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Form
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card rounded-t-xl px-2 pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('fields')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'fields'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FormInput className="h-4 w-4" /> Fields &amp; Validation ({form.fields.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="h-4 w-4" /> Modal Texts &amp; WhatsApp Actions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'preview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="h-4 w-4" /> Live Modal Preview
        </button>
      </div>

      {/* TAB 1: Fields & Validation Builder */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Define the inputs, labels, and validation rules for this form. Fields are rendered on the frontend in the order below.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addField('text')}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Field
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {form.fields.map((field, idx) => (
              <Card key={field.id || idx} className="p-4 border border-border/80 bg-card shadow-xs rounded-xl space-y-3">
                {/* Field Header */}
                <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded bg-muted text-xs font-bold text-foreground">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-foreground">{field.label || 'Untitled Field'}</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {field.type}
                    </Badge>
                    {field.required && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Required *
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveField(idx, 'up')}
                      className="grid h-7 w-7 place-items-center rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.fields.length - 1}
                      onClick={() => moveField(idx, 'down')}
                      className="grid h-7 w-7 place-items-center rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-20"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeField(idx)}
                      className="grid h-7 w-7 place-items-center rounded hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Field Settings Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
                  {/* Field Label */}
                  <div className="sm:col-span-4 space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Field Label (Visible on Site)
                    </Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(idx, 'label', e.target.value)}
                      placeholder="e.g. Mobile Number"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>

                  {/* Field Name (Payload Key) */}
                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Field Key (API Name)
                    </Label>
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(idx, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="e.g. phone"
                      className="h-8 text-xs font-mono"
                    />
                  </div>

                  {/* Field Type */}
                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Input Type
                    </Label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(idx, 'type', e.target.value)}
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Required Switch */}
                  <div className="sm:col-span-2 flex items-center gap-2 pb-1.5">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(idx, 'required', checked)}
                      id={`req-${idx}`}
                    />
                    <Label htmlFor={`req-${idx}`} className="text-xs font-bold cursor-pointer">
                      Required
                    </Label>
                  </div>
                </div>

                {/* Placeholder & Options if applicable */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-6 space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Placeholder Text
                    </Label>
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) => updateField(idx, 'placeholder', e.target.value)}
                      placeholder="e.g. Enter 10-digit mobile number"
                      className="h-8 text-xs"
                    />
                  </div>

                  {(field.type === 'pills' || field.type === 'select') && (
                    <div className="sm:col-span-6 space-y-1">
                      <Label className="text-xs font-semibold text-muted-foreground">
                        Options (Comma separated)
                      </Label>
                      <Input
                        value={(field.options || []).join(', ')}
                        onChange={(e) =>
                          updateField(
                            idx,
                            'options',
                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        placeholder="2 BHK, 3 BHK, 4 BHK, All Units"
                        className="h-8 text-xs font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* Validation Rules Section */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Validation Rules &amp; Error Message
                  </span>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">
                        Validation Regex Pattern (optional)
                      </Label>
                      <Input
                        value={field.validation?.pattern || ''}
                        onChange={(e) => updateValidation(idx, 'pattern', e.target.value)}
                        placeholder="e.g. ^[0-9]{10}$"
                        className="h-7 text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">
                        Custom Validation Error Message
                      </Label>
                      <Input
                        value={field.validation?.errorMessage || ''}
                        onChange={(e) => updateValidation(idx, 'errorMessage', e.target.value)}
                        placeholder="e.g. Please enter a valid 10-digit mobile number."
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => addField('text')}
            className="w-full gap-1.5 py-4 border-dashed"
          >
            <Plus className="h-4 w-4" /> Add Another Field
          </Button>
        </div>
      )}

      {/* TAB 2: Modal Texts & Actions */}
      {activeTab === 'settings' && (
        <Card className="p-5 space-y-4">
          <div className="space-y-1">
            <Label className="text-xs font-bold">Form Heading / Main Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. PRE-LAUNCH ENQUIRY"
              className="text-sm font-semibold"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">Sub-Title / Notice Strip</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Official pre-launch updates, floor plans, and pricing will be shared directly."
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Option 1 Button Subtext (WhatsApp)</Label>
              <Input
                value={form.button_1_text}
                onChange={(e) => setForm({ ...form, button_1_text: e.target.value })}
                placeholder="Option 1 • Instant Details"
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Option 2 Button Subtext (Site Visit)</Label>
              <Input
                value={form.button_2_text}
                onChange={(e) => setForm({ ...form, button_2_text: e.target.value })}
                placeholder="Option 2 • Guided Tour"
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">WhatsApp Receiving Phone Number</Label>
              <Input
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value.replace(/\D/g, '') })}
                placeholder="919022222448"
                className="text-sm font-mono"
              />
              <p className="text-[10px] text-muted-foreground">Country code + 10 digits without + sign.</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Authorized Sales Partner Name</Label>
              <Input
                value={form.partner_name}
                onChange={(e) => setForm({ ...form, partner_name: e.target.value })}
                placeholder="First Team"
                className="text-sm font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-bold">Privacy / Trust Disclaimer</Label>
            <Input
              value={form.disclaimer}
              onChange={(e) => setForm({ ...form, disclaimer: e.target.value })}
              placeholder="🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only"
              className="text-sm"
            />
          </div>
        </Card>
      )}

      {/* TAB 3: Live Preview */}
      {activeTab === 'preview' && (
        <div className="flex justify-center p-4 bg-slate-900/40 rounded-2xl border border-border">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <img
                  src="/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png"
                  alt="Prestige"
                  className="h-8 w-auto object-contain"
                />
                <div className="border-l border-slate-700 pl-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                    {form.title}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white mt-0.5">Live Form Preview</h3>
                </div>
              </div>
            </div>

            {/* Notice Strip */}
            {form.description && (
              <div className="bg-amber-50 px-6 py-2 border-b border-amber-200 text-[11px] text-amber-950 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{form.description}</span>
              </div>
            )}

            {/* Dynamic Form Body */}
            <div className="p-5 sm:p-6 space-y-3.5">
              {form.fields.map((f) => (
                <div key={f.id} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {f.label} {f.required && <span className="text-amber-600">*</span>}
                  </label>

                  {f.type === 'tel' ? (
                    <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white">
                      <span className="inline-flex items-center px-3 bg-slate-50 text-xs font-bold text-slate-600 border-r border-slate-300">
                        +91
                      </span>
                      <input
                        type="tel"
                        disabled
                        placeholder={f.placeholder || 'Enter 10-digit mobile number'}
                        className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white"
                      />
                    </div>
                  ) : f.type === 'pills' ? (
                    <div className="grid grid-cols-4 gap-1.5">
                      {(f.options && f.options.length > 0 ? f.options : ['2 BHK', '3 BHK', '4 BHK', 'All Units']).map(
                        (opt, i) => (
                          <div
                            key={opt}
                            className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center border cursor-pointer ${
                              i === 0
                                ? 'bg-amber-50 border-amber-500 text-amber-950 font-extrabold ring-1 ring-amber-500/30'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {opt}
                          </div>
                        )
                      )}
                    </div>
                  ) : f.type === 'select' ? (
                    <select disabled className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                      {(f.options || []).map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'email' ? 'email' : 'text'}
                      disabled
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                    />
                  )}
                </div>
              ))}

              {/* 2 Options Action Buttons Container */}
              <div className="p-1.5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-stretch gap-2 pt-1 mt-4">
                <div className="flex-1 py-2.5 px-3 rounded-xl bg-white border-2 border-emerald-500 text-slate-950 font-bold text-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Get Info via WhatsApp</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">{form.button_1_text}</span>
                </div>

                <div className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-md shadow-amber-500/30">
                  <div className="flex items-center gap-1.5">
                    <CalendarCheck className="w-4 h-4 text-white shrink-0" />
                    <span>Schedule Site Visit</span>
                  </div>
                  <span className="text-[10px] text-amber-100 font-medium">{form.button_2_text}</span>
                </div>
              </div>

              {/* Partner Note */}
              <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Marketed by Authorized Sales Partner: <strong className="text-slate-700">{form.partner_name}</strong>
                </span>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-500 text-center leading-tight">
                {form.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

