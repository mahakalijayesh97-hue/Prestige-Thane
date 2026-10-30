export const PROJECT_OVERVIEW_TEMPLATE = {
  title: 'Project Overview & Highlights',
  slug: 'project-overview',
  status: 'published',
  seo_title: 'Project Overview & Highlights | Prestige Thane',
  meta_description: 'Key details and lifestyle highlights of Prestige Thane: 30+ acres, 6 high-rise towers, 80% open spaces, 2, 3, 4 BHK and Jodi residences.',
  meta_keywords: 'Prestige Thane overview, project highlights, Thane West apartments, 2 BHK, 3 BHK, 4 BHK, carpet area',

  html: `<div id="overview" class="project-overview-root font-sans">
  <!-- 1. Project Highlights: Everything You Need to Know -->
  <section class="overview-highlights-section" id="highlights">
    <div class="overview-container">
      <div class="overview-section-header">
        <div class="overview-pre-title">
          <span class="pre-title-line"></span>
          <span>PROJECT HIGHLIGHTS</span>
          <span class="pre-title-line"></span>
        </div>
        <h2 class="overview-main-heading">
          Everything You Need to Know
        </h2>
        <p class="overview-sub-heading">
          Key details of Prestige Thane at a glance.
        </p>
      </div>

      <!-- 3x3 Cards Grid -->
      <div class="overview-cards-grid">
        <!-- 1. BUILDER -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4"/>
              <path d="M8 6h.01"/><path d="M16 6h.01"/>
              <path d="M8 10h.01"/><path d="M16 10h.01"/>
              <path d="M8 14h.01"/><path d="M16 14h.01"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">BUILDER</span>
            <span class="overview-card-value">Prestige Group</span>
          </div>
        </div>

        <!-- 2. CONFIGURATION -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">CONFIGURATION</span>
            <span class="overview-card-value">2, 3, 4 BHK &amp; Jodi</span>
          </div>
        </div>

        <!-- 3. POSSESSION -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">POSSESSION</span>
            <span class="overview-card-value">Dec 2028</span>
          </div>
        </div>

        <!-- 4. MAHARERA -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">MAHARERA</span>
            <span class="overview-card-value">Awaiting RERA</span>
          </div>
        </div>

        <!-- 5. LAND PARCEL -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">LAND PARCEL</span>
            <span class="overview-card-value">30+ Acres</span>
          </div>
        </div>

        <!-- 6. TOWERS -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">TOWERS</span>
            <span class="overview-card-value">6 Towers</span>
          </div>
        </div>

        <!-- 7. FLOORS -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">FLOORS</span>
            <span class="overview-card-value">G + 45 to 55</span>
          </div>
        </div>

        <!-- 8. APARTMENTS -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">APARTMENTS</span>
            <span class="overview-card-value">1,800+ Units</span>
          </div>
        </div>

        <!-- 9. CARPET AREA -->
        <div class="overview-card">
          <div class="overview-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"/>
              <polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </div>
          <div class="overview-card-info">
            <span class="overview-card-label">CARPET AREA</span>
            <span class="overview-card-value">700 – 1,650 sq.ft.</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. About the Project: A Lifestyle Designed for Modern Luxury -->
  <section class="overview-about-section" id="about">
    <div class="overview-container">
      <div class="overview-section-header">
        <div class="overview-pre-title amber">
          <span class="pre-title-line amber"></span>
          <span>ABOUT THE PROJECT</span>
          <span class="pre-title-line amber"></span>
        </div>
        <h2 class="overview-main-heading">
          A Lifestyle Designed for <span class="highlight-amber">Modern Luxury</span>
        </h2>
      </div>

      <div class="overview-about-grid">
        <!-- Left Image Column -->
        <div class="overview-image-wrapper">
          <div class="overview-image-card">
            <img
              src="/assets/prestige_thane_gate_1790246596742.jpg"
              alt="Prestige Thane Grand Entrance Gate & Landmark High-Rise Towers"
              width="800"
              height="520"
              loading="lazy"
              decoding="async"
              class="overview-featured-img"
              onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
            />
            
            <!-- Vignette gradient overlay -->
            <div class="overview-img-overlay"></div>

            <!-- Top Badge: Elevation & Grand Entrance -->
            <div class="overview-img-top-badge">
              <div class="overview-badge-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sparkle-icon">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                </svg>
                <span>Grand Entrance &amp; Towers Elevation</span>
              </div>
            </div>

            <!-- Floating Glass Card: 80% Open Green Spaces -->
            <div class="overview-floating-card">
              <div class="floating-card-left">
                <div class="floating-percent-box">
                  80%
                </div>
                <div class="floating-text-box">
                  <span class="floating-title">Open Green Spaces</span>
                  <span class="floating-desc">Across 30+ sprawling acres in Thane West</span>
                </div>
              </div>
              <a href="#early-access" class="floating-enquire-btn" data-modal="early-access" data-modal-title="Experience Prestige Thane Lifestyle" data-modal-source="about_elevation_preview">
                <span>Enquire</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Narrative Column -->
        <div class="overview-narrative-col">
          <p class="narrative-p-large">
            Prestige Thane is more than a residence — it’s a thoughtfully curated lifestyle destination in the heart of
            Balkum, Kapurbawadi, Thane West. Set across 30+ acres of verdant landscapes, every home is designed to
            blend modern architecture with the serenity of nature.
          </p>

          <p class="narrative-p-regular">
            Wake up to panoramic views of lush greenery, step out into beautifully landscaped gardens, and come home
            to premium finishes and intelligent layouts. This is community living reimagined — spacious, serene, and
            effortlessly connected.
          </p>

          <!-- 3 Green Checkmark feature cards -->
          <div class="narrative-perks-list">
            <div class="perk-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" class="perk-check">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span class="perk-text">30+ acres of lush green surroundings with 80% open spaces</span>
            </div>
            <div class="perk-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" class="perk-check">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span class="perk-text">A vibrant, premium community of like-minded families</span>
            </div>
            <div class="perk-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" class="perk-check">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span class="perk-text">Modern architecture with thoughtfully designed spacious homes</span>
            </div>
          </div>

          <!-- Schedule a Visit Button -->
          <div class="narrative-action-wrap">
            <a href="#early-access" id="about-schedule-visit-btn" class="overview-visit-btn" data-modal="early-access" data-modal-title="Schedule a Personalized Site Visit" data-modal-source="about_project_section">
              <span>Schedule a Visit</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>`,

  css: `/* ===== PROJECT OVERVIEW & HIGHLIGHTS SECTION STYLES ===== */
.project-overview-root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.project-overview-root * {
  box-sizing: border-box;
}

.overview-highlights-section {
  padding: 3.5rem 1rem 5rem;
  background-color: #FAF9F5;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
}

.overview-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0.75rem;
}

@media (min-width: 640px) {
  .overview-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .overview-container {
    padding: 0 2rem;
  }
}

.overview-section-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.overview-pre-title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #64748b;
}

.overview-pre-title.amber {
  color: #b45309;
}

.pre-title-line {
  width: 1.5rem;
  height: 1px;
  background-color: #cbd5e1;
}

.pre-title-line.amber {
  background-color: #fcd34d;
}

.overview-main-heading {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .overview-main-heading {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .overview-main-heading {
    font-size: 3rem;
  }
}

.highlight-amber {
  color: #d97706;
}

.overview-sub-heading {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  margin: 0;
}

@media (min-width: 640px) {
  .overview-sub-heading {
    font-size: 1rem;
  }
}

/* 3x3 CARDS GRID */
.overview-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .overview-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .overview-cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

.overview-card {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.2s ease-in-out;
}

.overview-card:hover {
  border-color: #fcd34d;
  box-shadow: 0 10px 20px -5px rgba(217, 119, 6, 0.12);
  transform: translateY(-2px);
}

.overview-card-icon {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1rem;
  background-color: rgba(254, 243, 199, 0.8);
  border: 1px solid rgba(253, 230, 138, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d97706;
  flex-shrink: 0;
}

.overview-card-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.overview-card-info {
  display: flex;
  flex-direction: column;
}

.overview-card-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.overview-card-value {
  font-size: 1.25rem;
  font-weight: 900;
  color: #0f172a;
  margin-top: 0.15rem;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .overview-card-value {
    font-size: 1.45rem;
  }
}

/* 2. ABOUT THE PROJECT SECTION */
.overview-about-section {
  padding: 3.5rem 1rem 5rem;
  background-color: #ffffff;
  border-top: 1px solid #f1f5f9;
}

.overview-about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .overview-about-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3.5rem;
  }
}

.overview-image-wrapper {
  position: relative;
}

.overview-image-card {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(226, 232, 240, 0.9);
  background-color: #0f172a;
}

.overview-featured-img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.7s ease-out;
}

.overview-image-card:hover .overview-featured-img {
  transform: scale(1.04);
}

@media (min-width: 640px) {
  .overview-featured-img {
    height: 480px;
  }
}

@media (min-width: 1024px) {
  .overview-featured-img {
    height: 520px;
  }
}

.overview-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(2, 6, 23, 0.88) 0%, rgba(2, 6, 23, 0.2) 50%, transparent 100%);
  pointer-events: none;
}

.overview-img-top-badge {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
}

.overview-badge-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  background-color: rgba(2, 6, 23, 0.8);
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

/* FLOATING 80% CARD */
.overview-floating-card {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background-color: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  padding: 1rem 1.15rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

@media (min-width: 640px) {
  .overview-floating-card {
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
    padding: 1.15rem 1.35rem;
  }
}

.floating-card-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.floating-percent-box {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25), rgba(217, 119, 6, 0.35));
  border: 1px solid rgba(251, 191, 36, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fde047;
  font-size: 1.35rem;
  font-weight: 800;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .floating-percent-box {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.5rem;
  }
}

.floating-text-box {
  display: flex;
  flex-direction: column;
}

.floating-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
}

.floating-desc {
  font-size: 0.75rem;
  color: rgba(253, 230, 138, 0.85);
  font-weight: 500;
}

.floating-enquire-btn {
  display: none;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.12);
  padding: 0.55rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(251, 191, 36, 0.35);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.floating-enquire-btn:hover {
  background-color: rgba(251, 191, 36, 0.25);
  color: #fef08a;
}

.floating-enquire-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

@media (min-width: 640px) {
  .floating-enquire-btn {
    display: inline-flex;
  }
}

/* NARRATIVE COLUMN */
.overview-narrative-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.narrative-p-large {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #475569;
  font-weight: 400;
  margin: 0;
}

@media (min-width: 640px) {
  .narrative-p-large {
    font-size: 1.125rem;
  }
}

.narrative-p-regular {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #475569;
  margin: 0;
}

.narrative-perks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.perk-card {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.perk-check {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.perk-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.narrative-action-wrap {
  padding-top: 0.5rem;
}

.overview-visit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
  transition: all 0.2s ease;
  cursor: pointer;
}

.overview-visit-btn:hover {
  background: linear-gradient(to right, #d97706, #b45309);
  box-shadow: 0 6px 18px rgba(217, 119, 6, 0.45);
  transform: translateY(-1px);
}

.overview-visit-btn svg {
  width: 1rem;
  height: 1rem;
}`,

  js: `// Interactive handlers for Project Overview section
document.addEventListener('DOMContentLoaded', function() {
  const visitBtn = document.getElementById('about-schedule-visit-btn');
  if (visitBtn) {
    visitBtn.addEventListener('click', function(e) {
      if (typeof window.openEarlyAccessModal === 'function') {
        e.preventDefault();
        window.openEarlyAccessModal('about_project_section', 'Schedule a Personalized Site Visit');
      }
    });
  }
});`,
};

