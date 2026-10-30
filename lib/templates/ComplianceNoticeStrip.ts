export const COMPLIANCE_NOTICE_STRIP_TEMPLATE = {
  title: 'Compliance & Transparency Notice Strip',
  slug: 'compliance-notice-strip',
  status: 'published',
  seo_title: 'Compliance & Transparency Notice | Prestige Thane',
  meta_description: 'Prestige Thane pre-launch compliance and transparency notice with authorized sales partner First Team details.',
  meta_keywords: 'Prestige Thane, MahaRERA, compliance notice, First Team, authorized partner',

  html: `<!-- COMPLIANCE & TRANSPARENCY NOTICE STRIP -->
<section class="compliance-notice-strip" id="compliance-notice">
  <div class="cns-container">
    
    <!-- LEFT: Compliance Notice & RERA Status -->
    <div class="cns-left">
      <!-- Shield Icon -->
      <div class="cns-shield-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>

      <div class="cns-text-content">
        <div class="cns-heading-row">
          <span class="cns-title">COMPLIANCE &amp; TRANSPARENCY NOTICE</span>
          <span class="cns-badge">COMING SOON | RERA DETAILS AWAITED</span>
        </div>
        <p class="cns-desc">
          Prestige Thane is currently presented as an upcoming/pre-launch opportunity. MahaRERA registration details are awaited and will be updated on this page once officially available.
        </p>
      </div>
    </div>

    <!-- RIGHT: Authorized Partner Card & Pre-Launch Info -->
    <div class="cns-right">
      
      <!-- Authorized Partner Box -->
      <div class="cns-partner-card">
        <!-- Mini Badge Graphic -->
        <div class="cns-badge-graphic">
          <div class="cns-badge-top">
            <span class="cns-b-auth">AUTHORIZED</span>
            <span class="cns-b-sales">Sales<br>Partner</span>
          </div>
          <div class="cns-badge-bottom">
            <div class="cns-ft-monogram">
              <span class="cns-f">F</span><span class="cns-1">1</span>
            </div>
            <div class="cns-ft-name">
              <span>First</span>
              <span>Team<span class="cns-dot">.</span></span>
            </div>
          </div>
        </div>

        <!-- Partner Name & Title -->
        <div class="cns-partner-title">
          <span class="cns-p-label">AUTHORIZED PARTNER</span>
          <span class="cns-p-name">First Team</span>
        </div>

        <!-- Vertical Divider -->
        <div class="cns-divider"></div>

        <!-- Buyer Advantages List -->
        <div class="cns-features">
          <div class="cns-feature-item cns-f-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>Best Negotiations on Buyer Side</span>
          </div>
          <div class="cns-feature-item cns-f-slate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>End-to-End Professional Support</span>
          </div>
          <div class="cns-feature-item cns-f-light">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Served 525+ Happy Home Buyers</span>
          </div>
          <div class="cns-feature-item cns-f-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>Zero Brokerage • Direct Developer Dealings</span>
          </div>
        </div>
      </div>

      <!-- Pre-Launch Portal Tag -->
      <div class="cns-portal-tag">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Pre-Launch Portal</span>
      </div>

    </div>

  </div>
</section>`,

  css: `/* ===== COMPLIANCE & TRANSPARENCY NOTICE STRIP ===== */
.compliance-notice-strip {
  width: 100%;
  background: linear-gradient(90deg, #071326 0%, #0a192f 50%, #071326 100%);
  border-top: 1px solid rgba(245, 158, 11, 0.25);
  border-bottom: 1px solid rgba(245, 158, 11, 0.25);
  padding: 14px 20px;
  color: #f8fafc;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.compliance-notice-strip * {
  box-sizing: border-box;
}

.cns-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

/* LEFT SECTION */
.cns-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1 1 520px;
  min-width: 300px;
}

.cns-shield-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cns-shield-icon svg {
  width: 20px;
  height: 20px;
  stroke: #fbbf24;
}

.cns-text-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cns-heading-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cns-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #fbbf24;
  text-transform: uppercase;
}

.cns-badge {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #fde68a;
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
}

.cns-desc {
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
  font-weight: 400;
  max-width: 620px;
  margin: 0;
}

/* RIGHT SECTION */
.cns-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* AUTHORIZED PARTNER CARD */
.cns-partner-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #0d1e38;
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

/* MINI BADGE GRAPHIC */
.cns-badge-graphic {
  width: 50px;
  height: 52px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(251, 191, 36, 0.5);
  flex-shrink: 0;
  background: #fff;
}

.cns-badge-top {
  background: linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #b45309 100%);
  color: #ffffff;
  padding: 3px 4px;
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1;
}

.cns-b-auth {
  font-size: 4.8px;
  font-weight: 900;
  letter-spacing: 0.12em;
  opacity: 0.95;
  color: #1a1a1a;
  text-transform: uppercase;
}

.cns-b-sales {
  font-size: 7.5px;
  font-weight: 900;
  line-height: 1.05;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.cns-badge-bottom {
  background: #ffffff;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px 4px;
}

.cns-ft-monogram {
  font-size: 8px;
  font-weight: 900;
  color: #0a192f;
  line-height: 1;
}

.cns-ft-name {
  font-size: 5.5px;
  font-weight: 800;
  color: #0a192f;
  display: flex;
  flex-direction: column;
  line-height: 1;
  text-align: right;
}

.cns-dot {
  color: #f59e0b;
}

/* PARTNER TITLE */
.cns-partner-title {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.cns-p-label {
  font-size: 8.5px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cns-p-name {
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
  white-space: nowrap;
}

/* DIVIDER */
.cns-divider {
  width: 1px;
  height: 48px;
  background-color: rgba(148, 163, 184, 0.25);
}

/* FEATURES LIST */
.cns-features {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cns-feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  white-space: nowrap;
}

.cns-feature-item svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.cns-f-gold {
  color: #fde047;
  font-weight: 600;
}
.cns-f-gold svg {
  stroke: #fbbf24;
}

.cns-f-slate {
  color: #e2e8f0;
  font-weight: 500;
}
.cns-f-slate svg {
  stroke: #fbbf24;
}

.cns-f-light {
  color: #fef08a;
  font-weight: 500;
}
.cns-f-light svg {
  stroke: #fbbf24;
}

.cns-f-green {
  color: #4ade80;
  font-weight: 700;
}
.cns-f-green svg {
  stroke: #4ade80;
}

/* PRE-LAUNCH PORTAL TAG */
.cns-portal-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0d1e38;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 500;
  color: #cbd5e1;
  white-space: nowrap;
}

.cns-portal-tag svg {
  width: 14px;
  height: 14px;
  stroke: #fbbf24;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1024px) {
  .cns-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .cns-right {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .cns-partner-card {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .cns-divider {
    display: none;
  }

  .cns-features {
    width: 100%;
    border-top: 1px solid rgba(148, 163, 184, 0.2);
    padding-top: 6px;
  }
}`,

  js: `// Compliance notice interactive bindings if needed in future
console.log('Compliance & Transparency notice strip initialized.');`,
};

