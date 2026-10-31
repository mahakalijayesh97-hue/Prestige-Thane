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

    // Run non-critical page scripts during browser idle time to eliminate Total Blocking Time (TBT)
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(runScript, { timeout: 1000 });
      return () => {
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(runScript, 50);
      return () => clearTimeout(timer);
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

