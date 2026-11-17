'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { logActivity } from '@/lib/admin';
import { parsePageContent, buildPageContent } from '@/lib/page-content';
import { PRESTIGE_HERO_TEMPLATE } from '@/lib/templates/hero-template';
import { LEAD_CAPTURE_SECTION_TEMPLATE } from '@/lib/templates/LeadCaptureSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Loader2,
  Save,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe,
  Code2,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  FormInput,
  Settings2,
  Eye,
  Sliders,
  CheckCircle2,
  GripVertical,
  ArrowUpDown,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface ContentBlock {
  id: string;
  type: string;
  name: string;
  subtitle?: string;
  enabled?: boolean;
  data?: {
    formId?: string;
    formSlug?: string;
    formTitle?: string;
    html?: string;
    css?: string;
    js?: string;
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaUrl?: string;
    cardType?: string;
  };
}

const INITIAL_DEFAULT_BLOCKS: ContentBlock[] = [
  {
    id: 'blk_lead_sources',
    type: 'lead_sources',
    name: 'Lead Sources',
    subtitle: 'Lead Sources - Content',
    enabled: true,
    data: {
      formTitle: 'Lead Sources',
      html: '',
    },
  },
];

export function PageEditor({ pageId }: { pageId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMode = searchParams.get('mode');
  const validPageId = pageId && pageId !== 'undefined' && pageId !== 'null' ? pageId : undefined;

  // Independent Editor Mode: 'flex' (Modular Blocks) vs 'raw' (Standalone Code Editor)
  const [editorMode, setEditorMode] = useState<'flex' | 'raw'>(
    urlMode === 'raw' ? 'raw' : 'flex'
  );
  const [activeFlexTab, setActiveFlexTab] = useState<'contents' | 'seo'>('contents');
  const [activeRawTab, setActiveRawTab] = useState<'code' | 'seo'>('code');

  useEffect(() => {
    if (urlMode === 'raw') {
      setEditorMode('raw');
    } else {
      setEditorMode('flex');
    }
  }, [urlMode]);

  // Raw HTML Editor States
  const [rawHtmlContent, setRawHtmlContent] = useState('');
  const [rawHtmlTab, setRawHtmlTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Core Page Information
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [heroImage, setHeroImage] = useState('');
  const [isHomepage, setIsHomepage] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  // Tab 1: Contents Fields (matching user screenshot)
  const [enableTailwindCdn, setEnableTailwindCdn] = useState(false);
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>(INITIAL_DEFAULT_BLOCKS);

  // Dialog 1: "+ Add Content Block" Picker Modal (matching user's second screenshot)
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);

  // Dialog 2: Custom HTML Block Editor (HTML + CSS + JS + Preview)
  const [htmlBlockDialogOpen, setHtmlBlockDialogOpen] = useState(false);
  const [editingHtmlBlockId, setEditingHtmlBlockId] = useState<string | null>(null);
  const [htmlBlockTitle, setHtmlBlockTitle] = useState('Custom HTML Block');
  const [htmlBlockTab, setHtmlBlockTab] = useState<'html' | 'css' | 'js' | 'preview'>('html');
  const [blockHtmlContent, setBlockHtmlContent] = useState('');
  const [blockCssContent, setBlockCssContent] = useState('');
  const [blockJsContent, setBlockJsContent] = useState('');

  // Dialog 3: Lead Sources Form Selector & New Form Creator
  const [formBlockDialogOpen, setFormBlockDialogOpen] = useState(false);
  const [editingFormBlockId, setEditingFormBlockId] = useState<string | null>(null);
  const [formModalTab, setFormModalTab] = useState<'select' | 'create'>('select');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [availableForms, setAvailableForms] = useState<Array<{ _id?: string; id?: string; title: string; slug: string; description?: string; fields?: any[] }>>([]);
  const [loadingForms, setLoadingForms] = useState(false);

  // Quick New Form Creator Fields
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormSlug, setNewFormSlug] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [includeConfigField, setIncludeConfigField] = useState(true);
  const [includeMessageField, setIncludeMessageField] = useState(true);
  const [creatingForm, setCreatingForm] = useState(false);
  const [formCreateError, setFormCreateError] = useState('');

  // Tab 2: SEO & SERP Controls
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [headScripts, setHeadScripts] = useState('');
  const [overrideGlobalTitle, setOverrideGlobalTitle] = useState(false);
  const [hideFromNav, setHideFromNav] = useState(false);
  const [hideFromSitemap, setHideFromSitemap] = useState(false);
  const [noIndex, setNoIndex] = useState(false);
  const [noFollow, setNoFollow] = useState(false);
  const [changeFrequency, setChangeFrequency] = useState('weekly');
  const [sitemapPriority, setSitemapPriority] = useState<number>(0.8);

  const [loading, setLoading] = useState(!!validPageId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load available forms for the form block picker
  const loadFormsList = () => {
    setLoadingForms(true);
    fetch('/api/forms', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.forms && Array.isArray(data.forms)) {
          setAvailableForms(data.forms);
          if (data.forms.length > 0 && !selectedFormId) {
            setSelectedFormId(data.forms[0]._id || data.forms[0].id || data.forms[0].slug);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingForms(false));
  };

  useEffect(() => {
    loadFormsList();
  }, []);

  // Load existing page data when validPageId is provided
  useEffect(() => {
    if (!validPageId) return;

    fetch(`/api/pages/${validPageId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.page) {
          const p = data.page;
          setTitle(p.title ?? '');
          setSlug(p.slug ?? '');
          setStatus(p.status === 'published' ? 'published' : 'draft');

          const parsed = parsePageContent(p.content ?? '');
          setCustomCss(p.custom_css || parsed.css || '');
          setCustomJs(p.custom_js || parsed.js || '');
          setRawHtmlContent(parsed.html || '');
          setEnableTailwindCdn(!!p.enable_tailwind_cdn);

          if (Array.isArray(p.blocks) && p.blocks.length > 0) {
            setBlocks(p.blocks);
          } else if (parsed.html) {
            setBlocks([
              {
                id: 'blk_initial',
                type: 'html',
                name: 'HTML Content',
                subtitle: 'Custom Page Markup',
                enabled: true,
                data: { html: parsed.html },
              },
            ]);
          }

          setSeoTitle(p.seo_title ?? '');
          setMetaDescription(p.meta_description ?? '');
          setMetaKeywords(p.meta_keywords ?? '');
          setHeadScripts(p.head_scripts ?? '');
          setOverrideGlobalTitle(!!p.override_global_title);
          setHideFromNav(!!p.hide_from_nav);
          setHideFromSitemap(!!p.hide_from_sitemap);
          setNoIndex(!!p.no_index);
          setNoFollow(!!p.no_follow);
          setChangeFrequency(p.change_frequency || 'weekly');
          setSitemapPriority(typeof p.sitemap_priority === 'number' ? p.sitemap_priority : 0.8);
          setHeroImage(p.hero_image ?? '');
          setIsHomepage(!!p.is_homepage);
          setSortOrder(p.sort_order ?? 0);
          setLoading(false);
          return;
        }
        fallbackSupabase();
      })
      .catch(() => fallbackSupabase());

    function fallbackSupabase() {
      const supabase = getSupabaseBrowser();
      supabase
        .from('pages')
        .select('*')
        .eq('id', validPageId)
        .maybeSingle()
        .then(({ data }) => {
          const p = data as Record<string, unknown> | null;
          if (p) {
            setTitle((p.title as string) ?? '');
            setSlug((p.slug as string) ?? '');
            setStatus((p.status as string) === 'published' ? 'published' : 'draft');
            const parsed = parsePageContent((p.content as string) ?? '');
            setCustomCss(parsed.css);
            setCustomJs(parsed.js);
            setRawHtmlContent(parsed.html || '');
            setSeoTitle((p.seo_title as string) ?? '');
            setMetaDescription((p.meta_description as string) ?? '');
            setMetaKeywords((p.meta_keywords as string) ?? '');
            setHeroImage((p.hero_image as string) ?? '');
            setIsHomepage(!!(p.is_homepage as boolean));
            setSortOrder((p.sort_order as number) ?? 0);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [validPageId]);

  // Handle switching to independent Raw HTML mode
  const switchToRawMode = () => {
    if (!rawHtmlContent.trim() && blocks.length > 0) {
      let combined = '';
      for (const b of blocks) {
        if (b.data?.html) {
          combined += `\n<!-- BLOCK: ${b.name} -->\n${b.data.html}\n`;
        } else if (b.type === 'lead_sources' || b.type === 'form') {
          combined += `\n<!-- FORM BLOCK: ${b.name} -->\n<div class="cms-lead-source-block" data-form-id="${b.data?.formId || ''}" data-form-slug="${b.data?.formSlug || ''}" data-form-title="${b.data?.formTitle || b.name}"></div>\n`;
        }
      }
      if (combined) setRawHtmlContent(combined.trim());
    }
    setEditorMode('raw');
    const targetUrl = validPageId ? `/admin/pages/${validPageId}?mode=raw` : `/admin/pages/new?mode=raw`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', targetUrl);
    }
  };

  const switchToFlexMode = () => {
    setEditorMode('flex');
    const targetUrl = validPageId ? `/admin/pages/${validPageId}` : `/admin/pages/new`;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', targetUrl);
    }
  };

  const insertRawHeroTemplate = () => {
    setRawHtmlContent(PRESTIGE_HERO_TEMPLATE.html);
    if (!customCss.trim()) setCustomCss(PRESTIGE_HERO_TEMPLATE.css);
    if (!customJs.trim()) setCustomJs(PRESTIGE_HERO_TEMPLATE.js);
    if (!title) setTitle('Prestige Thane Hero');
    if (!slug) setSlug('home');
  };

  const insertRawLeadCaptureTemplate = () => {
    setRawHtmlContent(LEAD_CAPTURE_SECTION_TEMPLATE.html);
    if (!customCss.trim()) setCustomCss(LEAD_CAPTURE_SECTION_TEMPLATE.css);
    if (!title) setTitle('Lead Capture Registration');
    if (!slug) setSlug('register');
  };

  // Open HTML, CSS, JS Editor for adding or editing an HTML Block
  const openHtmlBlockEditor = (block?: ContentBlock) => {
    if (block) {
      setEditingHtmlBlockId(block.id);
      setHtmlBlockTitle(block.name);
      setBlockHtmlContent(block.data?.html || '');
      setBlockCssContent(block.data?.css || '');
      setBlockJsContent(block.data?.js || '');
    } else {
      setEditingHtmlBlockId(null);
      setHtmlBlockTitle('Custom HTML Block');
      setBlockHtmlContent('<div class="py-12 text-center">\n  <h2 class="text-3xl font-bold">Custom Section</h2>\n  <p class="text-slate-600 mt-2">Add your responsive HTML markup here.</p>\n</div>');
      setBlockCssContent('');
      setBlockJsContent('');
    }
    setHtmlBlockTab('html');
    setAddContentDialogOpen(false);
    setHtmlBlockDialogOpen(true);
  };

  // Save the HTML Block
  const saveHtmlBlock = () => {
    if (editingHtmlBlockId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingHtmlBlockId
            ? {
                ...b,
                name: htmlBlockTitle.trim() || 'Custom HTML Block',
                subtitle: 'Custom Page Markup',
                data: {
                  ...b.data,
                  html: blockHtmlContent,
                  css: blockCssContent,
                  js: blockJsContent,
                },
              }
            : b
        )
      );
    } else {
      const newBlock: ContentBlock = {
        id: `blk_html_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'html',
        name: htmlBlockTitle.trim() || 'Custom HTML Block',
        subtitle: 'Custom Page Markup',
        enabled: true,
        data: {
          html: blockHtmlContent,
          css: blockCssContent,
          js: blockJsContent,
        },
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    setHtmlBlockDialogOpen(false);
  };

  // Open Form Selector / Creator Dialog for Lead Sources Form Block
  const openFormBlockDialog = (block?: ContentBlock) => {
    if (block) {
      setEditingFormBlockId(block.id);
      setSelectedFormId(block.data?.formId || block.data?.formSlug || '');
    } else {
      setEditingFormBlockId(null);
      if (availableForms.length > 0) {
        setSelectedFormId(availableForms[0]._id || availableForms[0].id || availableForms[0].slug);
      }
    }
    setFormModalTab('select');
    setNewFormTitle('');
    setNewFormSlug('');
    setNewFormDesc('');
    setFormCreateError('');
    setAddContentDialogOpen(false);
    setFormBlockDialogOpen(true);
  };

  // Connect Selected Existing Form to Block
  const saveSelectedFormToBlock = () => {
    const matched = availableForms.find((f) => (f._id || f.id || f.slug) === selectedFormId);
    const formName = matched?.title || 'Lead Sources';
    const formIdVal = matched?._id || matched?.id || selectedFormId;
    const formSlugVal = matched?.slug || '';

    if (editingFormBlockId) {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === editingFormBlockId
            ? {
                ...b,
                name: formName,
                subtitle: `${formName} - Content`,
                data: {
                  ...b.data,
                  formId: formIdVal,
                  formSlug: formSlugVal,
                  formTitle: formName,
                },
              }
            : b
        )
      );
    } else {
      const newBlock: ContentBlock = {
        id: `blk_form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'lead_sources',
        name: formName,
        subtitle: `${formName} - Content`,
        enabled: true,
        data: {
          formId: formIdVal,
          formSlug: formSlugVal,
          formTitle: formName,
        },
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
    setFormBlockDialogOpen(false);
  };

  // Quick Create New Form API Call and Attach
  const createNewFormAndAttach = async () => {
    setFormCreateError('');
    if (!newFormTitle.trim()) {
      setFormCreateError('Please enter a form title.');
      return;
    }
    const finalSlug = slugify(newFormSlug || newFormTitle);

    setCreatingForm(true);

    const standardFields: any[] = [
      { id: 'f_name', name: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'f_phone', name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { id: 'f_email', name: 'email', label: 'Email Address', type: 'email', required: true },
    ];

    if (includeConfigField) {
      standardFields.push({
        id: 'f_config',
        name: 'preferred_configuration',
        label: 'Preferred Configuration',
        type: 'select',
        required: false,
        options: '2 BHK Luxury, 3 BHK Signature, 4 BHK Presidential Suite',
      });
    }

    if (includeMessageField) {
      standardFields.push({
        id: 'f_msg',
        name: 'message',
        label: 'Notes / Inquiries',
        type: 'textarea',
        required: false,
      });
    }

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newFormTitle.trim(),
          slug: finalSlug,
          description: newFormDesc.trim() || 'Lead capture and visitor inquiries form',
          fields: standardFields,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Failed to create form');
      }

      const createdJson = await res.json();
      const createdForm = createdJson.form;
      const createdId = createdForm._id || createdForm.id || createdForm.slug;

      // Add to available forms list
      setAvailableForms((prev) => [createdForm, ...prev]);

      // Insert as block
      const newBlock: ContentBlock = {
        id: `blk_form_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'lead_sources',
        name: createdForm.title,
        subtitle: `${createdForm.title} - Content`,
        enabled: true,
        data: {
          formId: createdId,
          formSlug: createdForm.slug,
          formTitle: createdForm.title,
        },
      };

      setBlocks((prev) => [...prev, newBlock]);
      setFormBlockDialogOpen(false);
    } catch (err: any) {
      setFormCreateError(err.message || 'Error creating form');
    } finally {
      setCreatingForm(false);
    }
  };

  // Add Preset Templates (Hero, FAQ)
  const addPresetHeroBlock = () => {
    const newBlock: ContentBlock = {
      id: `blk_hero_${Date.now()}`,
      type: 'html',
      name: 'Hero Showcase Banner',
      subtitle: 'High Impact Header Section',
      enabled: true,
      data: {
        html: PRESTIGE_HERO_TEMPLATE.html,
        css: PRESTIGE_HERO_TEMPLATE.css,
        js: PRESTIGE_HERO_TEMPLATE.js,
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setAddContentDialogOpen(false);
  };

  const addPresetFaqBlock = () => {
    const newBlock: ContentBlock = {
      id: `blk_faq_${Date.now()}`,
      type: 'card',
      name: 'FAQ Accordion Card',
      subtitle: 'Frequently Asked Questions',
      enabled: true,
      data: {
        cardType: 'faq',
        html: `<section class="py-12 px-4 max-w-4xl mx-auto">\n  <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>\n  <div class="space-y-4">\n    <details class="p-4 rounded-lg border border-slate-200 bg-slate-50">\n      <summary class="font-semibold cursor-pointer">What configurations are available?</summary>\n      <p class="mt-2 text-sm text-slate-600">Exclusive 2, 3, and 4 BHK luxury residences.</p>\n    </details>\n    <details class="p-4 rounded-lg border border-slate-200 bg-slate-50">\n      <summary class="font-semibold cursor-pointer">When is the expected possession?</summary>\n      <p class="mt-2 text-sm text-slate-600">Possession is slated for December 2028.</p>\n    </details>\n  </div>\n</section>`,
      },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setAddContentDialogOpen(false);
  };

  // Reorder & Clone & Remove
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [dragOverBlockIndex, setDragOverBlockIndex] = useState<number | null>(null);

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const cloneBlock = (block: ContentBlock) => {
    const cloned: ContentBlock = {
      ...block,
      id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${block.name} (Copy)`,
    };
    setBlocks((prev) => [...prev, cloned]);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setBlocks(newBlocks);
  };

  const moveBlockToPosition = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= blocks.length ||
      toIndex >= blocks.length
    ) {
      return;
    }
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    setBlocks(newBlocks);
  };

  const swapBlocks = (indexA: number, indexB: number) => {
    if (
      indexA < 0 ||
      indexB < 0 ||
      indexA >= blocks.length ||
      indexB >= blocks.length ||
      indexA === indexB
    ) {
      return;
    }
    const newBlocks = [...blocks];
    const temp = newBlocks[indexA];
    newBlocks[indexA] = newBlocks[indexB];
    newBlocks[indexB] = temp;
    setBlocks(newBlocks);
  };

  // Compile unified content and save
  async function save() {
    setError('');
    const finalTitle = title.trim() || 'Untitled Page';
    const finalSlug = slugify(slug || finalTitle);

    setSaving(true);

    // Build unified HTML and compile CSS & JS
    let compiledHtml = '';
    let compiledCss = customCss ? customCss.trim() : '';
    let compiledJs = customJs ? customJs.trim() : '';

    if (editorMode === 'raw') {
      compiledHtml = rawHtmlContent.trim();
    } else {
      for (const b of blocks) {
        if (b.enabled !== false) {
          if (b.data?.html) {
            compiledHtml += `\n<!-- BLOCK: ${b.name} -->\n${b.data.html}\n`;
          } else if (b.type === 'lead_sources' || b.type === 'form') {
            compiledHtml += `\n<!-- FORM BLOCK: ${b.name} -->\n<div class="cms-lead-source-block" data-form-id="${b.data?.formId || ''}" data-form-slug="${b.data?.formSlug || ''}" data-form-title="${b.data?.formTitle || b.name}"></div>\n`;
          }
          if (b.data?.css) {
            compiledCss += `\n/* Block CSS: ${b.name} */\n${b.data.css}\n`;
          }
          if (b.data?.js) {
            compiledJs += `\n// Block JS: ${b.name}\n${b.data.js}\n`;
          }
        }
      }
    }

    const combinedContent = buildPageContent({
      html: compiledHtml.trim(),
      css: compiledCss.trim(),
      js: compiledJs.trim(),
    });

    const finalBlocks =
      editorMode === 'raw' && rawHtmlContent.trim()
        ? [
            {
              id: 'blk_raw_markup',
              type: 'html',
              name: 'HTML Content',
              subtitle: 'Raw HTML Page Markup',
              enabled: true,
              data: { html: rawHtmlContent.trim(), css: customCss.trim(), js: customJs.trim() },
            },
          ]
        : blocks;

    const payload = {
      title: finalTitle,
      slug: finalSlug,
      status,
      content: combinedContent,
      hero_image: heroImage || null,
      is_homepage: isHomepage,
      sort_order: sortOrder,

      // Upgraded CMS fields
      enable_tailwind_cdn: enableTailwindCdn,
      custom_css: customCss,
      custom_js: customJs,
      blocks: finalBlocks,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
      meta_keywords: metaKeywords || null,
      head_scripts: headScripts || '',
      override_global_title: overrideGlobalTitle,
      hide_from_nav: hideFromNav,
      hide_from_sitemap: hideFromSitemap,
      no_index: noIndex,
      no_follow: noFollow,
      change_frequency: changeFrequency,
      sitemap_priority: sitemapPriority,
    };

    let resultId = validPageId;
    let savedSuccessfully = false;

    try {
      if (validPageId) {
        const res = await fetch(`/api/pages/${validPageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          savedSuccessfully = true;
          await logActivity('update', 'page', finalTitle, validPageId);
        }
      } else {
        const res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          resultId = json.page?.id || json.page?._id;
          savedSuccessfully = true;
          await logActivity('create', 'page', finalTitle, resultId);
        }
      }
    } catch (apiErr) {
      console.warn('API save warning:', apiErr);
    }

    // Sync to Supabase
    try {
      const supabase = getSupabaseBrowser();
      if (validPageId) {
        await supabase.from('pages').update(payload).eq('id', validPageId);
      } else if (!savedSuccessfully) {
        const { data, error: err } = await supabase.from('pages').insert(payload).select().maybeSingle();
        if (err && !savedSuccessfully) {
          setError(err.message);
          setSaving(false);
          return;
        }
        if (data) resultId = (data as { id: string }).id;
      }
    } catch {}

    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    if (!validPageId && resultId) {
      if (editorMode === 'raw') {
        router.push(`/admin/pages/${resultId}?mode=raw`);
      } else {
        router.push(`/admin/pages/${resultId}`);
      }
    } else {
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const livePageUrl = isHomepage || slug === 'home' ? '/' : `/${slug || ''}`;

  const previewSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 1.5rem;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.6;
          }
          ${customCss}
        </style>
      </head>
      <body>
        ${rawHtmlContent || '<div style="padding: 4rem 1rem; text-align: center; color: #94a3b8; font-family: monospace;">No HTML markup entered yet...</div>'}
        <script>
          try {
            ${customJs}
          } catch (e) {
            console.error('Preview JS Error:', e);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Link href="/admin/pages">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Pages</span>
            </Link>
          </Button>
          <span className="text-muted-foreground/60 text-xs">/</span>
          <span className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
            {title || 'Untitled Page'}
          </span>
          {isHomepage && (
            <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Globe className="h-2.5 w-2.5" /> Home
            </span>
          )}
          {editorMode === 'raw' ? (
            <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200 dark:border-purple-800">
              <Code2 className="h-3 w-3 text-purple-600" /> Independent Raw HTML Editor
            </span>
          ) : (
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-800">
              <Layers className="h-3 w-3 text-blue-600" /> Flex Page Builder
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Mode Switch Button */}
          {editorMode === 'flex' ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={switchToRawMode}
              className="h-8 gap-1.5 text-xs text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold"
              title="Open independent Raw HTML/CSS/JS code editor"
            >
              <Code2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <span>Raw HTML Editor</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={switchToFlexMode}
              className="h-8 gap-1.5 text-xs text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold"
              title="Switch back to modular Flex Page builder"
            >
              <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Flex Page Builder</span>
            </Button>
          )}

          {slug && (
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <a href={livePageUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">View Page</span>
              </a>
            </Button>
          )}

          <Button
            type="button"
            onClick={save}
            disabled={saving}
            size="sm"
            className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Page</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Page Title & Slug Bar */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!validPageId) setSlug(slugify(e.target.value));
                }}
                placeholder="Page Title (e.g. Luxury Residences)"
                className="h-9 font-bold text-sm bg-background border-border"
              />
            </div>

            <div className="flex items-center gap-1 bg-muted/50 border border-border/80 rounded-lg px-2.5 py-1 text-xs text-muted-foreground shrink-0 font-mono">
              <span>/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="slug"
                className="bg-transparent text-xs font-mono text-foreground focus:outline-none w-28 sm:w-36"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="h-9 text-xs font-semibold rounded-lg border border-border bg-background px-2.5 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="published">🟢 Published</option>
              <option value="draft">🟡 Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Builder Card with Independent Tabs */}
      <div className="rounded-xl border border-border shadow-sm bg-card overflow-hidden">
        {editorMode === 'flex' ? (
          /* Top Tab Bar: ONLY Contents & SEO in Flex Page Builder */
          <div className="flex items-center border-b border-border bg-muted/20 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setActiveFlexTab('contents')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition border-b-2 -mb-[1px] flex items-center gap-2 whitespace-nowrap ${
                activeFlexTab === 'contents'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Contents</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {blocks.length} sections
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFlexTab('seo')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition border-b-2 -mb-[1px] flex items-center gap-2 whitespace-nowrap ${
                activeFlexTab === 'seo'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>SEO</span>
            </button>
          </div>
        ) : (
          /* Top Tab Bar: Independent Raw HTML Editor */
          <div className="flex items-center border-b border-border bg-muted/20 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setActiveRawTab('code')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition border-b-2 -mb-[1px] flex items-center gap-2 whitespace-nowrap ${
                activeRawTab === 'code'
                  ? 'border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="h-4 w-4 text-purple-500" />
              <span>Raw HTML (Code & Preview)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRawTab('seo')}
              className={`py-3.5 px-4 text-xs sm:text-sm font-semibold transition border-b-2 -mb-[1px] flex items-center gap-2 whitespace-nowrap ${
                activeRawTab === 'seo'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>SEO & Metadata</span>
            </button>
          </div>
        )}

        {/* TAB 1: Contents */}
        {editorMode === 'flex' && activeFlexTab === 'contents' && (
          <div className="divide-y divide-border/60">
            {/* Row 1: tailwindCdn */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="w-full sm:w-80 pr-2">
                <Label htmlFor="tailwindCdn" className="text-sm font-bold text-foreground block cursor-pointer">
                  tailwindCdn
                </Label>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Check this box to override output.css and use Tailwind CSS from CDN for this page only.
                </p>
              </div>
              <div className="flex items-center">
                <Switch
                  id="tailwindCdn"
                  checked={enableTailwindCdn}
                  onCheckedChange={setEnableTailwindCdn}
                />
              </div>
            </div>

            {/* Row 2: jeet-customcss */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-80 pr-2 shrink-0">
                <Label htmlFor="customCss" className="text-sm font-bold text-foreground block cursor-pointer">
                  jeet-customcss
                </Label>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Enter custom CSS or it act as a Head Section as well
                </p>
              </div>
              <div className="flex-1 w-full rounded-lg border border-border overflow-hidden bg-background shadow-2xs">
                <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border/60 text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <FileCode className="h-3.5 w-3.5 text-purple-500" />
                    <span>CSS Stylesheet & Head Code</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">style / head</span>
                </div>
                <Textarea
                  id="customCss"
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Enter custom CSS rules or head styles */"
                  className="w-full min-h-[140px] font-mono text-xs leading-relaxed border-0 bg-transparent focus:bg-background/80 resize-y rounded-none p-3 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Row 3: jeet-customjs */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-80 pr-2 shrink-0">
                <Label htmlFor="customJs" className="text-sm font-bold text-foreground block cursor-pointer">
                  jeet-customjs
                </Label>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Enter custom JS by jeet
                </p>
              </div>
              <div className="flex-1 w-full rounded-lg border border-border overflow-hidden bg-background shadow-2xs">
                <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b border-border/60 text-[11px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Code2 className="h-3.5 w-3.5 text-amber-500" />
                    <span>Custom JavaScript by Jeet</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">script / defer</span>
                </div>
                <Textarea
                  id="customJs"
                  value={customJs}
                  onChange={(e) => setCustomJs(e.target.value)}
                  placeholder="// Enter custom JavaScript code or tracking scripts"
                  className="w-full min-h-[140px] font-mono text-xs leading-relaxed border-0 bg-transparent focus:bg-background/80 resize-y rounded-none p-3 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Row 4: Contents (Blocks stack & Add Content button) */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-full sm:w-64 lg:w-72 pr-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-bold text-foreground block">
                    Contents
                  </Label>
                  {blocks.length > 0 && (
                    <span className="text-[11px] font-mono font-medium text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full border border-border/50">
                      {blocks.length} {blocks.length === 1 ? 'section' : 'sections'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  add what you want
                </p>
              </div>

              <div className="flex-1 w-full space-y-3">
                {/* Block Stack Cards */}
                {blocks.map((block, index) => {
                  const isHtmlType = block.type === 'html';
                  const isFormType = block.type === 'lead_sources' || block.type === 'form';
                  const isDraggingThis = draggedBlockIndex === index;
                  const isDragOverThis = dragOverBlockIndex === index && !isDraggingThis;

                  return (
                    <div
                      key={block.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedBlockIndex(index);
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/plain', String(index));
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dragOverBlockIndex !== index) {
                          setDragOverBlockIndex(index);
                        }
                      }}
                      onDragLeave={() => {
                        if (dragOverBlockIndex === index) {
                          setDragOverBlockIndex(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedBlockIndex !== null && draggedBlockIndex !== index) {
                          moveBlockToPosition(draggedBlockIndex, index);
                        }
                        setDraggedBlockIndex(null);
                        setDragOverBlockIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedBlockIndex(null);
                        setDragOverBlockIndex(null);
                      }}
                      className={`rounded-xl border bg-card shadow-xs overflow-hidden transition-all duration-150 group ${
                        isDraggingThis ? 'opacity-40 scale-[0.99] border-dashed border-primary/60' : ''
                      } ${
                        isDragOverThis
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md -translate-y-0.5'
                          : 'border-border hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Block Row Header & Controls */}
                      <div className="p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Drag Grip Handle */}
                          <div
                            className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground p-1 -ml-1 rounded transition select-none shrink-0"
                            title="Drag to reorder section"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          {/* Position Badge */}
                          <span className="text-[11px] font-mono font-bold text-muted-foreground/90 bg-muted px-2 py-0.5 rounded-md border border-border/60 shrink-0">
                            #{index + 1}
                          </span>

                          {/* Visual Tag Icon */}
                          <div
                            onClick={() => {
                              if (isHtmlType) openHtmlBlockEditor(block);
                              else if (isFormType) openFormBlockDialog(block);
                            }}
                            className={`h-8 w-8 rounded-lg grid place-items-center text-xs font-mono font-bold shrink-0 cursor-pointer transition ${
                              isFormType
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100'
                                : isHtmlType
                                ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 hover:bg-purple-100'
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 hover:bg-blue-100'
                            }`}
                          >
                            {isFormType ? '|>|' : isHtmlType ? '</>' : '★'}
                          </div>

                          {/* Title & Subtitle */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer select-none"
                            onClick={() => {
                              if (isHtmlType) openHtmlBlockEditor(block);
                              else if (isFormType) openFormBlockDialog(block);
                            }}
                          >
                            <div className="font-semibold text-sm text-foreground truncate hover:text-primary transition">
                              {block.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 truncate">
                              {block.subtitle || (isHtmlType ? 'Custom HTML/CSS/JS Section' : isFormType ? 'Lead Capture Form' : `${block.name} - Content`)}
                            </div>
                          </div>
                        </div>

                        {/* Right Action & Reorder Toolbar */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isHtmlType && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openHtmlBlockEditor(block)}
                              className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-purple-600 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg"
                            >
                              <Code2 className="h-3.5 w-3.5" />
                              <span>Code</span>
                            </Button>
                          )}

                          {isFormType && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openFormBlockDialog(block)}
                              className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-emerald-600 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg"
                            >
                              <FormInput className="h-3.5 w-3.5" />
                              <span>Form</span>
                            </Button>
                          )}

                          {/* Quick Position Selector Dropdown */}
                          {blocks.length > 1 && (
                            <select
                              value={index}
                              onChange={(e) => moveBlockToPosition(index, Number(e.target.value))}
                              title="Move section to position"
                              className="h-8 text-xs font-medium bg-muted/40 hover:bg-muted border border-border/80 rounded-lg px-2 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition"
                            >
                              {blocks.map((_, i) => (
                                <option key={i} value={i}>
                                  Pos {i + 1}
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Up & Down arrow buttons */}
                          <div className="flex items-center bg-muted/50 p-0.5 rounded-lg border border-border/60">
                            <button
                              type="button"
                              onClick={() => moveBlock(index, 'up')}
                              disabled={index === 0}
                              title={`Move "${block.name}" Up`}
                              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent transition"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveBlock(index, 'down')}
                              disabled={index === blocks.length - 1}
                              title={`Move "${block.name}" Down`}
                              className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-background disabled:opacity-20 disabled:hover:bg-transparent transition"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => cloneBlock(block)}
                            title="Duplicate Block"
                            className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            title="Remove Block"
                            className="h-8 w-8 grid place-items-center rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Dotted border "+ Add content" button */}
                <button
                  type="button"
                  onClick={() => setAddContentDialogOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-border/80 hover:border-primary/70 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition flex items-center justify-center gap-2 bg-background/40 hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add content</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Independent Raw HTML Editor (HTML + CSS + JS + Live Device Preview) */}
        {editorMode === 'raw' && activeRawTab === 'code' && (
          <div className="divide-y divide-border/60">
            {/* Top Toolbar: Sub-tabs (HTML, CSS, JS, Preview) & Quick Templates */}
            <div className="p-4 sm:px-6 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Code Sub-tabs */}
              <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border shadow-2xs overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setRawHtmlTab('html')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                    rawHtmlTab === 'html'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  <span>HTML Markup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRawHtmlTab('css')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                    rawHtmlTab === 'css'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>CSS Styles</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRawHtmlTab('js')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                    rawHtmlTab === 'js'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>JavaScript</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRawHtmlTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                    rawHtmlTab === 'preview'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Live Preview</span>
                </button>
              </div>

              {/* Template Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={insertRawHeroTemplate}
                  className="h-8 text-xs gap-1.5"
                  title="Insert full-featured hero banner template"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span>+ Hero Template</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={insertRawLeadCaptureTemplate}
                  className="h-8 text-xs gap-1.5"
                  title="Insert lead capture inquiry form template"
                >
                  <FormInput className="h-3.5 w-3.5 text-emerald-500" />
                  <span>+ Lead Form</span>
                </Button>
              </div>
            </div>

            {/* Sub-tab 1: HTML Markup */}
            {rawHtmlTab === 'html' && (
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Page HTML Body</span>
                    <span>(Rendered directly on the live page)</span>
                  </div>
                  <span className="font-mono text-[11px]">{rawHtmlContent.length} characters</span>
                </div>
                <Textarea
                  value={rawHtmlContent}
                  onChange={(e) => setRawHtmlContent(e.target.value)}
                  placeholder="<!-- Write or paste full raw HTML markup here -->&#10;<section class='py-16'>&#10;  <div class='max-w-4xl mx-auto text-center'>&#10;    <h1 class='text-4xl font-bold'>Welcome</h1>&#10;  </div>&#10;</section>"
                  className="w-full min-h-[380px] font-mono text-xs leading-relaxed bg-slate-950 text-slate-100 p-4 rounded-xl border-border resize-y focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Sub-tab 2: CSS Styles */}
            {rawHtmlTab === 'css' && (
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Custom CSS Stylesheet</span>
                    <span>(Injected in &lt;style&gt; or head)</span>
                  </div>
                  <span className="font-mono text-[11px]">{customCss.length} characters</span>
                </div>
                <Textarea
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  placeholder="/* Write custom CSS styles here */&#10;.custom-hero {&#10;  background: #0f172a;&#10;  color: #ffffff;&#10;}"
                  className="w-full min-h-[380px] font-mono text-xs leading-relaxed bg-slate-950 text-purple-200 p-4 rounded-xl border-border resize-y focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Sub-tab 3: JavaScript */}
            {rawHtmlTab === 'js' && (
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Custom JavaScript</span>
                    <span>(Executed when page loads on client)</span>
                  </div>
                  <span className="font-mono text-[11px]">{customJs.length} characters</span>
                </div>
                <Textarea
                  value={customJs}
                  onChange={(e) => setCustomJs(e.target.value)}
                  placeholder="// Write custom JS code here&#10;console.log('Custom page loaded successfully');"
                  className="w-full min-h-[380px] font-mono text-xs leading-relaxed bg-slate-950 text-amber-200 p-4 rounded-xl border-border resize-y focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}

            {/* Sub-tab 4: Live Device Preview */}
            {rawHtmlTab === 'preview' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  {/* Viewport switchers */}
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('desktop')}
                      className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                        previewViewport === 'desktop'
                          ? 'bg-background text-foreground shadow-2xs font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Monitor className="h-3.5 w-3.5" />
                      <span>Desktop (100%)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('tablet')}
                      className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                        previewViewport === 'tablet'
                          ? 'bg-background text-foreground shadow-2xs font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Tablet className="h-3.5 w-3.5" />
                      <span>Tablet (768px)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('mobile')}
                      className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                        previewViewport === 'mobile'
                          ? 'bg-background text-foreground shadow-2xs font-bold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Mobile (375px)</span>
                    </button>
                  </div>

                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sandbox Render
                  </span>
                </div>

                <div className="p-3 bg-muted/40 rounded-2xl border border-border flex justify-center overflow-x-auto">
                  <div
                    className={`bg-white rounded-xl shadow-lg border border-border/80 overflow-hidden transition-all duration-300 ${
                      previewViewport === 'desktop'
                        ? 'w-full h-[520px]'
                        : previewViewport === 'tablet'
                        ? 'w-[768px] h-[520px]'
                        : 'w-[375px] h-[520px]'
                    }`}
                  >
                    <iframe
                      title="Page Live Preview"
                      srcDoc={previewSrcDoc}
                      className="w-full h-full border-0 bg-white"
                      sandbox="allow-scripts allow-modals"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SEO Controls (Used in both Flex Page & Raw HTML modes) */}
        {((editorMode === 'flex' && activeFlexTab === 'seo') ||
          (editorMode === 'raw' && activeRawTab === 'seo')) && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Page Metadata & Directives
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pageTitle" className="text-xs font-semibold">
                    Page Title
                  </Label>
                  <Input
                    id="pageTitle"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!validPageId) setSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. Luxury Residences in Thane"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pageSlug" className="text-xs font-semibold">
                    URL Slug
                  </Label>
                  <Input
                    id="pageSlug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="residences-thane"
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              {/* Meta Description with 155-Character SERP Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="metaDesc" className="text-xs font-semibold">
                    Meta Description
                  </Label>
                  <span
                    className={`text-[11px] font-mono ${
                      metaDescription.length === 0
                        ? 'text-muted-foreground'
                        : metaDescription.length >= 120 && metaDescription.length <= 158
                        ? 'text-emerald-600 font-semibold dark:text-emerald-400'
                        : metaDescription.length > 158
                        ? 'text-amber-600 font-semibold dark:text-amber-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {metaDescription.length} / 158 characters
                    {metaDescription.length >= 120 && metaDescription.length <= 158 && ' (Optimal)'}
                    {metaDescription.length > 158 && ' (Truncated in SERP)'}
                  </span>
                </div>
                <Textarea
                  id="metaDesc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Enter a compelling summary of the page for search engine results..."
                  className="text-xs min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="metaKey" className="text-xs font-semibold">
                  Meta Keywords (comma-separated)
                </Label>
                <Input
                  id="metaKey"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="luxury flats, 2 bhk thane, prestige real estate"
                  className="text-xs h-9"
                />
              </div>
            </div>

            {/* Between Head Scripts */}
            <div className="pt-4 border-t border-border/80 space-y-2">
              <Label htmlFor="headScripts" className="text-xs font-semibold block">
                Between Head Scripts (head_scripts)
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Injected inside the &lt;head&gt; tag. Ideal for Google Tag Manager, Meta Pixel, or JSON-LD Structured Data.
              </p>
              <Textarea
                id="headScripts"
                value={headScripts}
                onChange={(e) => setHeadScripts(e.target.value)}
                placeholder="<!-- Tag Manager or Structured Data JSON-LD -->"
                className="font-mono text-xs min-h-[90px]"
              />
            </div>

            {/* SERP Directives Switches */}
            <div className="pt-4 border-t border-border/80 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Search Engine Directives
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div>
                    <div className="text-xs font-semibold text-foreground">No Index (no_index)</div>
                    <div className="text-[11px] text-muted-foreground">Instruct search engines not to index this page</div>
                  </div>
                  <Switch checked={noIndex} onCheckedChange={setNoIndex} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div>
                    <div className="text-xs font-semibold text-foreground">No Follow (no_follow)</div>
                    <div className="text-[11px] text-muted-foreground">Instruct search engines not to follow outbound links</div>
                  </div>
                  <Switch checked={noFollow} onCheckedChange={setNoFollow} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Hide from Navigation</div>
                    <div className="text-[11px] text-muted-foreground">Hide header navigation bar on this page and exclude from site menus</div>
                  </div>
                  <Switch checked={hideFromNav} onCheckedChange={setHideFromNav} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Hide from Sitemap</div>
                    <div className="text-[11px] text-muted-foreground">Exclude from dynamic /sitemap.xml</div>
                  </div>
                  <Switch checked={hideFromSitemap} onCheckedChange={setHideFromSitemap} />
                </div>
              </div>
            </div>

            {/* XML Sitemap Settings */}
            <div className="pt-4 border-t border-border/80 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                XML Sitemap Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Change Frequency</Label>
                  <select
                    value={changeFrequency}
                    onChange={(e) => setChangeFrequency(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Sitemap Priority (0.0 to 1.0)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.0"
                    max="1.0"
                    value={sitemapPriority}
                    onChange={(e) => setSitemapPriority(parseFloat(e.target.value) || 0.8)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* General Page Configuration */}
            <div className="pt-4 border-t border-border/80 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Page Publishing & Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status</Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Hero Image URL</Label>
                  <Input
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://.../hero.webp"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background sm:mt-5">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Homepage</div>
                    <div className="text-[11px] text-muted-foreground">Set as root (/)</div>
                  </div>
                  <Switch checked={isHomepage} onCheckedChange={setIsHomepage} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DIALOG 1: "+ Add Content Block" Picker (Upgraded Modern UI) */}
      <Dialog open={addContentDialogOpen} onOpenChange={setAddContentDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-lg w-full p-6 rounded-2xl border border-border shadow-2xl bg-card"
        >
          <DialogHeader className="pb-4 border-b border-border/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 grid place-items-center border border-blue-500/20 shrink-0 shadow-2xs">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                    Add Content Block
                  </DialogTitle>
                  <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    4 Blocks
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Select a section type or interactive component to add to this page.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 py-4">
            {/* 1. Lead Sources Form */}
            <button
              type="button"
              onClick={() => openFormBlockDialog()}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-background hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 hover:border-emerald-500/40 text-left transition-all duration-200 group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 grid place-items-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                  <FormInput className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      Lead Sources Form
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Form
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate leading-relaxed">
                    Embed visitor registration and lead capture inquiry forms
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </button>

            {/* 2. Custom HTML Block */}
            <button
              type="button"
              onClick={() => openHtmlBlockEditor()}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-background hover:bg-purple-50/40 dark:hover:bg-purple-950/20 hover:border-purple-500/40 text-left transition-all duration-200 group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 grid place-items-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Custom HTML Block
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      Code
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate leading-relaxed">
                    Add custom responsive HTML markup with scoped CSS and JavaScript
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </button>

            {/* 3. Hero Showcase Banner */}
            <button
              type="button"
              onClick={addPresetHeroBlock}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-background hover:bg-blue-50/40 dark:hover:bg-blue-950/20 hover:border-blue-500/40 text-left transition-all duration-200 group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 grid place-items-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Hero Showcase Banner
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      Preset
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate leading-relaxed">
                    Full-width visual banner with call to action, headlines &amp; badges
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </button>

            {/* 4. FAQ Accordion Card */}
            <button
              type="button"
              onClick={addPresetFaqBlock}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-background hover:bg-amber-50/40 dark:hover:bg-amber-950/20 hover:border-amber-500/40 text-left transition-all duration-200 group shadow-2xs hover:shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 grid place-items-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      FAQ Accordion Card
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Q&amp;A
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate leading-relaxed">
                    Expandable accordion section for frequently asked questions
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </button>
          </div>

          <div className="pt-3 border-t border-border/70 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>Blocks can be moved up/down or duplicated anytime</span>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAddContentDialogOpen(false)}
              className="h-7 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Custom HTML + CSS + JS Block Editor */}
      <Dialog open={htmlBlockDialogOpen} onOpenChange={setHtmlBlockDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-3xl w-full p-6 rounded-2xl border border-border shadow-2xl bg-card"
        >
          <DialogHeader className="pb-3 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>{editingHtmlBlockId ? 'Edit Custom Code Block' : 'New Custom HTML, CSS & JS Block'}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Author markup, stylesheets, and interactive scripts for this section.
                </DialogDescription>
              </div>

              {/* Template Quick Loader */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBlockHtmlContent(PRESTIGE_HERO_TEMPLATE.html);
                    setBlockCssContent(PRESTIGE_HERO_TEMPLATE.css);
                    setBlockJsContent(PRESTIGE_HERO_TEMPLATE.js);
                    setHtmlBlockTab('preview');
                  }}
                  className="h-7 px-2.5 text-[11px] gap-1 text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Load Hero</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBlockHtmlContent(LEAD_CAPTURE_SECTION_TEMPLATE.html);
                    setHtmlBlockTab('html');
                  }}
                  className="h-7 px-2.5 text-[11px] gap-1 text-emerald-600 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50"
                >
                  <FormInput className="h-3 w-3" />
                  <span>Load Lead Desk</span>
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="py-3 space-y-3">
            {/* Block Title Input */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Block Name</Label>
              <Input
                value={htmlBlockTitle}
                onChange={(e) => setHtmlBlockTitle(e.target.value)}
                placeholder="e.g. Hero Section, Floor Plans Overview"
                className="h-8 text-xs"
              />
            </div>

            {/* Code Tabs: HTML | CSS | JavaScript | Preview */}
            <div className="rounded-lg border border-border bg-background overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setHtmlBlockTab('html')}
                    className={`px-3 py-1 text-xs font-medium rounded transition flex items-center gap-1.5 ${
                      htmlBlockTab === 'html'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5 text-purple-500" />
                    <span>HTML</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHtmlBlockTab('css')}
                    className={`px-3 py-1 text-xs font-medium rounded transition flex items-center gap-1.5 ${
                      htmlBlockTab === 'css'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileCode className="h-3.5 w-3.5 text-blue-500" />
                    <span>CSS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHtmlBlockTab('js')}
                    className={`px-3 py-1 text-xs font-medium rounded transition flex items-center gap-1.5 ${
                      htmlBlockTab === 'js'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <FileCode className="h-3.5 w-3.5 text-amber-500" />
                    <span>JavaScript</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHtmlBlockTab('preview')}
                    className={`px-3 py-1 text-xs font-medium rounded transition flex items-center gap-1.5 ${
                      htmlBlockTab === 'preview'
                        ? 'bg-background text-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-muted-foreground">
                  {htmlBlockTab === 'html'
                    ? `${blockHtmlContent.length} chars`
                    : htmlBlockTab === 'css'
                    ? `${blockCssContent.length} chars`
                    : htmlBlockTab === 'js'
                    ? `${blockJsContent.length} chars`
                    : 'Interactive Render'}
                </span>
              </div>

              <div className="p-2">
                {htmlBlockTab === 'html' && (
                  <Textarea
                    value={blockHtmlContent}
                    onChange={(e) => setBlockHtmlContent(e.target.value)}
                    placeholder="<div>Write custom HTML markup here...</div>"
                    className="w-full min-h-[260px] font-mono text-xs leading-relaxed border-0 focus-visible:ring-0 bg-transparent resize-y"
                  />
                )}

                {htmlBlockTab === 'css' && (
                  <Textarea
                    value={blockCssContent}
                    onChange={(e) => setBlockCssContent(e.target.value)}
                    placeholder="/* Write custom CSS stylesheet for this block... */"
                    className="w-full min-h-[260px] font-mono text-xs leading-relaxed border-0 focus-visible:ring-0 bg-transparent resize-y"
                  />
                )}

                {htmlBlockTab === 'js' && (
                  <Textarea
                    value={blockJsContent}
                    onChange={(e) => setBlockJsContent(e.target.value)}
                    placeholder="// Write custom JavaScript interactive script for this block..."
                    className="w-full min-h-[260px] font-mono text-xs leading-relaxed border-0 focus-visible:ring-0 bg-transparent resize-y"
                  />
                )}

                {htmlBlockTab === 'preview' && (
                  <div className="rounded border border-border/80 overflow-hidden bg-white">
                    <iframe
                      title="Block Preview"
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            ${enableTailwindCdn ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
                            <style>
                              body { font-family: system-ui, sans-serif; margin: 1rem; color: #1e293b; }
                              ${blockCssContent}
                            </style>
                          </head>
                          <body>
                            ${blockHtmlContent || '<p style="color:#94a3b8; font-style:italic;">No HTML content yet.</p>'}
                            <script>
                              try { ${blockJsContent} } catch (e) { console.error(e); }
                            </script>
                          </body>
                        </html>
                      `}
                      className="w-full h-[260px] border-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHtmlBlockDialogOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveHtmlBlock}
              size="sm"
              className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4"
            >
              {editingHtmlBlockId ? 'Update Block' : 'Insert Code Block'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Lead Sources Form Selector & New Form Creator */}
      <Dialog open={formBlockDialogOpen} onOpenChange={setFormBlockDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-lg w-full p-6 rounded-2xl border border-border shadow-2xl bg-card"
        >
          <DialogHeader className="pb-3 border-b border-border">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FormInput className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{editingFormBlockId ? 'Configure Lead Sources Form' : 'Add Lead Sources Form Block'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select an existing lead capture form or create a new form directly.
            </DialogDescription>
          </DialogHeader>

          {/* Form Modal Tabs: Select Existing Form vs. Create New Form */}
          <div className="flex items-center border-b border-border my-2">
            <button
              type="button"
              onClick={() => setFormModalTab('select')}
              className={`py-2 px-3 text-xs font-semibold transition border-b-2 -mb-[1px] ${
                formModalTab === 'select'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Select Existing Form ({availableForms.length})
            </button>
            <button
              type="button"
              onClick={() => setFormModalTab('create')}
              className={`py-2 px-3 text-xs font-semibold transition border-b-2 -mb-[1px] flex items-center gap-1.5 ${
                formModalTab === 'create'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Plus className="h-3 w-3" />
              <span>+ Create New Form</span>
            </button>
          </div>

          {/* TAB A: Select Existing Form */}
          {formModalTab === 'select' && (
            <div className="py-2 space-y-3">
              {loadingForms ? (
                <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading available forms...</span>
                </div>
              ) : availableForms.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-muted-foreground">No forms found in the database.</p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setFormModalTab('create')}
                    className="text-xs h-7 gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Create Your First Form</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                  {availableForms.map((f) => {
                    const fId = f._id || f.id || f.slug;
                    const isSelected = selectedFormId === fId;

                    return (
                      <div
                        key={fId}
                        onClick={() => setSelectedFormId(fId)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-400 dark:bg-emerald-950/20'
                            : 'border-border bg-background hover:bg-accent'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                            <span>{f.title}</span>
                            <span className="text-[10px] font-mono text-muted-foreground">/{f.slug}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {f.description || `${f.fields?.length || 3} fields connected`}
                          </div>
                        </div>

                        <div className="h-4 w-4 rounded-full border grid place-items-center shrink-0">
                          {isSelected && <div className="h-2 w-2 rounded-full bg-emerald-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Link
                  href="/admin/forms"
                  target="_blank"
                  className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Manage All Forms (/admin/forms)</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormBlockDialogOpen(false)}
                    className="text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={saveSelectedFormToBlock}
                    disabled={!selectedFormId}
                    size="sm"
                    className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Apply Form Block
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: Create New Form Right Here */}
          {formModalTab === 'create' && (
            <div className="py-2 space-y-3">
              {formCreateError && (
                <div className="p-2 rounded bg-destructive/10 text-destructive text-[11px]">
                  {formCreateError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Form Title</Label>
                  <Input
                    value={newFormTitle}
                    onChange={(e) => {
                      setNewFormTitle(e.target.value);
                      setNewFormSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. VIP Pre-Launch Form"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Slug</Label>
                  <Input
                    value={newFormSlug}
                    onChange={(e) => setNewFormSlug(e.target.value)}
                    placeholder="vip-pre-launch-form"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Short Description</Label>
                <Input
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  placeholder="Visitor interest and unit allotment inquiry"
                  className="h-8 text-xs"
                />
              </div>

              {/* Form Fields Preset Toggles */}
              <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Form Fields Included:
                </Label>

                <div className="space-y-1.5 text-xs text-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Full Name (Required)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Phone Number (Required)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Email Address (Required)</span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={includeConfigField}
                      onChange={(e) => setIncludeConfigField(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-1 focus:ring-primary"
                    />
                    <span>Include Preferred Configuration (2, 3, 4 BHK dropdown)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMessageField}
                      onChange={(e) => setIncludeMessageField(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-1 focus:ring-primary"
                    />
                    <span>Include Comments / Special Inquiries Textarea</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormModalTab('select')}
                  className="text-xs h-8"
                >
                  Back to Select
                </Button>
                <Button
                  type="button"
                  onClick={createNewFormAndAttach}
                  disabled={creatingForm || !newFormTitle.trim()}
                  size="sm"
                  className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1"
                >
                  {creatingForm ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Creating Form...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create & Apply Form</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
