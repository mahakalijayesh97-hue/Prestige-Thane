export const STRONG_CTA_SECTION_TEMPLATE = {
  title: 'Pre-Launch Invitation Banner',
  slug: 'cta-banner',
  status: 'published',
  seo_title: 'Prestige Thane Is Coming Soon | Pre-Launch Invitation',
  meta_description: 'Register now to receive official launch updates, pricing, floor plans and early availability for Prestige Thane.',
  meta_keywords: 'Prestige Thane coming soon, register for early access Thane, request a callback Prestige Thane, pre launch invitation',

  html: `<section class="strong-cta-section font-sans scroll-mt-20" id="cta-banner">
  <!-- Subtle decorative gold glow -->
  <div class="strong-cta-glow"></div>

  <div class="strong-cta-container">
    
    <!-- Pre-launch Badge -->
    <div class="strong-cta-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="strong-sparkle-icon">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
      </svg>
      <span>PRE-LAUNCH INVITATION</span>
    </div>

    <!-- Main Title -->
    <h2 class="strong-cta-title">
      Prestige Thane Is Coming Soon
    </h2>

    <!-- Subtitle -->
    <p class="strong-cta-desc">
      Register now to receive official launch updates, pricing, floor plans and early availability.
    </p>

    <!-- Action Buttons -->
    <div class="strong-cta-buttons">
      
      <!-- Primary: Register for Early Access -->
      <button
        type="button"
        id="bottom-register-cta"
        class="strong-btn-primary"
        data-modal="early-access"
        data-modal-source="strong_cta_primary"
        data-modal-title="Register for Early Access"
      >
        <span>REGISTER FOR EARLY ACCESS</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="strong-btn-arrow">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>

      <!-- Secondary: Request a Call Back -->
      <button
        type="button"
        id="bottom-callback-cta"
        class="strong-btn-secondary"
        data-modal="early-access"
        data-modal-source="strong_cta_callback"
        data-modal-title="Request a Call Back"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="strong-phone-icon">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span>REQUEST A CALL BACK</span>
      </button>

    </div>

    <!-- Compliance Footnote -->
    <div class="strong-cta-footnote">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="strong-shield-icon">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <span>Compliance verified pre-launch communication. RERA details awaited.</span>
    </div>

  </div>
</section>`,

  css: `/* ===== STRONG CTA BANNER SECTION STYLES ===== */
.strong-cta-section {
  position: relative;
  padding: 4rem 1rem 5rem;
  background: linear-gradient(to bottom, #020617, #0f172a, #020617);
  color: #ffffff;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .strong-cta-section {
    padding: 6rem 1.5rem;
  }
}

.strong-cta-section * {
  box-sizing: border-box;
}

.strong-cta-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 350px;
  background-color: rgba(245, 158, 11, 0.1);
  filter: blur(120px);
  border-radius: 9999px;
  pointer-events: none;
}

.strong-cta-container {
  position: relative;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .strong-cta-container {
    padding: 0 1.5rem;
  }
}

.strong-cta-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  background-color: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  color: #fde047;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.strong-sparkle-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #fbbf24;
}

.strong-cta-title {
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #ffffff;
  margin: 0;
}

@media (min-width: 640px) {
  .strong-cta-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .strong-cta-title {
    font-size: 3.75rem;
  }
}

.strong-cta-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: #cbd5e1;
  max-width: 42rem;
  margin: 0;
}

@media (min-width: 640px) {
  .strong-cta-desc {
    font-size: 1.125rem;
  }
}

.strong-cta-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
}

.strong-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  background-color: #f59e0b;
  color: #020617;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
  transition: all 0.25s ease;
}

@media (min-width: 640px) {
  .strong-btn-primary {
    font-size: 0.875rem;
  }
}

.strong-btn-primary:hover {
  background-color: #fbbf24;
  transform: translateY(-1px);
  box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.4);
}

.strong-btn-arrow {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.strong-btn-primary:hover .strong-btn-arrow {
  transform: translateX(3px);
}

.strong-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  background-color: rgba(30, 41, 59, 0.8);
  border: 1px solid #475569;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
}

@media (min-width: 640px) {
  .strong-btn-secondary {
    font-size: 0.875rem;
  }
}

.strong-btn-secondary:hover {
  background-color: rgba(51, 65, 85, 0.9);
  border-color: #64748b;
  transform: translateY(-1px);
}

.strong-phone-icon {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
}

.strong-cta-footnote {
  padding-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.strong-shield-icon {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
  flex-shrink: 0;
}
`,

  js: `// Strong CTA Banner Interactivity
(function() {
  const registerBtn = document.getElementById('bottom-register-cta');
  const callbackBtn = document.getElementById('bottom-callback-cta');

  function handleOpen(source, title) {
    if (typeof window.openEarlyAccessModal === 'function') {
      window.openEarlyAccessModal(source, title);
    } else {
      const modal = document.getElementById('early-access-modal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        const titleEl = document.getElementById('early-access-modal-title');
        if (titleEl) titleEl.textContent = title;
      }
    }
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const source = this.getAttribute('data-modal-source') || 'strong_cta_primary';
      const title = this.getAttribute('data-modal-title') || 'Register for Early Access';
      handleOpen(source, title);
    });
  }

  if (callbackBtn) {
    callbackBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const source = this.getAttribute('data-modal-source') || 'strong_cta_callback';
      const title = this.getAttribute('data-modal-title') || 'Request a Call Back';
      handleOpen(source, title);
    });
  }
})();
`,
};

