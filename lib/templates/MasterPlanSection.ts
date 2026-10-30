export const MASTER_PLAN_SECTION_TEMPLATE = {
  title: 'Visionary Master Plan',
  slug: 'master-plan',
  status: 'published',
  seo_title: 'Visionary Master Plan & Layout | Prestige Thane',
  meta_description: '30+ acres of visionary master planned spaces at Prestige Thane. Panoramic Yeoor Hills vistas, lush green boulevards, 6 high-rise towers, and downloadable high-res PDF.',
  meta_keywords: 'Prestige Thane master plan, master layout, Yeoor Hills view, tower placement, download master plan PDF',

  html: `<section class="master-plan-section font-sans" id="master-plan">
  <div class="master-plan-container">
    
    <!-- Section Header -->
    <div class="mp-header-center">
      <div class="mp-pre-title">
        <span class="mp-line"></span>
        <span>MASTER PLAN</span>
        <span class="mp-line"></span>
      </div>

      <h2 class="mp-main-title">
        A Visionary Master Plan
      </h2>

      <p class="mp-subtitle">
        30+ acres of thoughtfully planned spaces — seamless indoor-outdoor living, panoramic hill vistas, and lush green boulevards in perfect harmony.
      </p>
    </div>

    <!-- Master Plan Panoramic Container -->
    <div class="mp-panoramic-card group" id="mp-panoramic-card">
      <img
        id="master-plan-img"
        src="/assets/prestige_luxury_living_1790246859380.jpg"
        alt="Prestige Thane Visionary Master Layout &amp; Panoramic Balcony Deck Vista"
        width="1200"
        height="580"
        loading="lazy"
        decoding="async"
        class="mp-image cursor-zoom-in"
        onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
      />

      <!-- Ambient Gradient Overlay -->
      <div class="mp-img-overlay"></div>

      <!-- Top-Left Elevation Badge -->
      <div class="mp-top-badge">
        <div class="mp-badge-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sparkle-icon">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          <span>Panoramic Deck Living • Unhindered Yeoor Hills Vista</span>
        </div>
      </div>

      <!-- Floating 'Click to Zoom' button -->
      <button type="button" class="mp-zoom-btn" id="master-plan-zoom-btn" aria-label="Toggle zoom">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="zoom-icon-in">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        <span id="zoom-btn-label">Click to Zoom</span>
      </button>

      <!-- Floating Key Stats on the bottom-left -->
      <div class="mp-bottom-stats">
        <div class="mp-stat-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
          </svg>
          <span>30+ Sprawling Acres</span>
        </div>
        <div class="mp-stat-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
            <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>
          </svg>
          <span>Panoramic Green Views</span>
        </div>
        <div class="mp-stat-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
          </svg>
          <span>6 High-Rise Towers</span>
        </div>
      </div>
    </div>

    <!-- Download Master Plan CTA below image -->
    <div class="mp-download-bar">
      <div class="mp-bar-left">
        <div class="mp-map-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
        </div>
        <div>
          <p class="mp-bar-title">
            Download High-Resolution Master Layout PDF
          </p>
          <p class="mp-bar-desc">
            Detailed tower placement, vehicular entry/exit, pedestrian boulevards, and private deck orientations.
          </p>
        </div>
      </div>

      <a href="#early-access" class="mp-download-btn" data-modal="early-access" data-modal-title="Download Master Plan Layout PDF" data-modal-source="master_plan_pdf">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Download Master Plan</span>
      </a>
    </div>

  </div>
</section>`,

  css: `/* ===== MASTER PLAN SECTION STYLES ===== */
.master-plan-section {
  padding: 3.5rem 1rem 5rem;
  background-color: #ffffff;
  border-top: 1px solid #f1f5f9;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.master-plan-section * {
  box-sizing: border-box;
}

.master-plan-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0.75rem;
}

@media (min-width: 640px) {
  .master-plan-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .master-plan-container {
    padding: 0 2rem;
  }
}

/* SECTION HEADER */
.mp-header-center {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .mp-header-center {
    margin-bottom: 3rem;
  }
}

.mp-pre-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #b45309;
}

.mp-line {
  width: 1.5rem;
  height: 1px;
  background-color: #fcd34d;
}

.mp-main-title {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .mp-main-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .mp-main-title {
    font-size: 3rem;
  }
}

.mp-subtitle {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .mp-subtitle {
    font-size: 1rem;
  }
}

/* PANORAMIC CARD */
.mp-panoramic-card {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background-color: #020617;
}

@media (min-width: 640px) {
  .mp-panoramic-card {
    border-radius: 1.5rem;
  }
}

.mp-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: all 0.7s ease-out;
}

@media (min-width: 640px) {
  .mp-image {
    height: 500px;
  }
}

@media (min-width: 1024px) {
  .mp-image {
    height: 580px;
  }
}

.mp-image.cursor-zoom-in:hover {
  transform: scale(1.05);
}

.mp-image.zoomed {
  transform: scale(1.25);
  cursor: zoom-out !important;
}

.mp-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(2, 6, 23, 0.85) 0%, rgba(2, 6, 23, 0.2) 50%, transparent 100%);
  pointer-events: none;
}

/* TOP LEFT BADGE */
.mp-top-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 5;
}

@media (min-width: 640px) {
  .mp-top-badge {
    top: 1.5rem;
    left: 1.5rem;
  }
}

.mp-badge-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background-color: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fde047;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.sparkle-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #fbbf24;
  flex-shrink: 0;
}

/* ZOOM BUTTON */
.mp-zoom-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 5;
}

@media (min-width: 640px) {
  .mp-zoom-btn {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}

.mp-zoom-btn:hover {
  background-color: #ffffff;
  transform: translateY(-1px);
}

.mp-zoom-btn svg {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

/* BOTTOM STATS */
.mp-bottom-stats {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: none;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 5;
}

@media (min-width: 640px) {
  .mp-bottom-stats {
    bottom: 1.5rem;
    left: 1.5rem;
    display: flex;
  }
}

.mp-stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  padding: 0.5rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.mp-stat-pill svg {
  width: 1rem;
  height: 1rem;
}

/* DOWNLOAD BAR */
.mp-download-bar {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background-color: #FAF9F5;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

@media (min-width: 640px) {
  .mp-download-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
  }
}

.mp-bar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

@media (min-width: 640px) {
  .mp-bar-left {
    text-align: left;
  }
}

.mp-map-icon-box {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background-color: #fef3c7;
  color: #d97706;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(253, 230, 138, 0.6);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.mp-map-icon-box svg {
  width: 1.25rem;
  height: 1.25rem;
}

.mp-bar-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.25;
}

@media (min-width: 640px) {
  .mp-bar-title {
    font-size: 1.125rem;
  }
}

.mp-bar-desc {
  font-size: 0.75rem;
  color: #475569;
  margin: 0.15rem 0 0;
}

.mp-download-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
  transition: all 0.2s ease;
  flex-shrink: 0;
  cursor: pointer;
}

.mp-download-btn:hover {
  background: linear-gradient(to right, #d97706, #b45309);
  box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
  transform: translateY(-1px);
}

.mp-download-btn svg {
  width: 1rem;
  height: 1rem;
}
`,

  js: `// Master Plan Interactive Zoom Toggle
(function() {
  const zoomBtn = document.getElementById('master-plan-zoom-btn');
  const planImg = document.getElementById('master-plan-img');
  const labelEl = document.getElementById('zoom-btn-label');

  let isZoomed = false;

  function toggleZoom() {
    isZoomed = !isZoomed;
    if (planImg) {
      if (isZoomed) {
        planImg.classList.add('zoomed');
        planImg.classList.remove('cursor-zoom-in');
        if (labelEl) labelEl.textContent = 'Click to Reset Zoom';
      } else {
        planImg.classList.remove('zoomed');
        planImg.classList.add('cursor-zoom-in');
        if (labelEl) labelEl.textContent = 'Click to Zoom';
      }
    }
  }

  if (zoomBtn) {
    zoomBtn.addEventListener('click', toggleZoom);
  }

  if (planImg) {
    planImg.addEventListener('click', toggleZoom);
  }
})();
`,
};

