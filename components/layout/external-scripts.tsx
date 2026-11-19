'use client';

import { useEffect } from 'react';

export function ExternalScriptsLoader({ headerScripts }: { headerScripts?: string }) {
  useEffect(() => {
    if (!headerScripts || typeof window === 'undefined') return;

    try {
      const temp = document.createElement('div');
      temp.innerHTML = headerScripts;

      // 1. Process <link> stylesheets
      const links = temp.querySelectorAll('link');
      links.forEach((l) => {
        const href = l.getAttribute('href');
        if (href && !document.head.querySelector(`link[href="${href}"]`)) {
          const linkEl = document.createElement('link');
          Array.from(l.attributes).forEach((attr) => {
            linkEl.setAttribute(attr.name, attr.value);
          });
          document.head.appendChild(linkEl);
        }
      });

      // 2. Process <script> elements (Tailwind Play CDN, Bootstrap, jQuery, Google Analytics, etc.)
      const scripts = temp.querySelectorAll('script');
      scripts.forEach((s) => {
        const src = s.getAttribute('src');
        if (src) {
          // Check if already in document.head
          const alreadyInHead = document.head.querySelector(`script[src="${src}"]`);
          if (!alreadyInHead) {
            const scriptEl = document.createElement('script');
            Array.from(s.attributes).forEach((attr) => {
              scriptEl.setAttribute(attr.name, attr.value);
            });
            // Ensure script executes reliably
            scriptEl.async = false;

            // Trigger Tailwind scan if Tailwind CDN is loaded
            if (src.includes('tailwindcss.com')) {
              scriptEl.onload = () => {
                if (typeof (window as any).tailwind?.refresh === 'function') {
                  try {
                    (window as any).tailwind.refresh();
                  } catch {}
                }
              };
            }

            document.head.appendChild(scriptEl);
          } else if (src.includes('tailwindcss.com') && typeof (window as any).tailwind?.refresh === 'function') {
            try {
              (window as any).tailwind.refresh();
            } catch {}
          }
        } else if (s.textContent && s.textContent.trim()) {
          try {
            const inlineScriptEl = document.createElement('script');
            inlineScriptEl.textContent = s.textContent;
            document.head.appendChild(inlineScriptEl);
          } catch (err) {
            console.error('Error executing custom header script:', err);
          }
        }
      });
    } catch (e) {
      console.warn('Error processing header_scripts:', e);
    }
  }, [headerScripts]);

  return null;
}


