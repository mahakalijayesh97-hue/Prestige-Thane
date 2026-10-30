'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Sparkles, MessageCircle, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { PrestigeLogo } from './prestige-logo';

export interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  modalTitle?: string;
  onLeadSuccess?: (name: string) => void;
}

interface FormFieldDef {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
  };
  sort_order?: number;
}

interface FormDefinition {
  title: string;
  slug: string;
  description: string;
  button_1_text: string;
  button_2_text: string;
  whatsapp_number: string;
  partner_name: string;
  disclaimer: string;
  fields: FormFieldDef[];
}

const DEFAULT_FORM_DEFINITION: FormDefinition = {
  title: 'PRE-LAUNCH ENQUIRY',
  slug: 'early-access-modal',
  description: 'Official pre-launch updates, floor plans, and pricing will be shared directly.',
  button_1_text: 'Option 1 • Instant Details',
  button_2_text: 'Option 2 • Guided Tour',
  whatsapp_number: '919022222448',
  partner_name: 'First Team',
  disclaimer: '🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only',
  fields: [
    {
      id: 'field_phone',
      name: 'phone',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: 'Enter 10-digit mobile number',
      required: true,
      options: [],
      validation: {
        pattern: '^[0-9]{10}$',
        errorMessage: 'Please enter a valid 10-digit mobile number.',
      },
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
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        errorMessage: 'Please enter a valid email address.',
      },
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
      validation: {
        errorMessage: 'Please select a configuration.',
      },
      sort_order: 2,
    },
  ],
};

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({
  isOpen,
  onClose,
  source = 'Hero CTA',
  modalTitle = 'Register for Early Access',
  onLeadSuccess,
}) => {
  const [formDef, setFormDef] = useState<FormDefinition>(DEFAULT_FORM_DEFINITION);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({
    phone: '',
    email: '',
    configuration: '2 BHK',
  });
  const [submittingAction, setSubmittingAction] = useState<'whatsapp' | 'visit' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Load dynamic form definition from API
  useEffect(() => {
    async function fetchFormConfig() {
      try {
        const res = await fetch('/api/forms/early-access-modal', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.form) {
            setFormDef(json.form);
            // Initialize default values for pills or select fields
            const initialVals: Record<string, string> = { ...fieldValues };
            json.form.fields?.forEach((f: FormFieldDef) => {
              if ((f.type === 'pills' || f.type === 'select') && f.options && f.options.length > 0) {
                if (!initialVals[f.name]) {
                  initialVals[f.name] = f.options[0];
                }
              }
            });
            setFieldValues((prev) => ({ ...initialVals, ...prev }));
          }
        }
      } catch (err) {
        console.warn('Using default form definition:', err);
      }
    }

    fetchFormConfig();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setErrorMsg('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = async (action: 'whatsapp' | 'visit') => {
    setErrorMsg('');

    // Dynamic Field Validations based on Admin Form Settings
    for (const field of formDef.fields) {
      const val = (fieldValues[field.name] || '').trim();

      // Required Check
      if (field.required && !val) {
        setErrorMsg(field.validation?.errorMessage || `Please provide your ${field.label}.`);
        return;
      }

      // Telephone (Mobile) validation
      if (field.type === 'tel' && val) {
        const cleanPhone = val.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          setErrorMsg(field.validation?.errorMessage || 'Please enter a valid 10-digit mobile number.');
          return;
        }
      }

      // Email validation
      if (field.type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          setErrorMsg(field.validation?.errorMessage || 'Please enter a valid email address.');
          return;
        }
      }

      // Custom Regex Pattern validation
      if (field.validation?.pattern && val) {
        try {
          const regex = new RegExp(field.validation.pattern);
          if (!regex.test(val)) {
            setErrorMsg(field.validation.errorMessage || `Please enter a valid ${field.label}.`);
            return;
          }
        } catch {}
      }
    }

    setSubmittingAction(action);

    const phone = (fieldValues.phone || '').replace(/\D/g, '');
    const email = (fieldValues.email || '').trim();
    const config = fieldValues.configuration || '2 BHK';
    const rawName = (fieldValues.name || fieldValues.full_name || '').trim();
    const defaultName =
      rawName ||
      (email
        ? email
            .split('@')[0]
            .replace(/[._-]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Homebuyer');

    // Format notes with all custom dynamic field values
    const dynamicNotes = Object.entries(fieldValues)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: defaultName,
          phone: phone,
          email: email,
          configuration: config,
          intent: action === 'whatsapp' ? 'WhatsApp Inquiry' : 'Schedule Site Visit',
          source: `Modal (${modalTitle || source}) - ${action === 'whatsapp' ? 'WhatsApp' : 'Site Visit'}`,
          notes: `Action: ${action === 'whatsapp' ? 'Option 1: Get Info via WhatsApp' : 'Option 2: Schedule Site Visit'} | Config: ${config} | ${dynamicNotes}`,
        }),
      });
    } catch (e) {
      console.warn('Lead capture notification error:', e);
    }

    if (action === 'whatsapp') {
      const waNumber = formDef.whatsapp_number || '919022222448';
      const textEncoded = encodeURIComponent(
        `Hi Prestige Sales Desk, I would like to get complete project info (brochure, floor plans, and pricing) on WhatsApp for ${config} at Prestige Thane. My email is ${email}.`
      );
      const targetUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${textEncoded}`;
      try {
        window.open(targetUrl, '_blank');
      } catch {}
    }

    setSubmittingAction(null);
    setIsSuccess(true);
    if (onLeadSuccess) onLeadSuccess(defaultName);

    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setFieldValues({
        phone: '',
        email: '',
        configuration: formDef.fields.find((f) => f.type === 'pills')?.options?.[0] || '2 BHK',
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <PrestigeLogo />
            </div>
            <div className="border-l border-slate-700 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  {formDef.title}
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold mt-0.5 text-white">{modalTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice inside modal */}
        {formDef.description && (
          <div className="bg-amber-50/80 px-6 py-2 border-b border-amber-200/80 text-[11px] text-amber-950 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{formDef.description}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Inquiry Received Successfully!</h4>
            <p className="text-xs text-slate-600">
              Thank you! Our Prestige sales representative will reach out to you shortly.
            </p>
          </div>
        ) : (
          /* Scrollable Form Body with Dynamically Configured Fields */
          <form onSubmit={(e) => e.preventDefault()} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Render Dynamic Fields Configured in /admin/forms */}
            {formDef.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {field.label} {field.required && <span className="text-amber-600">*</span>}
                </label>

                {/* Telephone (+91 prefix) */}
                {field.type === 'tel' ? (
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/30 focus-within:border-amber-600 bg-white">
                    <span className="inline-flex items-center px-3 bg-slate-50 text-xs font-bold text-slate-700 border-r border-slate-300 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      id={`modal-${field.name}`}
                      name={field.name}
                      required={field.required}
                      maxLength={10}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={field.placeholder || 'Enter 10-digit mobile number'}
                      value={fieldValues[field.name] || ''}
                      onChange={(e) =>
                        setFieldValues({ ...fieldValues, [field.name]: e.target.value })
                      }
                      className="w-full px-3 py-3 text-sm focus:outline-none font-medium text-slate-900"
                    />
                  </div>
                ) : field.type === 'pills' ? (
                  /* Option Pills */
                  <div className="grid grid-cols-4 gap-1.5">
                    {(field.options && field.options.length > 0
                      ? field.options
                      : ['2 BHK', '3 BHK', '4 BHK', 'All Units']
                    ).map((cfg) => (
                      <button
                        key={cfg}
                        type="button"
                        onClick={() => setFieldValues({ ...fieldValues, [field.name]: cfg })}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center border cursor-pointer select-none ${
                          fieldValues[field.name] === cfg
                            ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500/30 shadow-2xs font-extrabold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {cfg}
                      </button>
                    ))}
                  </div>
                ) : field.type === 'select' ? (
                  /* Dropdown Select */
                  <select
                    id={`modal-${field.name}`}
                    name={field.name}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.name]: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 font-medium text-slate-900 bg-white"
                  >
                    {(field.options || []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  /* Textarea */
                  <textarea
                    id={`modal-${field.name}`}
                    name={field.name}
                    rows={3}
                    placeholder={field.placeholder || ''}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.name]: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 font-medium text-slate-900"
                  />
                ) : (
                  /* Text / Email */
                  <input
                    type={field.type === 'email' ? 'email' : 'text'}
                    id={`modal-${field.name}`}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder || ''}
                    value={fieldValues[field.name] || ''}
                    onChange={(e) =>
                      setFieldValues({ ...fieldValues, [field.name]: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 font-medium text-slate-900"
                  />
                )}
              </div>
            ))}

            {/* 2 Options Action Buttons Container */}
            <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 shadow-inner flex flex-col sm:flex-row items-stretch gap-2 pt-1">
              {/* Option 1: WhatsApp Button */}
              <button
                type="button"
                onClick={() => handleAction('whatsapp')}
                disabled={submittingAction !== null}
                className="flex-1 py-3 px-3 rounded-xl bg-white hover:bg-emerald-50 active:scale-[0.98] border-2 border-emerald-500 text-slate-950 font-bold text-xs tracking-tight transition-all shadow-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer select-none disabled:opacity-60"
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-black text-slate-950">
                    {submittingAction === 'whatsapp' ? 'Sending...' : 'Get Info via WhatsApp'}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">{formDef.button_1_text}</span>
              </button>

              {/* Option 2: Schedule Site Visit Button */}
              <button
                type="button"
                onClick={() => handleAction('visit')}
                disabled={submittingAction !== null}
                className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] text-white font-bold text-xs tracking-tight transition-all shadow-md shadow-amber-500/35 flex flex-col items-center justify-center gap-0.5 cursor-pointer select-none disabled:opacity-60"
              >
                <div className="flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-white shrink-0" />
                  <span>{submittingAction === 'visit' ? 'Booking...' : 'Schedule Site Visit'}</span>
                </div>
                <span className="text-[10px] text-amber-100 font-medium">{formDef.button_2_text}</span>
              </button>
            </div>

            {/* Authorized Partner Note */}
            <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Marketed by Authorized Sales Partner: <strong className="text-slate-700">{formDef.partner_name}</strong>
              </span>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-tight">
              {formDef.disclaimer}
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export function EarlyAccessModalContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('Hero CTA');
  const [modalTitle, setModalTitle] = useState('Register for Early Access');

  useEffect(() => {
    const handleOpen = (modalSource?: string, title?: string) => {
      setSource(modalSource || 'Hero CTA');
      setModalTitle(title || 'Register for Early Access');
      setIsOpen(true);
    };

    (window as any).openEarlyAccessModal = handleOpen;
    (window as any).openEarlyModal = handleOpen;

    const handleCustomEvent = (e: CustomEvent) => {
      const detail = e.detail || {};
      handleOpen(detail.source, detail.title);
    };
    window.addEventListener('open-early-access', handleCustomEvent as EventListener);

    const checkHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (['#early-access', '#book-site-visit', '#download-brochure', '#pre-launch-enquiry', '#modal'].includes(hash)) {
        const title =
          hash === '#download-brochure'
            ? 'Download Brochure & Pricing'
            : hash === '#book-site-visit'
            ? 'Book Free Site Visit'
            : hash === '#early-access'
            ? 'Register for Early Access'
            : 'Pre-Launch VIP Enquiry';
        handleOpen('Hash Navigation (' + hash + ')', title);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest(
        'a[href="#early-access"], a[href="#book-site-visit"], a[href="#download-brochure"], a[href="#pre-launch-enquiry"], a[href="#modal"]'
      );
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        const customTitle =
          anchor.getAttribute('data-modal-title') ||
          (href === '#download-brochure'
            ? 'Download Brochure & Pricing'
            : href === '#book-site-visit'
            ? 'Book Free Site Visit'
            : 'Register for Early Access');
        const customSource =
          anchor.getAttribute('data-modal-source') ||
          (href === '#download-brochure'
            ? 'Brochure Link'
            : href === '#book-site-visit'
            ? 'Site Visit Link'
            : 'Early Access Link');
        handleOpen(customSource, customTitle);
        return;
      }

      const visitBtn = target.closest('#hero-book-site-visit-btn, [data-action="book-site-visit"]');
      if (visitBtn) {
        e.preventDefault();
        handleOpen('Hero Book Site Visit Button', 'Book Free Site Visit');
        return;
      }

      const brochureBtn = target.closest('#hero-brochure-btn, [data-action="download-brochure"]');
      if (brochureBtn) {
        e.preventDefault();
        handleOpen('Hero Download Brochure Button', 'Download Brochure & Pricing');
        return;
      }

      const saveLacsBtn = target.closest('#hero-save-lacs-btn, [data-action="save-lacs"]');
      if (saveLacsBtn) {
        e.preventDefault();
        handleOpen('Save Upto 5 Lacs Pill', 'Save Upto ₹5 Lacs* (VIP Pre-Launch Offer)');
        return;
      }

      const genericModalBtn = target.closest('[data-modal="early-access"], .open-early-modal');
      if (genericModalBtn) {
        e.preventDefault();
        const customTitle = genericModalBtn.getAttribute('data-modal-title') || undefined;
        const customSource = genericModalBtn.getAttribute('data-modal-source') || undefined;
        handleOpen(customSource, customTitle);
        return;
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      delete (window as any).openEarlyAccessModal;
      delete (window as any).openEarlyModal;
      window.removeEventListener('open-early-access', handleCustomEvent as EventListener);
      window.removeEventListener('hashchange', checkHash);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <EarlyAccessModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      source={source}
      modalTitle={modalTitle}
    />
  );
}
