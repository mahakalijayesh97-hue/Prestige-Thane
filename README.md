# CMS Feature Upgrade: Developer Specification & Implementation Architecture

This document outlines the complete architectural design, feasibility assessment, technical specifications, and step-by-step engineering plan for upgrading the CMS backend page builder, page-level SEO configuration, and global search/AI crawler management in this project.

---

## 1. Feasibility Assessment & System Compatibility

### Is this upgrade possible for this project?
**Yes, 100% possible.** The project runs on **Next.js 14+ (App Router)** with **MongoDB (Mongoose)** and **Supabase** fallback, **Tailwind CSS**, and **shadcn/ui** components. 

The current system already possesses:
- `PageModel` (`lib/models/Page.ts`) storing custom HTML, CSS, JS, and basic SEO.
- `ThemeSettingModel` (`lib/models/ThemeSetting.ts`) storing site-wide configuration.
- `page-editor.tsx` (`app/admin/(protected)/pages/page-editor.tsx`) for page editing.
- `CustomPageRenderer` (`components/page/custom-page-renderer.tsx`) for client-side rendering.
- `FormModel` (`lib/models/Form.ts`) and `/api/forms` for platform lead-capture forms.
- Reusable page templates in `lib/templates/` (Hero, FAQ, Amenities, Milestones, Pre-Launch Advantage, etc.).

Upgrading this to support **Modular Blocks**, **Advanced Page SEO**, and **Global Crawl Files (robots.txt, llms.txt, sitemap.xml)** fits cleanly into the existing stack without breaking backwards compatibility.

---

## 2. Architectural Design & Feature Breakdown

```
CMS Feature Upgrade Architecture
├── 1. Modular Content Builder ('Contents' Tab)
│   ├── Block Stack Management (Reorder, Clone 📋, Delete 🗑️)
│   ├── Add Content Drawer (HTML Code, Pre-built Forms, Banners, Standard Cards)
│   └── Dual-Mode Storage: JSON Block Tree + Compiled HTML fallback
│
├── 2. Page-Level SEO Controls ('SEO' Tab)
│   ├── Metadata & 155-char counter + Global Prefix/Suffix override
│   ├── Head Script Injection ('Between head') + Slug routing + Tailwind CDN
│   ├── Directives: No Index, Hide from Nav, Hide from Sitemap
│   └── XML Sitemap Parameters: ChangeFreq & Priority (0.0 - 1.0)
│
└── 3. Global Crawl Files Management
    ├── robots.txt Live Editor & Dynamic Route (/robots.txt)
    ├── llms.txt Live Editor & AI Scraping Route (/llms.txt)
    └── sitemap.xml Dynamic Generator & Sync Engine (/sitemap.xml)
```

---

## 3. Detailed Specifications

### Module 1: Modular Content Builder ('Contents' Tab)

#### 1.1 Block Stack State Model
Each page maintains an array of modular content blocks:
```typescript
export interface ContentBlock {
  id: string;                 // Unique UUID (e.g. "blk_1701234567")
  type: 'html' | 'form' | 'banner' | 'card' | 'template';
  name: string;               // Display title in block header
  enabled: boolean;           // Active toggle
  data: {
    // For HTML Code Blocks:
    html?: string;
    css?: string;
    js?: string;
    
    // For Pre-built Forms:
    formId?: string;
    formTitle?: string;
    displayStyle?: 'card' | 'inline' | 'popup-trigger';
    
    // For Promotional Banners:
    bannerVariant?: 'prestige-hero' | 'pre-launch-advantage' | 'strong-cta' | 'compliance-strip';
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaUrl?: string;
    bgImage?: string;
    
    // For Standard Cards / Modular Sections:
    cardType?: 'faq' | 'contact-card' | 'amenities' | 'milestones' | 'location' | 'price';
    customConfig?: Record<string, any>;
  };
}
```

#### 1.2 Block Action Toolbar
Every card rendered in the block stack provides:
- **Reordering**: Move Up / Move Down buttons or drag handle.
- **Clone (`📋`)**: Instantly creates a duplicate copy of the block with a new ID right below.
- **Delete (`🗑️`)**: Deletes the block with confirmation.
- **Enable/Disable**: Quick toggle switch to draft/hide individual blocks without deleting.
- **Inline Preview / Collapse**: Accordion fold to keep the editor organized.

#### 1.3 'Add Content' Drawer / Modal
Triggered by the **"+ Add content"** button:
1. **HTML Code Editor**:
   - Syntax-ready editor for custom HTML markup, CSS stylesheet, and JavaScript execution.
2. **Pre-built Forms**:
   - Dynamic dropdown populated from `/api/forms`.
   - Embeds the selected form (e.g., "Prestige Thane Booking Form", "Brochure Request", "Call Back Form").
3. **Promotional Banners**:
   - Hero Banner with background showcase & CTA.
   - Pre-Launch Advantage Banner (highlighting exclusive unit pricing).
   - Sticky / Floating Floating Lead Capture Strip.
4. **Standard Cards**:
   - FAQ Accordion Block.
   - Contact & Property Specialist Advisor Cards.
   - Amenities Grid / Price List / Location Advantage.

---

### Module 2: Page-Level SEO Controls ('SEO' Tab)

#### 2.1 Metadata & Overrides
- **Page Title**: Title tag with token preview (`{page_title} - {site_name}`).
- **Meta Description**: Textarea with real-time character count indicator:
  - `< 120 chars`: Gray/Neutral
  - `120 - 158 chars`: Optimal Green (`✓ Perfect snippet length for Google SERP`)
  - `> 160 chars`: Amber/Warning (`Truncation warning on mobile/desktop SERP`)
- **Global Prefix / Suffix Override Toggle**:
  - When enabled: Disables the automatic `"{site_name} | "` prefix or suffix, outputting raw title directly.

#### 2.2 Code & Routing
- **'Between head' (`head_scripts`)**: Full multi-line input for Google Tag Manager, custom `<meta>`, Facebook Pixel, or JSON-LD Structured Data.
- **Nice URL Slug**: Live slug validation with auto-formatting and duplicate checking.
- **Tailwind CDN Toggle**: Option to automatically inject `<script src="https://cdn.tailwindcss.com"></script>` into the page header if the custom HTML uses arbitrary Tailwind classes not in the core build bundle.

#### 2.3 SERP & Indexing Directives
- **Hide From Navigation (`hide_from_nav`)**: Excludes page from header navbar & dropdowns.
- **Hide From Sitemap (`hide_from_sitemap`)**: Excludes page from dynamic `sitemap.xml`.
- **Hide From SERP / No Index (`no_index`, `no_follow`)**: Injects `<meta name="robots" content="noindex, nofollow" />` in `<head>`.

#### 2.4 XML Sitemap Parameters
- **Change Frequency (`change_frequency`)**: Select dropdown:
  - `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.
- **Priority (`sitemap_priority`)**: Numeric input with validation between `0.0` and `1.0` (default `0.8` for standard pages, `1.0` for homepage).

---

### Module 3: Global Crawl Files Management

Located under Admin **Settings -> Search & Crawlers**:

#### 3.1 `robots.txt` Editor & Route
- Admin interface providing full-width monospaced editor.
- Preset button to inject standard real estate CMS rules:
  ```txt
  User-agent: *
  Allow: /
  Disallow: /admin/
  Disallow: /api/
  
  Sitemap: https://prestigethane.com/sitemap.xml
  ```
- Served directly at route handler `app/robots.ts` or `app/robots.txt/route.ts`.

#### 3.2 `llms.txt` Editor & Route
- Admin interface for managing structured documentation for AI scrapers (ChatGPT, Claude, Perplexity, Gemini).
- Standard formatting:
  ```markdown
  # Prestige Thane Official Project Overview
  > Ultra-luxury residential township in Balkum, Kapurbawdi, Thane West by Prestige Group.

  ## Key Project Details
  - Configurations: 2, 3 & 4 BHK Luxury Apartments
  - Starting Price: ₹1.59 Cr*
  - Possession: Dec 2028
  - Official Website: https://prestigethane.com

  ## Documentation & Links
  - [Floor Plans](https://prestigethane.com/floor-plans): Complete 2 & 3 BHK layout maps
  - [Pricing & Payment Plans](https://prestigethane.com/pricing): Construction-linked payment breakdown
  - [Location Advantages](https://prestigethane.com/location): Distance to Viviana Mall & Eastern Express Highway
  ```
- Served directly at `app/llms.txt/route.ts`.

#### 3.3 Dynamic `sitemap.xml` Generation
- Dynamic route handler at `app/sitemap.ts` (or `app/sitemap.xml/route.ts`).
- Automatically scans all published pages in MongoDB where `hide_from_sitemap != true`.
- Applies each page's specific `sitemap_priority` and `change_frequency`.
- Features an admin button: **"Re-sync & Test Sitemap"** with direct preview URL link.

---

## 4. Database Schema Extensions

### 4.1 Update `lib/models/Page.ts`
```typescript
export interface IPageDoc extends Document {
  // Existing fields
  title: string;
  slug: string;
  status: 'draft' | 'published';
  content: string;
  hero_image?: string | null;
  is_homepage: boolean;
  sort_order: number;
  
  // 1. Modular Blocks Support
  blocks?: Array<{
    id: string;
    type: string;
    name: string;
    enabled: boolean;
    data: Record<string, any>;
  }>;

  // 2. SEO & SERP Controls
  seo_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  override_global_title?: boolean;
  head_scripts?: string | null;
  enable_tailwind_cdn?: boolean;
  hide_from_nav?: boolean;
  hide_from_sitemap?: boolean;
  no_index?: boolean;
  no_follow?: boolean;
  change_frequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  sitemap_priority?: number; // 0.0 to 1.0

  created_at: Date;
  updated_at: Date;
}
```

### 4.2 Update `lib/models/ThemeSetting.ts`
```typescript
export interface IThemeSetting extends Document {
  // Existing theme settings...
  
  // 3. Global Crawl Files
  robots_txt?: string;
  llms_txt?: string;
  sitemap_custom_urls?: string;
  
  created_at: Date;
  updated_at: Date;
}
```

---

## 5. Step-by-Step Implementation Roadmap

| Phase | Milestone | Scope of Work |
|---|---|---|
| **Phase 1** | **Database & Schemas** | Extend `Page` and `ThemeSetting` Mongoose schemas and TypeScript definitions. |
| **Phase 2** | **Block Stack Engine** | Build `BlockCard`, `BlockToolbar`, `AddBlockDrawer`, and block serialization logic in `page-editor.tsx`. |
| **Phase 3** | **SEO Control Panel** | Build character counter, SERP preview, crawler toggles, and head script inputs in `page-editor.tsx`. |
| **Phase 4** | **Crawl Files Admin** | Add `robots.txt` and `llms.txt` management UI in Admin Settings. |
| **Phase 5** | **Dynamic Endpoints** | Implement `app/robots.ts`, `app/llms.txt/route.ts`, and `app/sitemap.ts` dynamic routes. |
| **Phase 6** | **Frontend Integration** | Update `app/(site)/[slug]/page.tsx` and layout metadata generators to apply noindex, head scripts, and Tailwind CDN. |
| **Phase 7** | **Verification & QA** | End-to-end testing of block creation, duplication, deletion, SEO tags output, and crawler endpoint responses. |

---

## 6. Execution Instructions for Developers

1. **Review this file** to confirm the target interfaces and block types.
2. The modular block stack renders blocks in the **'Contents' tab** of `/admin/pages/[id]`.
3. The SEO configurations live in the **'SEO' tab** of `/admin/pages/[id]`.
4. The crawl file controls reside in `/admin/settings` under **Search & Crawlers**.
5. All inputs for raw code or scripts in admin areas are accessible to authenticated administrators only, sanitizing display outputs while preserving raw code execution where intended.

