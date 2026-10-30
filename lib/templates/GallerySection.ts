export const GALLERY_SECTION_TEMPLATE = {
  title: 'Architecture & Township Visuals',
  slug: 'gallery',
  status: 'published',
  seo_title: 'Architecture & Township Gallery | Prestige Thane',
  meta_description: 'Explore 8+ official architectural elevations, master clubhouse amenities, lush central green spine, and luxury sky deck views of Prestige Thane.',
  meta_keywords: 'Prestige Thane gallery, architectural renders, grand entrance gate, luxury clubhouse, elevation view, sky deck views',

  html: `<section class="gallery-section font-sans scroll-mt-20" id="gallery">
  <div class="gallery-container">
    
    <!-- Section Header -->
    <div class="gallery-header-center">
      <div class="gallery-pre-title">
        <span class="gallery-line"></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="camera-icon">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
        <span>ARCHITECTURE &amp; TOWNSHIP GALLERY</span>
        <span class="gallery-line"></span>
      </div>

      <h2 class="gallery-main-title">
        Township &amp; Architectural <span class="gallery-highlight">Visuals</span>
      </h2>

      <p class="gallery-subtitle">
        Explore 8+ official architectural elevations, master clubhouse facilities, grand arrival boulevards, and expansive sky-deck living spaces planned for Prestige Thane.
      </p>

      <!-- Compliance Info Pill -->
      <div class="gallery-info-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-icon">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Official 3D Renderings &amp; Master Visualizations • Click any render for high-res view</span>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="gallery-tabs-wrap">
      <button type="button" class="gallery-tab-btn active" data-tab="all">All Renders (9)</button>
      <button type="button" class="gallery-tab-btn" data-tab="elevation">Elevation &amp; Entrance</button>
      <button type="button" class="gallery-tab-btn" data-tab="clubhouse">Clubhouse &amp; Leisure</button>
      <button type="button" class="gallery-tab-btn" data-tab="residence">Living Spaces</button>
      <button type="button" class="gallery-tab-btn" data-tab="landscape">Green Landscapes</button>
    </div>

    <!-- Gallery Grid -->
    <div class="gallery-grid" id="gallery-grid">
      
      <!-- ITEM 0 -->
      <div class="gallery-card group" data-category="elevation" data-idx="0">
        <div class="gallery-card-img-wrap">
          <img
            src="/assets/prestige_thane_gate_1790246596742.jpg"
            alt="Grand Entrance Gate &amp; Iconic Sunset Towers"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Grand Landmark Gate</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Elevation &amp; Entrance</span>
            <h3 class="gallery-card-title">Grand Entrance Gate &amp; Iconic Sunset Towers</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 1 -->
      <div class="gallery-card group" data-category="clubhouse" data-idx="1">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g2.jpg"
            alt="Resort-Style Swimming Pool &amp; Aqua Deck"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Clubhouse Amenities</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Clubhouse &amp; Leisure</span>
            <h3 class="gallery-card-title">Resort-Style Swimming Pool &amp; Aqua Deck</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 2 -->
      <div class="gallery-card group" data-category="clubhouse" data-idx="2">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g3.jpg"
            alt="Grand Lifestyle Clubhouse &amp; Fitness Hub"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Grand Clubhouse</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Clubhouse &amp; Leisure</span>
            <h3 class="gallery-card-title">Grand Lifestyle Clubhouse &amp; Fitness Hub</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 3 -->
      <div class="gallery-card group" data-category="elevation" data-idx="3">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g4.jpg"
            alt="Opulent Triple-Height Entrance Lobby"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Grand Entrance Lobby</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Elevation &amp; Entrance</span>
            <h3 class="gallery-card-title">Opulent Triple-Height Entrance Lobby</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 4 -->
      <div class="gallery-card group" data-category="residence" data-idx="4">
        <div class="gallery-card-img-wrap">
          <img
            src="/assets/prestige_luxury_living_1790246859380.jpg"
            alt="Luxury Living &amp; Balcony Panorama"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-luxury-living-view.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Residence Sky Deck</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Living Spaces</span>
            <h3 class="gallery-card-title">Luxury Living &amp; Balcony Panorama</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 5 -->
      <div class="gallery-card group" data-category="landscape" data-idx="5">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g6.jpg"
            alt="Lush Landscaped Central Green Park"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Central Green Spine</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Landscape &amp; Vistas</span>
            <h3 class="gallery-card-title">Lush Landscaped Central Green Park</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 6 -->
      <div class="gallery-card group" data-category="elevation" data-idx="6">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/virtual-tour.jpg"
            alt="Township 360° Panoramic Overview"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Master Township View</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Elevation &amp; Entrance</span>
            <h3 class="gallery-card-title">Township 360° Panoramic Overview</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 7 -->
      <div class="gallery-card group" data-category="landscape" data-idx="7">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/banner2.jpg"
            alt="Evening Illumination &amp; Skyline View"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Twilight Vista</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Landscape &amp; Vistas</span>
            <h3 class="gallery-card-title">Evening Illumination &amp; Skyline View</h3>
          </div>
        </div>
      </div>

      <!-- ITEM 8 -->
      <div class="gallery-card group" data-category="landscape" data-idx="8">
        <div class="gallery-card-img-wrap">
          <img
            src="https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/banner3.jpg"
            alt="Panoramic Yeoor Hills Backdrop"
            width="600"
            height="450"
            loading="lazy"
            decoding="async"
            class="gallery-card-img"
            onerror="this.src='/assets/thumbs/prestige-entrance-gate.webp'"
          />
          <div class="gallery-card-overlay"></div>
          
          <div class="gallery-card-top-tags">
            <span class="gallery-badge-label">Scenic Hill Vista</span>
            <span class="gallery-zoom-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>

          <div class="gallery-card-bottom-info">
            <span class="gallery-card-cat">Landscape &amp; Vistas</span>
            <h3 class="gallery-card-title">Panoramic Yeoor Hills Backdrop</h3>
          </div>
        </div>
      </div>

    </div>

    <!-- Action Prompt Banner -->
    <div class="gallery-action-banner">
      <div class="action-banner-text">
        <h4 class="action-banner-title">
          Want the Complete Architectural Dossier &amp; HD Renders?
        </h4>
        <p class="action-banner-desc">
          Receive the high-resolution master layout brochure, tower elevations, and unit-level views on WhatsApp &amp; Email.
        </p>
      </div>

      <div class="action-banner-btns">
        <a href="#early-access" class="gallery-download-btn" data-modal="early-access" data-modal-title="Download Official HD Renders &amp; Dossier" data-modal-source="gallery_hd_dossier">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download HD Renders (PDF)</span>
        </a>
        <a href="#early-access" class="gallery-visit-btn" data-modal="early-access" data-modal-title="Visit Experience Centre &amp; 3D Model" data-modal-source="gallery_experience_center">
          <span>Visit Experience Centre</span>
        </a>
      </div>
    </div>

  </div>

  <!-- Full-Screen Lightbox Modal -->
  <div id="gallery-fullscreen-modal" class="gallery-lightbox" style="display: none;">
    <button type="button" class="gallery-modal-close-btn" id="gallery-modal-close-btn" aria-label="Close Lightbox">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <button type="button" class="lightbox-nav-btn prev" id="gallery-modal-prev-btn" aria-label="Previous Image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

    <button type="button" class="lightbox-nav-btn next" id="gallery-modal-next-btn" aria-label="Next Image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <div class="lightbox-content-box" id="lightbox-content-box">
      <div class="lightbox-img-frame">
        <img id="gallery-modal-active-img" src="" alt="Active Render" class="gallery-modal-active-img" />
        <div class="gallery-modal-tag-overlay" id="gallery-modal-tag-overlay">Grand Landmark Gate</div>
      </div>

      <div class="lightbox-caption-bar">
        <div class="lightbox-caption-left">
          <div class="lightbox-meta-row">
            <span class="gallery-modal-cat" id="gallery-modal-cat">Elevation &amp; Entrance</span>
            <span class="lightbox-sep">•</span>
            <span class="gallery-modal-counter" id="gallery-modal-counter">Render 1 of 9</span>
          </div>
          <h4 class="gallery-modal-title" id="gallery-modal-title">Grand Entrance Gate &amp; Iconic Sunset Towers</h4>
          <p class="gallery-modal-desc" id="gallery-modal-desc">Iconic monumental gatehouse with lush green landscape boulevard.</p>
        </div>

        <a href="#early-access" class="gallery-modal-enquire-btn" id="gallery-modal-enquire-btn" data-modal="early-access" data-modal-title="Inquire About Architectural Render" data-modal-source="lightbox_render_enquire">
          <span>Enquire Now</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>`,

  css: `/* ===== ARCHITECTURE & TOWNSHIP GALLERY SECTION STYLES ===== */
.gallery-section {
  padding: 4rem 1rem 6rem;
  background-color: #ffffff;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.gallery-section * {
  box-sizing: border-box;
}

.gallery-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0.75rem;
}

@media (min-width: 640px) {
  .gallery-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .gallery-container {
    padding: 0 2rem;
  }
}

/* SECTION HEADER */
.gallery-header-center {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .gallery-header-center {
    margin-bottom: 3rem;
  }
}

.gallery-pre-title {
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

.gallery-line {
  width: 1.5rem;
  height: 1px;
  background-color: #fcd34d;
}

.camera-icon {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

.gallery-main-title {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .gallery-main-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .gallery-main-title {
    font-size: 3rem;
  }
}

.gallery-highlight {
  color: #d97706;
}

.gallery-subtitle {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #475569;
  font-weight: 500;
  max-width: 42rem;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .gallery-subtitle {
    font-size: 1rem;
  }
}

.gallery-info-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  width: fit-content;
  margin: 0.5rem auto 0;
}

.info-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #d97706;
  flex-shrink: 0;
}

/* CATEGORY TABS */
.gallery-tabs-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .gallery-tabs-wrap {
    margin-bottom: 2.5rem;
  }
}

.gallery-tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
}

@media (min-width: 640px) {
  .gallery-tab-btn {
    font-size: 0.875rem;
  }
}

.gallery-tab-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.gallery-tab-btn.active {
  background-color: #d97706;
  color: #ffffff;
  border-color: #d97706;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25);
}

/* CARDS GRID */
.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.gallery-card {
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background-color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
}

.gallery-card:hover {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.gallery-card-img-wrap {
  position: relative;
  height: 16rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .gallery-card-img-wrap {
    height: 18rem;
  }
}

.gallery-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  transition: transform 0.7s ease-out, opacity 0.3s ease;
}

.gallery-card:hover .gallery-card-img {
  transform: scale(1.08);
  opacity: 1;
}

.gallery-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.3) 50%, transparent 100%);
  pointer-events: none;
}

.gallery-card-top-tags {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
}

.gallery-badge-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  color: #fde047;
  padding: 0.25rem 0.6rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.gallery-zoom-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: #fde047;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gallery-card:hover .gallery-zoom-circle {
  opacity: 1;
}

.gallery-zoom-circle svg {
  width: 1rem;
  height: 1rem;
}

.gallery-card-bottom-info {
  position: absolute;
  bottom: 0.75rem;
  left: 1rem;
  right: 1rem;
  z-index: 5;
}

.gallery-card-cat {
  font-size: 0.625rem;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.25rem;
}

.gallery-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  transition: color 0.2s ease;
}

.gallery-card:hover .gallery-card-title {
  color: #fef08a;
}

/* ACTION BANNER */
.gallery-action-banner {
  margin-top: 3rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: #FAF9F5;
  border: 1px solid rgba(253, 230, 138, 0.8);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .gallery-action-banner {
    flex-direction: row;
    align-items: center;
    padding: 2rem;
  }
}

.action-banner-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

@media (min-width: 768px) {
  .action-banner-text {
    text-align: left;
  }
}

.action-banner-title {
  font-size: 1.125rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0;
}

@media (min-width: 640px) {
  .action-banner-title {
    font-size: 1.25rem;
  }
}

.action-banner-desc {
  font-size: 0.75rem;
  color: #475569;
  margin: 0;
}

@media (min-width: 640px) {
  .action-banner-desc {
    font-size: 0.875rem;
  }
}

.action-banner-btns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.gallery-download-btn {
  padding: 0.75rem 1.25rem;
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
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
  transition: all 0.2s ease;
  cursor: pointer;
}

.gallery-download-btn:hover {
  background: linear-gradient(to right, #d97706, #b45309);
  transform: translateY(-1px);
}

.gallery-download-btn svg {
  width: 1rem;
  height: 1rem;
}

.gallery-visit-btn {
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #1e293b;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.gallery-visit-btn:hover {
  background-color: #f1f5f9;
}

/* ========================================================================= */
/* LIGHTBOX MODAL */
/* ========================================================================= */
.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  user-select: none;
}

.gallery-modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.gallery-modal-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.gallery-modal-close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.lightbox-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}

.lightbox-nav-btn.prev {
  left: 1rem;
}

.lightbox-nav-btn.next {
  right: 1rem;
}

@media (min-width: 640px) {
  .lightbox-nav-btn.prev {
    left: 2rem;
  }
  .lightbox-nav-btn.next {
    right: 2rem;
  }
}

.lightbox-nav-btn:hover {
  background-color: #d97706;
}

.lightbox-nav-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.lightbox-content-box {
  max-width: 64rem;
  width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lightbox-img-frame {
  position: relative;
  width: 100%;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.gallery-modal-active-img {
  max-height: 70vh;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  border-radius: 0.75rem;
}

.gallery-modal-tag-overlay {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fde047;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.lightbox-caption-bar {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0.5rem;
  color: #ffffff;
}

@media (min-width: 640px) {
  .lightbox-caption-bar {
    flex-direction: row;
  }
}

.lightbox-caption-left {
  text-align: center;
}

@media (min-width: 640px) {
  .lightbox-caption-left {
    text-align: left;
  }
}

.lightbox-meta-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

@media (min-width: 640px) {
  .lightbox-meta-row {
    justify-content: flex-start;
  }
}

.gallery-modal-cat {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.lightbox-sep {
  color: #94a3b8;
  font-size: 0.75rem;
}

.gallery-modal-counter {
  font-size: 0.75rem;
  font-weight: 500;
  color: #cbd5e1;
}

.gallery-modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

@media (min-width: 640px) {
  .gallery-modal-title {
    font-size: 1.25rem;
  }
}

.gallery-modal-desc {
  font-size: 0.75rem;
  color: #cbd5e1;
  max-width: 42rem;
  margin: 0.25rem 0 0;
  line-height: 1.4;
}

.gallery-modal-enquire-btn {
  padding: 0.65rem 1.25rem;
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
  gap: 0.35rem;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
  transition: all 0.2s ease;
  flex-shrink: 0;
  cursor: pointer;
}

.gallery-modal-enquire-btn:hover {
  background: linear-gradient(to right, #d97706, #b45309);
  transform: translateY(-1px);
}

.gallery-modal-enquire-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}
`,

  js: `// Gallery Filter Tabs & Fullscreen Lightbox Modal
(function() {
  const galleryItems = [
    {
      title: 'Grand Entrance Gate & Iconic Sunset Towers',
      category: 'Elevation & Entrance',
      categorySlug: 'elevation',
      label: 'Grand Landmark Gate',
      image: '/assets/prestige_thane_gate_1790246596742.jpg',
      description: 'Iconic monumental gatehouse with lush green landscape boulevard and soaring residential towers illuminated against the sunset.',
    },
    {
      title: 'Resort-Style Swimming Pool & Aqua Deck',
      category: 'Clubhouse & Leisure',
      categorySlug: 'clubhouse',
      label: 'Clubhouse Amenities',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g2.jpg',
      description: 'Olympic-length temperature-controlled infinity swimming pool, cabana relaxation deck, and kids splash pool.',
    },
    {
      title: 'Grand Lifestyle Clubhouse & Fitness Hub',
      category: 'Clubhouse & Leisure',
      categorySlug: 'clubhouse',
      label: 'Grand Clubhouse',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g3.jpg',
      description: 'Multi-level clubhouse with state-of-the-art gymnasium, badminton courts, squash, yoga studio, and banquet pavilion.',
    },
    {
      title: 'Opulent Triple-Height Entrance Lobby',
      category: 'Elevation & Entrance',
      categorySlug: 'elevation',
      label: 'Grand Entrance Lobby',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g4.jpg',
      description: 'Grand designer arrival lobby finished in imported Italian marble, high ceilings, concierge desk, and guest lounge.',
    },
    {
      title: 'Luxury Living & Balcony Panorama',
      category: 'Living Spaces',
      categorySlug: 'residence',
      label: 'Residence Sky Deck',
      image: '/assets/prestige_luxury_living_1790246859380.jpg',
      description: 'Sprawling living room flowing seamlessly onto an expansive landscaped sky deck overlooking the Yeoor Hills and city skyline.',
    },
    {
      title: 'Lush Landscaped Central Green Park',
      category: 'Landscape & Vistas',
      categorySlug: 'landscape',
      label: 'Central Green Spine',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/g6.jpg',
      description: 'A 30+ acre master township planning with 80% open spaces, themed walking trails, botanical pavilions, and reflexology paths.',
    },
    {
      title: 'Township 360° Panoramic Overview',
      category: 'Elevation & Entrance',
      categorySlug: 'elevation',
      label: 'Master Township View',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/virtual-tour.jpg',
      description: 'Bird-eye master plan render showing seamless podium connectivity, vehicular-free zones, and high-rise luxury towers.',
    },
    {
      title: 'Evening Illumination & Skyline View',
      category: 'Landscape & Vistas',
      categorySlug: 'landscape',
      label: 'Twilight Vista',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/banner2.jpg',
      description: 'Dramatic architectural facade lighting creating a distinguished landmark skyline presence across Thane West.',
    },
    {
      title: 'Panoramic Yeoor Hills Backdrop',
      category: 'Landscape & Vistas',
      categorySlug: 'landscape',
      label: 'Scenic Hill Vista',
      image: 'https://prestige-new-projects.com/prestige-thane-west-mumbai/assets/images/banner3.jpg',
      description: 'Unhindered panoramic views of Sanjay Gandhi National Park & Yeoor Hills foliage from upper-level residences.',
    },
  ];

  // 1. Tab Filtering
  const tabBtns = document.querySelectorAll('.gallery-tab-btn');
  const cards = document.querySelectorAll('.gallery-card');

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const targetTab = this.getAttribute('data-tab');

      cards.forEach(function(card) {
        if (targetTab === 'all' || card.getAttribute('data-category') === targetTab) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 2. Lightbox Modal Logic
  let currentIdx = 0;
  const modal = document.getElementById('gallery-fullscreen-modal');
  const closeBtn = document.getElementById('gallery-modal-close-btn');
  const prevBtn = document.getElementById('gallery-modal-prev-btn');
  const nextBtn = document.getElementById('gallery-modal-next-btn');
  const activeImg = document.getElementById('gallery-modal-active-img');
  const tagOverlay = document.getElementById('gallery-modal-tag-overlay');
  const catEl = document.getElementById('gallery-modal-cat');
  const counterEl = document.getElementById('gallery-modal-counter');
  const titleEl = document.getElementById('gallery-modal-title');
  const descEl = document.getElementById('gallery-modal-desc');
  const enquireBtn = document.getElementById('gallery-modal-enquire-btn');

  function openLightbox(idx) {
    currentIdx = idx;
    updateLightbox();
    if (modal) modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = galleryItems[currentIdx];
    if (!item) return;

    if (activeImg) {
      activeImg.src = item.image;
      activeImg.alt = item.title;
    }
    if (tagOverlay) tagOverlay.textContent = item.label;
    if (catEl) catEl.textContent = item.category;
    if (counterEl) counterEl.textContent = 'Render ' + (currentIdx + 1) + ' of ' + galleryItems.length;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.description || '';
    if (enquireBtn) {
      enquireBtn.setAttribute('data-modal-title', 'Inquire About: ' + item.title);
      enquireBtn.setAttribute('data-modal-source', 'lightbox_render_' + currentIdx);
    }
  }

  function nextImage() {
    currentIdx = (currentIdx + 1) % galleryItems.length;
    updateLightbox();
  }

  function prevImage() {
    currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  // Event Listeners for Cards
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-idx') || '0', 10);
      openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', function(e) {
    if (!modal || modal.style.display === 'none') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
})();
`,
};

