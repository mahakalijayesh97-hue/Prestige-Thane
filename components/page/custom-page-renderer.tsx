'use client';

import { useEffect, useRef, useMemo } from 'react';
import { parsePageContent } from '@/lib/page-content';
import { InlineLeadForm } from './inline-lead-form';

interface CustomPageRendererProps {
  content: string;
  className?: string;
  /** Set true for above-the-fold content to run scripts eagerly instead of deferred */
  priority?: boolean;
}

interface ParsedSegment {
  type: 'html' | 'form';
  content?: string;
  formId?: string;
  formSlug?: string;
  formTitle?: string;
}

function parseHtmlSegments(rawHtml: string): ParsedSegment[] {
  if (!rawHtml) return [];

  // Match: <div ...class="...cms-lead-source-block..."...>...</div> or self-closing
  const formTagRegex = /<div[^>]*class=["'][^"']*cms-lead-source-block[^"']*["'][^>]*(?:\/>|>[\s\S]*?<\/div>)/gi;

  const segments: ParsedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = formTagRegex.exec(rawHtml)) !== null) {
    const matchIndex = match.index;
    const matchStr = match[0];

    // Push preceding HTML if any
    if (matchIndex > lastIndex) {
      const htmlBefore = rawHtml.substring(lastIndex, matchIndex);
      if (htmlBefore.trim()) {
        segments.push({ type: 'html', content: htmlBefore });
      }
    }

    // Extract attributes from matchStr
    const slugMatch = matchStr.match(/data-form-slug=["']([^"']*)["']/i);
    const idMatch = matchStr.match(/data-form-id=["']([^"']*)["']/i);
    const titleMatch = matchStr.match(/data-form-title=["']([^"']*)["']/i);

    segments.push({
      type: 'form',
      formSlug: slugMatch ? slugMatch[1] : undefined,
      formId: idMatch ? idMatch[1] : undefined,
      formTitle: titleMatch ? titleMatch[1] : undefined,
    });

    lastIndex = matchIndex + matchStr.length;
  }

  // Push remaining HTML if any
  if (lastIndex < rawHtml.length) {
    const htmlAfter = rawHtml.substring(lastIndex);
    if (htmlAfter.trim()) {
      segments.push({ type: 'html', content: htmlAfter });
    }
  }

  // If no form tags were found, return the whole html as a single segment
  if (segments.length === 0 && rawHtml) {
    segments.push({ type: 'html', content: rawHtml });
  }

  return segments;
}

export function CustomPageRenderer({
  content,
  className = 'prose-content max-w-none',
  priority = false,
}: CustomPageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { html, css, js } = parsePageContent(content);

  const segments = useMemo(() => parseHtmlSegments(html), [html]);

  useEffect(() => {
    if (!js || !containerRef.current) return;

    const runScript = () => {
      try {
        if (!containerRef.current) return;
        const jq = typeof window !== 'undefined' ? (window as any).$ || (window as any).jQuery : undefined;
        const scriptFn = new Function('container', 'document', 'window', '$', 'jQuery', js);
        scriptFn(containerRef.current, document, window, jq, jq);
      } catch (err) {
        console.error('Error executing custom page script:', err);
      }
    };

    if (priority) {
      // Above-the-fold (hero): run on next tick to avoid blocking FCP
      const timer = setTimeout(runScript, 0);
      return () => clearTimeout(timer);
    }

    // Below-the-fold: defer to idle time to eliminate Total Blocking Time (TBT)
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(runScript, { timeout: 2000 });
      return () => {
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(runScript, 100);
      return () => clearTimeout(timer);
    }
  }, [js, priority]);

  return (
    <div className={className}>
      {/* Inject custom CSS scoped to page */}
      {css ? (
        <style
          dangerouslySetInnerHTML={{
            __html: css,
          }}
        />
      ) : null}

      {/* Render custom HTML and interactive form blocks */}
      <div ref={containerRef} suppressHydrationWarning className="w-full">
        {segments.map((seg, idx) => {
          if (seg.type === 'form') {
            return (
              <InlineLeadForm
                key={`form-block-${idx}-${seg.formSlug || seg.formId || idx}`}
                formSlug={seg.formSlug}
                formId={seg.formId}
                formTitle={seg.formTitle}
              />
            );
          }

          return (
            <div
              key={`html-block-${idx}`}
              suppressHydrationWarning
              dangerouslySetInnerHTML={{
                __html: seg.content || '',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CustomPageRenderer;
