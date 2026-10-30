export interface PageCodeContent {
  html: string;
  css: string;
  js: string;
}

const CSS_START_TAG = '<!-- CUSTOM_PAGE_CSS_START -->';
const CSS_END_TAG = '<!-- CUSTOM_PAGE_CSS_END -->';
const JS_START_TAG = '<!-- CUSTOM_PAGE_JS_START -->';
const JS_END_TAG = '<!-- CUSTOM_PAGE_JS_END -->';

/**
 * Parses raw page content and extracts separate HTML, CSS, and JS blocks.
 */
export function parsePageContent(rawContent: string): PageCodeContent {
  if (!rawContent) {
    return { html: '', css: '', js: '' };
  }

  let css = '';
  let js = '';
  let html = rawContent;

  // 1. Extract CSS block
  const cssTaggedMatch = html.match(
    /<!-- CUSTOM_PAGE_CSS_START -->\s*<style[^>]*>([\s\S]*?)<\/style>\s*<!-- CUSTOM_PAGE_CSS_END -->/i
  );
  if (cssTaggedMatch) {
    css = cssTaggedMatch[1].trim();
    html = html.replace(cssTaggedMatch[0], '');
  } else {
    // Fallback: look for <style id="custom-page-css">
    const cssIdMatch = html.match(/<style\s+id=["']custom-page-css["'][^>]*>([\s\S]*?)<\/style>/i);
    if (cssIdMatch) {
      css = cssIdMatch[1].trim();
      html = html.replace(cssIdMatch[0], '');
    }
  }

  // 2. Extract JS block
  const jsTaggedMatch = html.match(
    /<!-- CUSTOM_PAGE_JS_START -->\s*<script[^>]*>([\s\S]*?)<\/script>\s*<!-- CUSTOM_PAGE_JS_END -->/i
  );
  if (jsTaggedMatch) {
    js = jsTaggedMatch[1].trim();
    html = html.replace(jsTaggedMatch[0], '');
  } else {
    // Fallback: look for <script id="custom-page-js">
    const jsIdMatch = html.match(/<script\s+id=["']custom-page-js["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jsIdMatch) {
      js = jsIdMatch[1].trim();
      html = html.replace(jsIdMatch[0], '');
    }
  }

  return {
    html: html.trim(),
    css,
    js,
  };
}

/**
 * Combines separate HTML, CSS, and JS blocks into a unified HTML content string.
 */
export function buildPageContent({ html, css, js }: PageCodeContent): string {
  let result = html ? html.trim() : '';

  if (css && css.trim()) {
    const cssBlock = `${CSS_START_TAG}\n<style id="custom-page-css">\n${css.trim()}\n</style>\n${CSS_END_TAG}\n`;
    result = cssBlock + result;
  }

  if (js && js.trim()) {
    const jsBlock = `\n${JS_START_TAG}\n<script id="custom-page-js">\n${js.trim()}\n</script>\n${JS_END_TAG}`;
    result = result + jsBlock;
  }

  return result;
}

/**
 * Maps page slugs in the admin pages table to section IDs and CSS classes
 * in the homepage landing page template.
 */
export const HOMEPAGE_SECTION_SLUG_MAP: Record<string, string[]> = {
  overview: ['highlights', 'lifestyle', 'why-choose'],
  pricing: ['pricing'],
  amenities: ['amenities'],
  'floor-plans': ['floor-plans'],
  'master-plan': ['master-plan'],
  gallery: ['gallery'],
  location: ['location'],
  milestones: ['milestones'],
  faq: ['faq'],
  developer: ['developer'],
  register: ['lead-capture'],
};

/**
 * Filters sections from the homepage content so that only sections whose
 * corresponding page is published are rendered. Draft sections are removed.
 */
export function filterHomePageSections(
  content: string,
  publishedSlugs: string[] | Set<string>
): string {
  if (!content) return '';
  const slugSet = publishedSlugs instanceof Set ? publishedSlugs : new Set(publishedSlugs);

  let filtered = content;
  for (const [slug, sectionIds] of Object.entries(HOMEPAGE_SECTION_SLUG_MAP)) {
    if (!slugSet.has(slug)) {
      for (const id of sectionIds) {
        // Remove <section ... id="id">...</section>
        const sectionRegex = new RegExp(
          `<section[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/section>`,
          'gi'
        );
        filtered = filtered.replace(sectionRegex, '');
      }
    }
  }

  return filtered;
}

