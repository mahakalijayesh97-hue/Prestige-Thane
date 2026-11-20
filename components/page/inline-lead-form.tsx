'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Send, MessageCircle, CalendarCheck, ShieldCheck, Loader2 } from 'lucide-react';

interface FormFieldDef {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: string[] | string;
  sort_order?: number;
}

interface FormDefinition {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  button_1_text?: string;
  button_2_text?: string;
  whatsapp_number?: string;
  partner_name?: string;
  disclaimer?: string;
  fields?: FormFieldDef[];
}

export interface InlineLeadFormProps {
  formSlug?: string;
  formId?: string;
  formTitle?: string;
  className?: string;
}

export function InlineLeadForm({
  formSlug,
  formId,
  formTitle,
  className = '',
}: InlineLeadFormProps) {
  const [form, setForm] = useState<FormDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form field values
  const [values, setValues] = useState<Record<string, string>>({
    name: '',
    phone: '',
    email: '',
    configuration: '2 BHK',
    notes: '',
  });

  const targetIdentifier = formSlug || formId || 'early-access-modal';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${encodeURIComponent(targetIdentifier)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.form) {
            setForm(data.form);

            // Initialize field values
            const initialVals: Record<string, string> = {
              name: '',
              phone: '',
              email: '',
              configuration: '2 BHK',
              notes: '',
            };

            if (Array.isArray(data.form.fields)) {
              data.form.fields.forEach((f: FormFieldDef) => {
                if (f.type === 'pills' && f.options) {
                  const opts = Array.isArray(f.options)
                    ? f.options
                    : f.options.split(',').map((o) => o.trim());
                  if (opts.length > 0) initialVals[f.name || 'configuration'] = opts[0];
                }
              });
            }
            setValues((prev) => ({ ...initialVals, ...prev }));
            return;
          }
        }

        // Fallback default if not found
        if (isMounted) {
          setForm({
            title: formTitle || 'Pre-Launch Enquiry',
            slug: formSlug || 'inquiry',
            description: 'Register for priority allotment, pricing sheets, and official project updates.',
            button_1_text: 'Option 1 • Instant Details via WhatsApp',
            button_2_text: 'Option 2 • Schedule Free Site Visit',
            whatsapp_number: '919022222448',
            partner_name: 'First Team',
            disclaimer: '🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only',
            fields: [
              { id: 'f_name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
              { id: 'f_phone', name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile number', required: true },
              { id: 'f_email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@example.com', required: false },
              {
                id: 'f_config',
                name: 'configuration',
                label: 'Preferred Configuration',
                type: 'pills',
                options: ['2 BHK', '3 BHK', '4 BHK', 'All Units'],
                required: false,
              },
            ],
          });
        }
      } catch {
        if (isMounted) {
          setForm({
            title: formTitle || 'Lead Enquiry',
            slug: formSlug || 'inquiry',
            description: 'Direct inquiries desk.',
            button_1_text: 'Submit Enquiry',
            fields: [],
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchForm();

    return () => {
      isMounted = false;
    };
  }, [targetIdentifier, formTitle, formSlug, formId]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (actionType: 'whatsapp' | 'site_visit' | 'submit') => {
    setErrorMessage('');

    const phoneClean = (values.phone || '').replace(/[^0-9]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailValue = (values.email || '').trim() || `${phoneClean}@lead.prestige.com`;
    const nameValue = (values.name || '').trim() || 'Prestige Visitor';
    const configValue = values.configuration || '2 BHK';

    setSubmittingAction(actionType);

    const intentText =
      actionType === 'whatsapp'
        ? 'Instant Details via WhatsApp'
        : actionType === 'site_visit'
        ? 'Schedule Site Visit'
        : 'General Enquiry';

    try {
      const notesContent = Object.entries(values)
        .filter(([k]) => !['name', 'phone', 'email', 'configuration'].includes(k))
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_slug: form?.slug || targetIdentifier,
          name: nameValue,
          phone: phoneClean,
          email: emailValue,
          configuration: configValue,
          intent: intentText,
          source: `Inline Form: ${form?.title || formTitle || targetIdentifier}`,
          notes: notesContent ? `Notes: ${notesContent}` : `Submitted from page form [${form?.slug || targetIdentifier}]`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit form. Please try again.');
      }

      // If WhatsApp action, open WhatsApp
      if (actionType === 'whatsapp') {
        const waNumber = form?.whatsapp_number || '919022222448';
        const msg = encodeURIComponent(
          `Hi Prestige Advisory Desk, I would like to get complete details (brochure, floor plans, and pricing) for ${configValue} at Prestige Thane. My phone is ${phoneClean} and email is ${emailValue}.`
        );
        try {
          window.open(`https://api.whatsapp.com/send?phone=${waNumber}&text=${msg}`, '_blank');
        } catch {}
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmittingAction(null);
    }
  };

  if (loading) {
    return (
      <div className={`w-full max-w-3xl mx-auto my-12 p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 flex flex-col items-center justify-center min-h-[260px] ${className}`}>
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading form...</p>
      </div>
    );
  }

  if (!form || form.is_active === false) {
    return null;
  }

  const fieldsList: FormFieldDef[] =
    Array.isArray(form.fields) && form.fields.length > 0
      ? form.fields
      : [
          { id: 'f_name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true },
          { id: 'f_phone', name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile number', required: true },
          { id: 'f_email', name: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@example.com', required: false },
        ];

  const displayTitle = form.title?.trim() || formTitle?.trim() || 'Pre-Launch Priority Enquiry';

  return (
    <section className={`w-full max-w-4xl mx-auto my-12 px-4 sm:px-6 not-prose ${className}`}>
      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden text-slate-800">
        {/* Top luxury gold accent gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2.5 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{form.partner_name ? `${form.partner_name} • Pre-Launch Desk` : 'Pre-Launch Priority Desk'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {displayTitle}
            </h3>

            {form.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                {form.description}
              </p>
            )}
          </div>

          {/* Success Notification */}
          {isSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-emerald-950">
                Inquiry Received Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                Thank you! Our dedicated project advisor has received your request and will contact you directly with official pricing, brochures, and floor plans.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2 text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit('submit');
              }}
              className="space-y-5"
            >
              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fieldsList.map((field) => {
                  const fieldName = field.name || field.id;
                  const isFullWidth =
                    field.type === 'pills' || field.type === 'textarea' || fieldName === 'name';

                  // PILLS TYPE (e.g. 2 BHK, 3 BHK, 4 BHK)
                  if (field.type === 'pills') {
                    const optionsArray = Array.isArray(field.options)
                      ? field.options
                      : typeof field.options === 'string'
                      ? field.options.split(',').map((o) => o.trim())
                      : ['2 BHK', '3 BHK', '4 BHK', 'All Units'];

                    return (
                      <div key={field.id} className="sm:col-span-2 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {field.label} {field.required && <span className="text-amber-600">*</span>}
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {optionsArray.map((opt) => {
                            const isSelected = (values[fieldName] || values.configuration) === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  handleChange(fieldName, opt);
                                  handleChange('configuration', opt);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/50 scale-[1.02]'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-2xs'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // TEXTAREA TYPE
                  if (field.type === 'textarea') {
                    return (
                      <div key={field.id} className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {field.label} {field.required && <span className="text-amber-600">*</span>}
                        </label>
                        <textarea
                          rows={3}
                          value={values[fieldName] || ''}
                          onChange={(e) => handleChange(fieldName, e.target.value)}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition shadow-2xs resize-none"
                        />
                      </div>
                    );
                  }

                  // SELECT TYPE
                  if (field.type === 'select') {
                    const optionsArray = Array.isArray(field.options)
                      ? field.options
                      : typeof field.options === 'string'
                      ? field.options.split(',').map((o) => o.trim())
                      : [];

                    return (
                      <div key={field.id} className={`${isFullWidth ? 'sm:col-span-2' : ''} space-y-1.5`}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {field.label} {field.required && <span className="text-amber-600">*</span>}
                        </label>
                        <select
                          value={values[fieldName] || ''}
                          onChange={(e) => handleChange(fieldName, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition shadow-2xs cursor-pointer"
                        >
                          <option value="">Select option...</option>
                          {optionsArray.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  // PHONE / MOBILE TYPE
                  if (field.type === 'tel' || fieldName === 'phone') {
                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {field.label} <span className="text-amber-600">*</span>
                        </label>
                        <div className="relative flex rounded-xl border border-slate-300 overflow-hidden bg-white hover:border-slate-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 transition shadow-2xs">
                          <span className="inline-flex items-center px-3.5 bg-slate-100 text-xs font-bold text-slate-700 border-r border-slate-300 select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={values[fieldName] || values.phone || ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              handleChange(fieldName, val);
                              handleChange('phone', val);
                            }}
                            placeholder={field.placeholder || 'Enter 10-digit mobile number'}
                            required
                            className="w-full px-4 py-3 bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  }

                  // DEFAULT TEXT / EMAIL INPUTS
                  return (
                    <div key={field.id} className={`${isFullWidth ? 'sm:col-span-2' : ''} space-y-1.5`}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        {field.label} {field.required && <span className="text-amber-600">*</span>}
                      </label>
                      <input
                        type={field.type === 'email' ? 'email' : 'text'}
                        value={values[fieldName] || ''}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                        required={field.required}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 transition shadow-2xs"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                {/* Button 1 (Primary / WhatsApp / Details) */}
                <button
                  type="button"
                  disabled={!!submittingAction}
                  onClick={() => handleSubmit(form.whatsapp_number ? 'whatsapp' : 'submit')}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {submittingAction === 'whatsapp' || submittingAction === 'submit' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : form.whatsapp_number ? (
                    <MessageCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                  <span>{form.button_1_text || 'Option 1 • Instant Details via WhatsApp'}</span>
                </button>

                {/* Button 2 (Guided Tour / Site Visit - if defined) */}
                {form.button_2_text && (
                  <button
                    type="button"
                    disabled={!!submittingAction}
                    onClick={() => handleSubmit('site_visit')}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#0A192F] hover:bg-[#112240] text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                  >
                    {submittingAction === 'site_visit' ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <CalendarCheck className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{form.button_2_text}</span>
                  </button>
                )}
              </div>

              {/* Disclaimer */}
              <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{form.disclaimer || '100% Privacy Protected • Zero spam • Official pre-launch project updates only'}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default InlineLeadForm;
