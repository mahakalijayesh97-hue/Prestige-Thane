export const LOCATION_SECTION_TEMPLATE = {
  title: 'Strategic Location & Connectivity',
  slug: 'location',
  status: 'published',
  seo_title: 'Strategic Location & Connectivity | Prestige Thane',
  meta_description: 'Prestige Thane at Kapurbawadi, Balkum: 2 mins from Metro Line 4 & 5, 5 mins from EEH, Viviana Mall, top schools & hospitals. Book free site visit with AC cab pickup.',
  meta_keywords: 'Prestige Thane location, Kapurbawadi junction, Balkum Thane West, Metro Line 4, Viviana Mall, Jupiter Hospital, site visit cab',

  html: `<section class="location-section font-sans" id="location">
  <div class="location-container">
    
    <!-- Section Header -->
    <div class="loc-header-center">
      <div class="loc-pre-title">
        <span class="loc-line"></span>
        <span>STRATEGIC LOCATION</span>
        <span class="loc-line"></span>
      </div>

      <h2 class="loc-main-title">
        Connected to Everything That Matters
      </h2>

      <p class="loc-subtitle">
        Situated at Kapurbawadi, Balkum, Thane West — enjoy fast access to business hubs, top schools, hospitals, and entertainment.
      </p>
    </div>

    <div class="loc-grid-container">
      
      <!-- Left Column: Interactive Map Preview -->
      <div class="loc-left-col">
        <div class="loc-map-wrapper group" id="loc-map-container">
          <!-- Static Interactive Placeholder (Loads iframe on click) -->
          <div class="loc-map-placeholder" id="loc-map-placeholder">
            <!-- Stylized vector map background -->
            <svg class="loc-map-bg-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="loc-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f59e0b" stroke-width="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#loc-grid-pattern)" />
              <line x1="0" y1="120" x2="600" y2="280" stroke="#f59e0b" stroke-width="3" opacity="0.6" />
              <line x1="80" y1="0" x2="380" y2="450" stroke="#38bdf8" stroke-width="2.5" opacity="0.6" />
              <circle cx="280" cy="210" r="30" fill="#f59e0b" opacity="0.15" />
            </svg>

            <!-- Pulsing Location Pin & CTA -->
            <div class="loc-placeholder-content">
              <div class="loc-pin-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="loc-pin-icon">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>

              <div class="loc-placeholder-text">
                <span class="loc-area-tag">KAPURBAWADI, THANE WEST</span>
                <h4 class="loc-map-heading">Interactive Google Map</h4>
                <p class="loc-map-desc">
                  Click to explore live satellite map, transit routes, and surrounding infrastructure.
                </p>
              </div>

              <button type="button" class="loc-load-map-btn" id="loc-load-map-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Load Interactive Map</span>
              </button>
            </div>
          </div>

          <!-- Pin badge overlay -->
          <div class="loc-pin-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Prestige Thane, Kapurbawadi</span>
          </div>
        </div>

        <!-- Directions Help Bar -->
        <div class="loc-directions-bar">
          <span>Looking for driving directions or site location assistance?</span>
          <a href="#early-access" class="loc-directions-btn" data-modal="early-access" data-modal-title="Request Live GPS Location &amp; Driving Route" data-modal-source="location_directions">
            <span>Get Route</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>

      <!-- Right Column: Category Tabs and Landmark Cards -->
      <div class="loc-right-col">
        <!-- Category Tabs -->
        <div class="loc-tabs-grid">
          <button type="button" class="loc-tab-btn active" data-tab="transit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></svg>
            <span>Connectivity</span>
          </button>
          <button type="button" class="loc-tab-btn" data-tab="education">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 3.18a2 2 0 0 0-1.66 0L2.6 10.084a1 1 0 0 0 0 1.832l8.57 6.904a2 2 0 0 0 1.66 0l6.71-5.406"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
            <span>Education</span>
          </button>
          <button type="button" class="loc-tab-btn" data-tab="healthcare">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
            <span>Healthcare</span>
          </button>
          <button type="button" class="loc-tab-btn" data-tab="entertainment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Malls &amp; Retail</span>
          </button>
        </div>

        <!-- Landmarks List Container -->
        <div class="loc-landmarks-list" id="loc-landmarks-list">
          
          <!-- TRANSIT ITEMS (Active by default) -->
          <div class="loc-landmark-group" data-category="transit">
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Upcoming Metro Line 4 &amp; 5 (Kapurbawadi / Balkum)</h3>
                <p class="loc-landmark-desc">Direct fast transit connecting Wadala, Ghatkopar, Thane &amp; Kalyan</p>
              </div>
              <span class="loc-time-badge">2 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Kapurbawadi Junction &amp; Ghodbunder Road</h3>
                <p class="loc-landmark-desc">Arterial intersection connecting Western and Eastern suburbs</p>
              </div>
              <span class="loc-time-badge">3 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Eastern Express Highway (EEH)</h3>
                <p class="loc-landmark-desc">Signal-free expressway to BKC, Powai &amp; South Mumbai</p>
              </div>
              <span class="loc-time-badge">5 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Thane Railway Station</h3>
                <p class="loc-landmark-desc">Central &amp; Harbour railway junction with fast suburban trains</p>
              </div>
              <span class="loc-time-badge">12 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">BKC Financial Center via EEH / SCLR</h3>
                <p class="loc-landmark-desc">Direct freeway transit to Mumbai premier business hub</p>
              </div>
              <span class="loc-time-badge">35 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Chhatrapati Shivaji Maharaj Intl. Airport</h3>
                <p class="loc-landmark-desc">Seamless expressway drive via JVLR / SCLR</p>
              </div>
              <span class="loc-time-badge">45 Mins</span>
            </div>
          </div>

          <!-- EDUCATION ITEMS -->
          <div class="loc-landmark-group" data-category="education" style="display: none;">
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">C.P. Goenka International School</h3>
                <p class="loc-landmark-desc">Renowned IGCSE &amp; IB World school campus</p>
              </div>
              <span class="loc-time-badge">3 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Lodha World School</h3>
                <p class="loc-landmark-desc">Top-ranked ICSE &amp; CBSE academic institution</p>
              </div>
              <span class="loc-time-badge">7 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Smt. Sunitidevi Singhania School</h3>
                <p class="loc-landmark-desc">Ranked #1 ICSE school in Maharashtra</p>
              </div>
              <span class="loc-time-badge">12 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Universal High School</h3>
                <p class="loc-landmark-desc">State-of-the-art modern K-12 learning campus</p>
              </div>
              <span class="loc-time-badge">10 Mins</span>
            </div>
          </div>

          <!-- HEALTHCARE ITEMS -->
          <div class="loc-landmark-group" data-category="healthcare" style="display: none;">
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Titan Hospital</h3>
                <p class="loc-landmark-desc">24/7 multi-speciality tertiary &amp; emergency trauma center</p>
              </div>
              <span class="loc-time-badge">5 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Jupiter Hospital</h3>
                <p class="loc-landmark-desc">NABH-accredited 375+ bed multi-organ healthcare facility</p>
              </div>
              <span class="loc-time-badge">7 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Bethany Hospital</h3>
                <p class="loc-landmark-desc">Premier super-specialty cardiac &amp; oncology center</p>
              </div>
              <span class="loc-time-badge">10 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Currae Specialty Hospital</h3>
                <p class="loc-landmark-desc">Boutique surgical, orthopaedic &amp; maternity hospital</p>
              </div>
              <span class="loc-time-badge">8 Mins</span>
            </div>
          </div>

          <!-- ENTERTAINMENT ITEMS -->
          <div class="loc-landmark-group" data-category="entertainment" style="display: none;">
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Viviana Mall &amp; Cinepolis VIP IMAX</h3>
                <p class="loc-landmark-desc">MMR premier shopping, dining &amp; entertainment hub (250+ brands)</p>
              </div>
              <span class="loc-time-badge">7 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Korum Mall</h3>
                <p class="loc-landmark-desc">High-street international retail, hypermarket &amp; food court</p>
              </div>
              <span class="loc-time-badge">10 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">Namo Grand Central Park (20.5 Acres)</h3>
                <p class="loc-landmark-desc">India’s largest botanical urban park with lake &amp; themed gardens</p>
              </div>
              <span class="loc-time-badge">5 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">ISKCON Temple Thane</h3>
                <p class="loc-landmark-desc">Spiritual cultural landmark &amp; serene green campus</p>
              </div>
              <span class="loc-time-badge">2 Mins</span>
            </div>
            <div class="loc-landmark-card">
              <div>
                <h3 class="loc-landmark-name">R Mall &amp; D-Mart Superstore</h3>
                <p class="loc-landmark-desc">Daily essentials, family shopping &amp; multiplex theatre</p>
              </div>
              <span class="loc-time-badge">8 Mins</span>
            </div>
          </div>

        </div>

        <!-- Site Visit CTA Button -->
        <div class="loc-cta-wrap">
          <a href="#early-access" class="loc-cab-cta-btn" data-modal="early-access" data-modal-title="Book Free Cab Pickup for Site Visit" data-modal-source="location_cta">
            <span>Book Free Site Visit with AC Cab Service</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>

    </div>

  </div>
</section>`,

  css: `/* ===== STRATEGIC LOCATION SECTION STYLES ===== */
.location-section {
  padding: 3.5rem 1rem 5rem;
  background-color: #ffffff;
  border-top: 1px solid #f1f5f9;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.location-section * {
  box-sizing: border-box;
}

.location-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0.75rem;
}

@media (min-width: 640px) {
  .location-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .location-container {
    padding: 0 2rem;
  }
}

/* SECTION HEADER */
.loc-header-center {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .loc-header-center {
    margin-bottom: 3.5rem;
  }
}

.loc-pre-title {
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

.loc-line {
  width: 1.5rem;
  height: 1px;
  background-color: #fcd34d;
}

.loc-main-title {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .loc-main-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .loc-main-title {
    font-size: 3rem;
  }
}

.loc-subtitle {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.6;
}

@media (min-width: 640px) {
  .loc-subtitle {
    font-size: 1rem;
  }
}

/* 2-COLUMN GRID */
.loc-grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: flex-start;
}

@media (min-width: 1024px) {
  .loc-grid-container {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

/* LEFT COLUMN: MAP */
.loc-left-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loc-map-wrapper {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  height: 400px;
  background-color: #0f172a;
}

@media (min-width: 640px) {
  .loc-map-wrapper {
    height: 450px;
  }
}

.loc-map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: #0f172a;
  user-select: none;
}

.loc-map-bg-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
}

.loc-placeholder-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.loc-pin-circle {
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background-color: rgba(245, 158, 11, 0.2);
  border: 2px solid #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
  transition: transform 0.2s ease;
}

.loc-map-wrapper:hover .loc-pin-circle {
  transform: scale(1.1);
}

.loc-pin-icon {
  width: 2rem;
  height: 2rem;
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.loc-placeholder-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: center;
}

.loc-area-tag {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #fde047;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.loc-map-heading {
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0.25rem 0 0;
}

@media (min-width: 640px) {
  .loc-map-heading {
    font-size: 1.25rem;
  }
}

.loc-map-desc {
  color: #cbd5e1;
  font-size: 0.75rem;
  max-width: 20rem;
  margin: 0;
  line-height: 1.4;
}

.loc-load-map-btn {
  margin-top: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.loc-load-map-btn:hover {
  background: linear-gradient(to right, #d97706, #b45309);
  transform: translateY(-1px);
}

.loc-load-map-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.loc-pin-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 0.5rem 0.85rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  z-index: 10;
}

.loc-pin-badge svg {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

.loc-pin-badge span {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
}

.loc-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* DIRECTIONS BAR */
.loc-directions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: #FAF9F5;
  border: 1px solid #e2e8f0;
  font-size: 0.75rem;
  color: #475569;
}

.loc-directions-btn {
  font-weight: 700;
  color: #d97706;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.loc-directions-btn:hover {
  color: #b45309;
  text-decoration: underline;
}

.loc-directions-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* RIGHT COLUMN: TABS & CARDS */
.loc-right-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.loc-tabs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .loc-tabs-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.loc-tab-btn {
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #ffffff;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;
}

.loc-tab-btn:hover {
  background-color: #f8fafc;
}

.loc-tab-btn.active {
  background: linear-gradient(to right, #f59e0b, #d97706);
  color: #ffffff;
  border-color: #d97706;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.25);
}

.loc-tab-btn svg {
  width: 1rem;
  height: 1rem;
}

/* LANDMARKS LIST */
.loc-landmarks-list {
  display: flex;
  flex-direction: column;
}

.loc-landmark-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loc-landmark-card {
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: border-color 0.2s ease;
}

.loc-landmark-card:hover {
  border-color: #fcd34d;
}

.loc-landmark-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
  margin: 0;
}

.loc-landmark-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.15rem 0 0;
}

.loc-time-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  background-color: #fef3c7;
  color: #78350f;
  font-weight: 800;
  font-size: 0.75rem;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1px solid rgba(253, 230, 138, 0.8);
}

/* CTA */
.loc-cta-wrap {
  padding-top: 0.5rem;
}

.loc-cab-cta-btn {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background-color: #0f172a;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

@media (min-width: 640px) {
  .loc-cab-cta-btn {
    font-size: 0.8125rem;
  }
}

.loc-cab-cta-btn:hover {
  background-color: #1e293b;
  transform: translateY(-1px);
}

.loc-cab-cta-btn svg {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
}
`,

  js: `// Location Category Tab Switching & Google Map Embed Loader
(function() {
  // 1. Tab Switching
  const tabBtns = document.querySelectorAll('.loc-tab-btn');
  const groups = document.querySelectorAll('.loc-landmark-group');

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const targetCategory = this.getAttribute('data-tab');

      groups.forEach(function(group) {
        if (group.getAttribute('data-category') === targetCategory) {
          group.style.display = 'flex';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // 2. Load Google Map Embed
  const mapContainer = document.getElementById('loc-map-container');
  const placeholder = document.getElementById('loc-map-placeholder');

  function loadGoogleMap() {
    if (!mapContainer || mapContainer.querySelector('iframe')) return;

    const iframe = document.createElement('iframe');
    iframe.title = 'Prestige Thane Location Map';
    iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15074.808006323136!2d72.986341!3d19.222372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b93198eb5363%3A0xe54d90d813735163!2sKapurbawdi%2C%20Thane%20West%2C%20Thane%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';
    iframe.className = 'loc-iframe';
    iframe.loading = 'lazy';

    if (placeholder) {
      placeholder.style.display = 'none';
    }
    mapContainer.appendChild(iframe);
  }

  if (placeholder) {
    placeholder.addEventListener('click', loadGoogleMap);
  }
})();
`,
};

