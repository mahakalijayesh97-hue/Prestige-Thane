export const PRESTIGE_HERO_TEMPLATE = {
  html: `<section class="prestige-hero-section" id="hero">
  <!-- Architectural Background Ambiance -->
  <div class="hero-bg-overlay"></div>

  <div class="hero-container">
    <div class="hero-grid">
      <!-- Left Column: Prestige Thane Details -->
      <div class="hero-left">
        <!-- MahaRERA attribution strip -->
        <div class="hero-rera-strip">
          <span class="hero-stars">★★★★★</span>
          <span class="hero-rera-text">MAHARERA: AWAITING RERA</span>
          <span class="hero-sep">|</span>
          <span class="hero-by-text">BY PRESTIGE GROUP</span>
        </div>

        <!-- Headings -->
        <div class="hero-headings">
          <span class="hero-badge-tag">PRE-LAUNCH LUXURY TOWNSHIP</span>
          <h1 class="hero-main-title">Prestige Thane</h1>
          <h2 class="hero-sub-title-1">Luxury Living in the Heart of Thane</h2>
          <p class="hero-sub-title-2">Prestige Thane Phase 1 • Kapurbawadi, Thane West</p>
        </div>

        <!-- Location Pin -->
        <div class="hero-location">
          <svg class="hero-loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Balkum, Kapurbawadi, Thane West, Maharashtra</span>
        </div>

        <!-- Description -->
        <p class="hero-description">
          Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.
        </p>

        <!-- 3-Column Highlights Strip -->
        <div class="hero-specs-card">
          <div class="hero-spec-item">
            <span class="spec-label">STARTING PRICE</span>
            <span class="spec-value highlight">₹1.59 Cr*</span>
          </div>
          <div class="hero-spec-item">
            <span class="spec-label">CONFIGURATION</span>
            <span class="spec-value">2, 3 & 4 BHK</span>
          </div>
          <div class="hero-spec-item">
            <span class="spec-label">POSSESSION</span>
            <span class="spec-value">Dec 2028</span>
          </div>
        </div>

        <!-- Architecture & Township Preview Strip -->
        <div class="hero-preview-box">
          <div class="preview-box-header">
            <div class="preview-header-title">
              <svg class="preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              <span>ARCHITECTURE & TOWNSHIP PREVIEW</span>
            </div>
            <button type="button" class="preview-header-link" id="hero-view-all-renders">View All 8 Renders →</button>
          </div>

          <div class="preview-grid">
            <div class="preview-thumb" data-index="0" title="Click to view Elevation render">
              <img src="/assets/thumbs/prestige-entrance-gate.webp" alt="Elevation" width="76" height="56" loading="lazy" decoding="async" />
              <div class="thumb-overlay"></div>
              <span class="thumb-tag">Elevation</span>
              <span class="thumb-zoom-icon">🔍</span>
            </div>
            <div class="preview-thumb" data-index="1" title="Click to view Aqua Deck render">
              <img src="/assets/thumbs/prestige-aerial-lifestyle.webp" alt="Aqua Deck" width="76" height="56" loading="lazy" decoding="async" />
              <div class="thumb-overlay"></div>
              <span class="thumb-tag">Aqua Deck</span>
              <span class="thumb-zoom-icon">🔍</span>
            </div>
            <div class="preview-thumb" data-index="2" title="Click to view Clubhouse render">
              <img src="/assets/thumbs/prestige-luxury-living-view.webp" alt="Clubhouse" width="76" height="56" loading="lazy" decoding="async" />
              <div class="thumb-overlay"></div>
              <span class="thumb-tag">Clubhouse</span>
              <span class="thumb-zoom-icon">🔍</span>
            </div>
            <div class="preview-thumb" data-index="3" title="Click to view Residences render">
              <img src="/assets/thumbs/prestige-luxury-living-view.webp" alt="Residences" width="76" height="56" loading="lazy" decoding="async" />
              <div class="thumb-overlay"></div>
              <span class="thumb-tag">Residences</span>
              <span class="thumb-zoom-icon">🔍</span>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="hero-cta-group">
          <a href="#early-access" class="btn-primary-site-visit" id="hero-book-site-visit-btn" data-modal="early-access" data-modal-title="Book Free Site Visit" data-modal-source="Hero Book Site Visit Button">
            <span>Book Free Site Visit</span>
            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </a>
          <a href="#early-access" class="btn-secondary-brochure" id="hero-brochure-btn" data-modal="early-access" data-modal-title="Download Brochure & Pricing" data-modal-source="Hero Download Brochure Button">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6m-3 3 3 3 3-3"/></svg>
            <span>Download Brochure</span>
          </a>
        </div>

        <!-- Trust Badges -->
        <div class="hero-trust-bullets">
          <span class="trust-item"><svg class="trust-icon text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> Zero Brokerage</span>
          <span class="trust-dot">•</span>
          <span class="trust-item"><svg class="trust-icon text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg> Direct from developer</span>
          <span class="trust-dot">•</span>
          <span class="trust-item"><svg class="trust-icon text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/></svg> Best price guarantee</span>
        </div>
      </div>

      <!-- Right Column: Booking Form Card -->
      <div class="hero-right">
        <div class="hero-form-card">
          <!-- Card Header with Badges and Logos -->
          <div class="form-header">
            <div class="form-logos-row">
              <!-- Authorized Partner Badge -->
              <div class="partner-badge">
                <div class="badge-top">AUTHORIZED</div>
                <div class="badge-mid">SALES<br/>PARTNER</div>
                <div class="badge-bot"><span>F1</span> First Team.</div>
              </div>

              <!-- Presenting Center Pill -->
              <div class="presenting-center">
                <span class="presenting-line"></span>
                <span class="presenting-text">PRESENTING</span>
                <span class="presenting-line"></span>
              </div>

              <!-- Prestige Logo -->
              <div class="prestige-logo-box">
                <img src="/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.webp" alt="Prestige Group" width="48" height="48" decoding="async" onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'" />
              </div>
            </div>

            <!-- Save Lacs Badge -->
            <div class="save-lacs-wrap">
              <a href="#early-access" class="save-lacs-pill" id="hero-save-lacs-btn" data-modal="early-access" data-modal-title="Save Upto ₹5 Lacs* (VIP Pre-Launch Offer)" data-modal-source="Save Upto 5 Lacs Pill">
                <span class="sparkle">✦</span>
                <span class="save-lacs-text">SAVE UPTO ₹5 LACS*</span>
                <span class="vip-tag">VIP</span>
              </a>
            </div>

            <!-- Buyer Perks Ribbon -->
            <div class="buyer-perks-ribbon">
              <div class="perk-item">✓ Best Negotiations on Buyer Side</div>
              <span class="perk-sep">•</span>
              <div class="perk-item">✓ End-to-End Professional Support</div>
              <span class="perk-sep">•</span>
              <div class="perk-item">👥 Served 525+ Happy Home Buyers</div>
              <span class="perk-sep">•</span>
              <div class="perk-item green">✓ Zero Brokerage</div>
            </div>

            <!-- Form Sub-header -->
            <div class="form-sub-header">
              <h3 class="form-title">Book Your Free Site Visit</h3>
              <p class="form-subtitle">Limited units available • Best price this month</p>
            </div>
          </div>

          <!-- Form Body -->
          <form class="hero-form" id="hero-enquiry-form" onsubmit="return false;">
            <div class="form-field">
              <label for="lead-phone">Mobile Number <span class="required">*</span></label>
              <div class="phone-input-wrap">
                <span class="country-prefix">+91</span>
                <input type="tel" id="lead-phone" name="phone" placeholder="Enter 10-digit mobile number" maxlength="10" required />
              </div>
            </div>

            <div class="form-field">
              <label for="lead-email">Email Address <span class="required">*</span></label>
              <input type="email" id="lead-email" name="email" placeholder="your.email@example.com" required />
            </div>

            <div class="form-field">
              <div class="config-header">
                <label>Configuration <span class="required">*</span></label>
                <span class="config-hint">Pick preferred size</span>
              </div>
              <div class="config-pills" id="config-selector">
                <button type="button" class="config-pill active" data-cfg="2 BHK">2 BHK</button>
                <button type="button" class="config-pill" data-cfg="3 BHK">3 BHK</button>
                <button type="button" class="config-pill" data-cfg="4 BHK">4 BHK</button>
                <button type="button" class="config-pill" data-cfg="All Units">All Units</button>
              </div>
            </div>

            <!-- Two CTA Action Buttons -->
            <div class="action-buttons-wrap">
              <button type="button" class="btn-whatsapp-action" id="hero-whatsapp-btn">
                <div class="action-btn-top">
                  <svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  <span>Get Info via WhatsApp</span>
                </div>
                <span class="action-btn-sub green-sub">Option 1 • Instant Details</span>
              </button>

              <button type="button" class="btn-visit-action" id="hero-submit-visit-btn">
                <div class="action-btn-top">
                  <svg class="visit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                  <span>Schedule a Site Visit</span>
                </div>
                <span class="action-btn-sub">Option 2 • Free Guided Tour</span>
              </button>
            </div>

            <!-- Privacy Guarantee -->
            <p class="hero-privacy-note">
              🔒 No spam • We respect your time & privacy • Authorized First Team advisory
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Interactive Same-Page Image Lightbox Modal -->
  <div id="hero-image-lightbox" class="hero-lightbox-overlay" style="display: none;">
    <div class="hero-lightbox-container">
      <div class="hero-lightbox-header">
        <div class="lightbox-info">
          <span id="lightbox-tag" class="lightbox-badge">Elevation</span>
          <h3 id="lightbox-title" class="lightbox-heading">Grand Entrance Gate & Iconic Sunset Towers</h3>
        </div>
        <div class="lightbox-actions">
          <span id="lightbox-counter" class="lightbox-count">1 / 8</span>
          <button type="button" id="lightbox-close-btn" class="lightbox-close" aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
      <div class="hero-lightbox-body">
        <button type="button" id="lightbox-prev-btn" class="lightbox-nav-btn prev" aria-label="Previous image">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.5" fill="none"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="lightbox-img-wrapper">
          <img id="lightbox-img" src="/assets/thumbs/prestige-entrance-gate.webp" alt="Preview Render" />
        </div>
        <button type="button" id="lightbox-next-btn" class="lightbox-nav-btn next" aria-label="Next image">
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.5" fill="none"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      <div class="lightbox-thumb-strip" id="lightbox-thumb-strip"></div>
    </div>
  </div>
</section>`,

  css: `/* ===== PRESTIGE THANE HERO SECTION STYLES ===== */
.prestige-hero-section {
  position: relative;
  padding: 3rem 1rem 4rem;
  background-color: #fbfbfc;
  color: #1e293b;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background-image: url('/assets/prestige-hero-bg.webp');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  pointer-events: none;
}

.hero-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 7fr 5fr;
    gap: 3rem;
  }
}

/* Left Column */
.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-rera-strip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  width: fit-content;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.hero-stars {
  color: #f59e0b;
}

.hero-rera-text {
  color: #0f172a;
  letter-spacing: 0.05em;
}

.hero-sep {
  color: #cbd5e1;
}

.hero-by-text {
  color: #d97706;
}

.hero-headings {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.hero-badge-tag {
  color: #d97706;
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-main-title {
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.hero-sub-title-1 {
  margin: 0.25rem 0 0;
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  font-weight: 700;
  color: #334155;
}

.hero-sub-title-2 {
  margin: 0.25rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.hero-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.hero-loc-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: #d97706;
  flex-shrink: 0;
}

.hero-description {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #475569;
  max-width: 600px;
}

/* 3-Col Highlights */
.hero-specs-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #ffffff;
  border: 1px solid rgba(245, 158, 11, 0.5);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 20px -2px rgba(245, 158, 11, 0.15);
  text-align: center;
}

.hero-spec-item:not(:last-child) {
  border-right: 1px solid rgba(245, 158, 11, 0.25);
}

.spec-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
}

.spec-value {
  display: block;
  font-size: clamp(1.15rem, 2vw, 1.5rem);
  font-weight: 900;
  color: #0f172a;
  margin-top: 0.25rem;
}

.spec-value.highlight {
  color: #d97706;
}

/* Architecture Preview Box */
.hero-preview-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.preview-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.preview-header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: 0.05em;
}

.preview-icon {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

.preview-header-link {
  font-size: 0.75rem;
  font-weight: 700;
  color: #d97706;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.15s;
}

.preview-header-link:hover {
  color: #b45309;
  text-decoration: underline;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.preview-thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preview-thumb:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.preview-thumb:hover img {
  transform: scale(1.08);
}

.thumb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
}

.thumb-tag {
  position: absolute;
  bottom: 0.25rem;
  left: 0.35rem;
  right: 0.35rem;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.thumb-zoom-icon {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 0.65rem;
  background: rgba(0,0,0,0.5);
  border-radius: 0.25rem;
  padding: 0.1rem 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.preview-thumb:hover .thumb-zoom-icon {
  opacity: 1;
}

/* CTA Group */
.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  padding-top: 0.5rem;
}

.btn-primary-site-visit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.6rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary-site-visit:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #ffffff;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
}

.btn-arrow {
  width: 1rem;
  height: 1rem;
}

.btn-secondary-brochure {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.6rem;
  background: #ffffff;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary-brochure:hover {
  border-color: #d97706;
  background: #fffbeb;
  color: #d97706;
  text-decoration: none;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

/* Trust Bullets */
.hero-trust-bullets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.trust-icon {
  width: 1rem;
  height: 1rem;
}

.trust-icon.text-green {
  color: #16a34a;
}

.trust-icon.text-gold {
  color: #d97706;
}

.trust-dot {
  color: #cbd5e1;
}

/* ===== Right Column: Form Card ===== */
.hero-form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.18), 0 0 20px rgba(0, 0, 0, 0.03);
  position: relative;
}

.form-logos-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.partner-badge {
  width: 72px;
  min-height: 64px;
  background: linear-gradient(180deg, #fbbf24, #d97706);
  border-radius: 0.75rem;
  border: 1px solid #fcd34d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.25rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
}

.badge-top {
  background: rgba(0, 0, 0, 0.85);
  color: #fde68a;
  font-size: 0.5rem;
  font-weight: 900;
  border-radius: 0.25rem;
  padding: 0.1rem;
  letter-spacing: 0.05em;
}

.badge-mid {
  font-size: 0.65rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.badge-bot {
  background: #ffffff;
  border-radius: 0.25rem;
  font-size: 0.55rem;
  font-weight: 800;
  color: #0f172a;
  padding: 0.1rem;
}

.badge-bot span {
  background: #000;
  color: #fbbf24;
  padding: 0 0.2rem;
  border-radius: 2px;
}

.presenting-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: radial-gradient(#94a3b8 1px, transparent 1px);
  background-size: 6px 6px;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.6rem 0.5rem;
}

.presenting-line {
  height: 1px;
  flex: 1;
  background: #cbd5e1;
}

.presenting-text {
  font-size: 0.65rem;
  font-weight: 900;
  color: #1e293b;
  letter-spacing: 0.25em;
  background: #ffffff;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
}

.prestige-logo-box {
  width: 72px;
  height: 64px;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.prestige-logo-box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.save-lacs-wrap {
  text-align: center;
  margin-bottom: 0.75rem;
}

.save-lacs-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  background: linear-gradient(90deg, #fffbeb, #fef3c7, #fffbeb);
  border: 1px solid #fcd34d;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #0f172a;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.save-lacs-pill:hover {
  transform: scale(1.02);
  color: #0f172a;
  text-decoration: none;
}

.sparkle {
  color: #d97706;
}

.vip-tag {
  background: #0f172a;
  color: #fde68a;
  font-size: 0.6rem;
  font-weight: 900;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}

.buyer-perks-ribbon {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.35rem 0.65rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #451a03;
  margin-bottom: 1rem;
}

.perk-item.green {
  color: #166534;
}

.perk-sep {
  color: #f59e0b;
}

.form-sub-header {
  text-align: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.85rem;
  margin-bottom: 1rem;
}

.form-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.form-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

/* Form inputs */
.hero-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-field label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
}

.required {
  color: #d97706;
}

.phone-input-wrap {
  display: flex;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #ffffff;
}

.phone-input-wrap:focus-within {
  border-color: #d97706;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.15);
}

.country-prefix {
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  padding: 0.65rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.phone-input-wrap input {
  flex: 1;
  border: none;
  padding: 0.65rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  font-weight: 600;
  color: #0f172a;
}

.form-field input[type="email"] {
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  font-weight: 600;
  color: #0f172a;
  background: #ffffff;
}

.form-field input[type="email"]:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.15);
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-hint {
  font-size: 0.6875rem;
  color: #94a3b8;
}

.config-pills {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
}

.config-pill {
  padding: 0.5rem 0.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.config-pill.active {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #78350f;
  font-weight: 800;
  box-shadow: 0 0 0 1px #f59e0b;
}

.action-buttons-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  margin-top: 0.25rem;
}

@media (min-width: 480px) {
  .action-buttons-wrap {
    flex-direction: row;
  }
}

.btn-whatsapp-action {
  flex: 1;
  padding: 0.65rem 0.5rem;
  background: #ffffff;
  border: 2px solid #10b981;
  border-radius: 0.65rem;
  color: #047857;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.15s ease;
}

.btn-whatsapp-action:hover {
  background: #ecfdf5;
  transform: translateY(-1px);
}

.btn-visit-action {
  flex: 1;
  padding: 0.65rem 0.5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  border-radius: 0.65rem;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  transition: all 0.15s ease;
}

.btn-visit-action:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  transform: translateY(-1px);
}

.action-btn-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 800;
}

.wa-icon {
  width: 1rem;
  height: 1rem;
  color: #10b981;
}

.visit-icon {
  width: 1rem;
  height: 1rem;
}

.action-btn-sub {
  font-size: 0.625rem;
  font-weight: 600;
  opacity: 0.9;
}

.action-btn-sub.green-sub {
  color: #059669;
}

.hero-privacy-note {
  margin: 0;
  text-align: center;
  font-size: 0.6875rem;
  color: #64748b;
  line-height: 1.4;
  padding-top: 0.25rem;
}

/* ===== SAME-PAGE IMAGE LIGHTBOX MODAL STYLES ===== */
.hero-lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 12, 22, 0.94);
  backdrop-filter: blur(12px);
  padding: 1rem;
}

.hero-lightbox-container {
  background: #ffffff;
  border-radius: 1.25rem;
  max-width: 920px;
  width: 100%;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: lightboxScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes lightboxScaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero-lightbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
}

.lightbox-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.lightbox-badge {
  background: #fef3c7;
  color: #92400e;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  width: fit-content;
  letter-spacing: 0.05em;
}

.lightbox-heading {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.lightbox-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lightbox-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
}

.lightbox-close {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s ease;
}

.lightbox-close:hover {
  background: #fee2e2;
  color: #ef4444;
  border-color: #fca5a5;
}

.hero-lightbox-body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  min-height: 360px;
  max-height: 65vh;
  padding: 0.75rem;
  user-select: none;
}

.lightbox-img-wrapper {
  max-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.lightbox-img-wrapper img {
  max-height: 60vh;
  max-width: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s ease;
}

.lightbox-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.92);
  border: none;
  border-radius: 50%;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0f172a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  transition: all 0.15s ease;
  z-index: 10;
}

.lightbox-nav-btn:hover {
  background: #ffffff;
  transform: translateY(-50%) scale(1.1);
  color: #d97706;
}

.lightbox-nav-btn.prev {
  left: 1rem;
}

.lightbox-nav-btn.next {
  right: 1rem;
}

.lightbox-thumb-strip {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.lightbox-mini-thumb {
  width: 64px;
  height: 46px;
  border-radius: 0.35rem;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  opacity: 0.6;
  flex-shrink: 0;
  transition: all 0.15s ease;
  background: #cbd5e1;
}

.lightbox-mini-thumb:hover {
  opacity: 0.9;
}

.lightbox-mini-thumb.active {
  border-color: #d97706;
  opacity: 1;
  transform: scale(1.05);
}

.lightbox-mini-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

`,

  js: `// Prestige Thane Interactive Configuration, Lead Capture & Same-Page Lightbox
(function() {
  let selectedConfig = '2 BHK';

  // 1. Config selector pills
  const pills = document.querySelectorAll('#config-selector .config-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', function() {
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      selectedConfig = this.getAttribute('data-cfg') || '2 BHK';
    });
  });

  // 2. Helper function to submit lead
  async function submitLead(actionType) {
    const phoneInput = document.getElementById('lead-phone');
    const emailInput = document.getElementById('lead-email');

    const phone = phoneInput ? phoneInput.value.replace(/\\D/g, '') : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      if (phoneInput) phoneInput.focus();
      return;
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0] || 'Homebuyer',
          phone: phone,
          email: email,
          configuration: selectedConfig,
          intent: actionType === 'whatsapp' ? 'Hero WhatsApp Info' : 'Hero Site Visit Booking',
          source: 'Prestige Thane Homepage Hero'
        })
      });
    } catch (e) {
      console.warn('Lead capture notification:', e);
    }

    if (actionType === 'whatsapp') {
      const waNumber = '919022222448';
      const msg = encodeURIComponent('Hi Prestige Sales Desk, I would like to get complete project details, pricing, and floor plans for ' + selectedConfig + ' at Prestige Thane. My email is ' + email + '.');
      window.open('https://api.whatsapp.com/send?phone=' + waNumber + '&text=' + msg, '_blank');
    } else {
      alert('Thank you! Your Site Visit for ' + selectedConfig + ' at Prestige Thane has been registered. Our Prestige representative will contact you shortly on +91 ' + phone + '.');
      if (phoneInput) phoneInput.value = '';
      if (emailInput) emailInput.value = '';
    }
  }

  // WhatsApp Button
  const waBtn = document.getElementById('hero-whatsapp-btn');
  if (waBtn) {
    waBtn.addEventListener('click', function() {
      submitLead('whatsapp');
    });
  }

  // Site Visit Button
  const visitBtn = document.getElementById('hero-submit-visit-btn');
  if (visitBtn) {
    visitBtn.addEventListener('click', function() {
      submitLead('visit');
    });
  }

  // ==========================================
  // 3. SAME-PAGE INTERACTIVE LIGHTBOX GALLERY
  // ==========================================
  const renders = [
    {
      title: 'Grand Entrance Gate & Iconic Sunset Towers',
      tag: 'Elevation',
      src: '/assets/thumbs/prestige-entrance-gate.webp'
    },
    {
      title: 'Resort-Style Swimming Pool & Aqua Deck',
      tag: 'Aqua Deck',
      src: '/assets/thumbs/prestige-aerial-lifestyle.webp'
    },
    {
      title: 'Grand Lifestyle Clubhouse & Fitness Hub',
      tag: 'Clubhouse',
      src: '/assets/thumbs/prestige-luxury-living-view.webp'
    },
    {
      title: 'Luxury Living & Balcony Panorama',
      tag: 'Residences',
      src: '/assets/thumbs/prestige-luxury-living-view.webp'
    },
    {
      title: 'Aerial Master Township View across 30+ Acres',
      tag: 'Master Plan',
      src: '/assets/prestige-hero-bg.webp'
    },
    {
      title: 'Lush Landscaped Central Boulevard & Green Walkways',
      tag: 'Boulevard',
      src: '/assets/thumbs/prestige-entrance-gate.webp'
    },
    {
      title: 'Olympic-Sized Lap Pool & Sun Deck',
      tag: 'Lap Pool',
      src: '/assets/thumbs/prestige-aerial-lifestyle.webp'
    },
    {
      title: 'Skyline Terrace Lounge with Sunset Views',
      tag: 'Sky Lounge',
      src: '/assets/prestige-hero-bg.webp'
    }
  ];

  let currentIndex = 0;
  const lightbox = document.getElementById('hero-image-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbTitle = document.getElementById('lightbox-title');
  const lbTag = document.getElementById('lightbox-tag');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbStrip = document.getElementById('lightbox-thumb-strip');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  // Populate mini thumbnail strip in lightbox
  if (lbStrip && lbStrip.children.length === 0) {
    renders.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'lightbox-mini-thumb' + (idx === 0 ? ' active' : '');
      thumb.innerHTML = '<img src="' + item.src + '" alt="' + item.tag + '" />';
      thumb.addEventListener('click', function(e) {
        e.stopPropagation();
        openLightbox(idx);
      });
      lbStrip.appendChild(thumb);
    });
  }

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    if (currentIndex < 0) currentIndex = renders.length - 1;
    if (currentIndex >= renders.length) currentIndex = 0;

    const item = renders[currentIndex];
    if (lbImg) lbImg.src = item.src;
    if (lbTitle) lbTitle.textContent = item.title;
    if (lbTag) lbTag.textContent = item.tag;
    if (lbCounter) lbCounter.textContent = (currentIndex + 1) + ' / ' + renders.length;

    // Highlight mini thumb
    if (lbStrip) {
      const thumbs = lbStrip.querySelectorAll('.lightbox-mini-thumb');
      thumbs.forEach((t, i) => {
        if (i === currentIndex) {
          t.classList.add('active');
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          t.classList.remove('active');
        }
      });
    }

    if (lightbox && lightbox.parentElement !== document.body) {
      document.body.appendChild(lightbox);
    }
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Thumbnails click on hero section to open lightbox on same page
  const thumbs = document.querySelectorAll('.preview-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
  });

  // "View All 8 Renders ->" button opens lightbox at index 0 on same page
  const viewAllBtn = document.getElementById('hero-view-all-renders');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(0);
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Click outside dialog to close
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Prev / Next buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox(currentIndex + 1);
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightbox();
      closeEarlyModal();
    }
    if (!lightbox || lightbox.style.display === 'none') return;
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
  });
})();`,
};
