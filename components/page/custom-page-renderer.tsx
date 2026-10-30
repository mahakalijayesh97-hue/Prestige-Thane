'use client';

import { useEffect, useRef } from 'react';
import { parsePageContent } from '@/lib/page-content';

interface CustomPageRendererProps {
  content: string;
  className?: string;
}

export function CustomPageRenderer({ content, className = 'prose-content max-w-none' }: CustomPageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { html, css, js } = parsePageContent(content);

  useEffect(() => {
    if (!js || !containerRef.current) return;

    try {
      const jq = typeof window !== 'undefined' ? (window as any).$ || (window as any).jQuery : undefined;
      const scriptFn = new Function('container', 'document', 'window', '$', 'jQuery', js);
      if (containerRef.current) {
        scriptFn(containerRef.current, document, window, jq, jq);
      }
    } catch (err) {
      console.error('Error executing custom page script:', err);
    }
  }, [js]);

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

      {/* Render custom HTML */}
      <div
        ref={containerRef}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
}

export default CustomPageRenderer;

