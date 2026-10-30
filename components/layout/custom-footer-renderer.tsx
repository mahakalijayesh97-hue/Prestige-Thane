'use client';

import { useEffect, useRef } from 'react';

interface CustomFooterRendererProps {
  html: string;
  css: string;
  js: string;
}

export function CustomFooterRenderer({ html, css, js }: CustomFooterRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!js || !containerRef.current) return;

    try {
      // Execute custom footer JavaScript in client context
      const scriptFn = new Function('container', 'document', 'window', js);
      scriptFn(containerRef.current, document, window);
    } catch (err) {
      console.error('Error executing custom footer script:', err);
    }
  }, [js]);

  if (!html && !css && !js) return null;

  return (
    <div className="custom-footer-container w-full">
      {css ? (
        <style
          dangerouslySetInnerHTML={{
            __html: css,
          }}
        />
      ) : null}

      {html ? (
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      ) : (
        <div ref={containerRef} />
      )}
    </div>
  );
}

export default CustomFooterRenderer;

