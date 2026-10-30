const mongoose = require('mongoose');
const { runWithAllDatabases } = require('./env-loader');

const customHtml = `
<div class="prestige-luxury-footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <!-- Col 1: Brand & Status -->
      <div class="footer-col col-brand">
        <div class="footer-brand-logo">
          <svg viewBox="0 0 200 185" class="prestige-svg-logo" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="falconGoldGradFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F6E05E" />
                <stop offset="35%" stop-color="#EAB308" />
                <stop offset="70%" stop-color="#CA8A04" />
                <stop offset="100%" stop-color="#854D0E" />
              </linearGradient>
            </defs>
            <circle cx="95" cy="65" r="41" fill="#111111" />
            <path d="M98 75 C108 82, 122 88, 138 91 C133 87, 127 82, 122 75 C118 70, 114 66, 110 63 Z" fill="url(#falconGoldGradFooter)" />
            <path d="M100 78 C108 84, 118 89, 130 92 C126 88, 121 83, 117 78 Z" fill="#FDE047" />
            <path d="M87 59 C87 56, 90 53, 93 53 C96 53, 98 56, 98 60 C98 64, 96 68, 93 72 C91 74, 88 77, 86 80 C86 78, 85 75, 87 72 C89 69, 87 67, 85 64 C84 62, 85 60, 87 59 Z" fill="url(#falconGoldGradFooter)" />
            <path d="M88 59 C86 59, 83 60, 81 63 C82 64, 84 64, 86 63 C87 62, 88 61, 88 59 Z" fill="#78350F" />
            <path d="M89 54 C88 47, 87 38, 86 28 C85 22, 84 16, 85 10 C86 16, 88 23, 90 29 C92 35, 93 42, 94 51 Z" fill="url(#falconGoldGradFooter)" />
            <path d="M96 52 C101 44, 108 34, 116 23 C121 16, 126 9, 131 3 C127 10, 123 18, 119 26 C115 34, 110 42, 106 50 Z" fill="url(#falconGoldGradFooter)" />
            <path d="M106 48 C112 39, 119 29, 126 19 C130 13, 133 8, 136 4 C133 11, 129 19, 125 27 C120 35, 115 43, 110 50 Z" fill="url(#falconGoldGradFooter)" />
            <line x1="24" y1="99" x2="166" y2="99" stroke="#F59E0B" stroke-width="2.8" stroke-linecap="square" />
            <text x="95" y="131" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" letter-spacing="-0.5">Prestige</text>
            <text x="95" y="149" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" letter-spacing="4">GROUP</text>
            <line x1="24" y1="157" x2="166" y2="157" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="square" />
            <text x="95" y="170" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="12.5" font-weight="600" letter-spacing="0.4">Add Prestige to your life</text>
          </svg>
        </div>

        <p class="brand-desc">
          An upcoming residential landmark by Prestige Group in Thane. Register for early access, official launch announcements, floor plans, and pricing updates.
        </p>

        <div class="rera-status-wrap">
          <span class="badge-rera">
            <svg class="icon-inline text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span>RERA Details Awaited</span>
          </span>
        </div>

        <!-- Authorized Sales Partner: First Team -->
        <div class="partner-card">
          <div class="firstteam-badge-mini">
            <div class="ft-top">
              <span class="ft-auth">AUTHORIZED</span>
              <span class="ft-title">Sales Partner</span>
            </div>
            <div class="ft-bottom">
              <div class="ft-logo-inline">
                <svg width="22" height="18" viewBox="0 0 54 44" fill="none">
                  <rect x="0" y="0" width="10" height="44" fill="#0A192F" />
                  <rect x="0" y="0" width="28" height="9.5" fill="#0A192F" />
                  <rect x="0" y="17" width="23" height="9" fill="#0A192F" />
                  <rect x="33" y="0" width="21" height="9.5" fill="#0A192F" />
                  <rect x="44" y="0" width="10" height="44" fill="#0A192F" />
                </svg>
                <span class="ft-brand-text">First Team<span class="ft-dot">.</span></span>
              </div>
            </div>
          </div>
          <div class="partner-info">
            <span class="partner-kicker">Authorized Sales Partner</span>
            <span class="partner-name">First Team</span>
            <p class="partner-sub">Official marketing & advisory facilitation desk for Prestige Thane.</p>
          </div>
        </div>
      </div>

      <!-- Col 2: Quick Links -->
      <div class="footer-col col-links">
        <h4 class="col-heading">Quick Links</h4>
        <ul class="footer-links-list">
          <li><a href="#overview">Overview</a></li>
          <li><a href="#why-prestige">Why Prestige</a></li>
          <li><a href="#location">Location</a></li>
          <li><a href="#pricing">Price</a></li>
          <li><a href="#floor-plans">Floor Plans</a></li>
          <li><a href="#amenities">Amenities</a></li>
          <li><a href="#faqs">FAQs</a></li>
          <li><button type="button" class="btn-link-gold" onclick="window.triggerFooterEnquiry()">Enquire Now →</button></li>
        </ul>
      </div>

      <!-- Col 3: Legal & Regulatory -->
      <div class="footer-col col-legal">
        <h4 class="col-heading">Legal & Compliance</h4>
        <ul class="footer-links-list">
          <li><button type="button" class="btn-link-legal" onclick="window.openFooterLegal('Disclaimer')">Statutory Disclaimer</button></li>
          <li><button type="button" class="btn-link-legal" onclick="window.openFooterLegal('Privacy Policy')">Privacy Policy</button></li>
          <li><button type="button" class="btn-link-legal" onclick="window.openFooterLegal('Terms & Conditions')">Terms & Conditions</button></li>
          <li class="rera-filing-text">RERA Registration: Under formal filing process</li>
        </ul>
      </div>

      <!-- Col 4: Advisor Desk & Contact -->
      <div class="footer-col col-desk">
        <h4 class="col-heading">Advisor Desk</h4>
        <p class="desk-sub">Direct consultation for Thane prospects & investors.</p>
        <div class="desk-contact">
          <a href="tel:+919022222448" class="desk-phone">+91 90222 22448</a>
          <span class="desk-hours">10:00 AM – 7:30 PM (Daily)</span>
        </div>
        <div class="desk-log-btn-wrap">
          <button type="button" class="btn-enquiry-log" onclick="window.triggerFooterEnquiryLog()">
            <svg class="icon-inline text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span id="footerEnquiryLogBtnText">Enquiry Log (0)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Verbatim Disclaimer Banner -->
    <div class="disclaimer-banner-wrap">
      <div class="disclaimer-banner-card">
        <div class="disclaimer-header">
          <svg class="icon-inline text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span>IMPORTANT STATUTORY DISCLAIMER</span>
        </div>
        <p class="disclaimer-p">
          This website is intended for general informational and lead-generation purposes only. Prestige Thane is presented as an upcoming/pre-launch development. Project details including RERA registration, carpet areas, pricing, floor plans, amenities, specifications, launch dates and possession timelines are subject to official announcements and approvals. Visitors should independently verify all project information and statutory details before making any purchase or investment decision.
        </p>
      </div>

      <div class="disclaimer-bottom-bar">
        <p>© 2026 Prestige Thane – Pre-Launch Information Portal. All rights reserved.</p>
        <p class="compliance-tag">Strict Compliance Mode: No fake RERA number or unverified data published.</p>
      </div>
    </div>
  </div>

  <!-- Official React LegalModal Matching Clean White & Navy Theme -->
  <div id="footerLegalModal" class="footer-legal-modal-backdrop" onclick="window.closeFooterLegal(event)">
    <div class="footer-legal-modal-dialog" onclick="event.stopPropagation()">
      <div class="modal-dialog-header">
        <div class="modal-dialog-title-wrap">
          <svg class="icon-inline text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <h3 id="footerLegalModalTitle" class="modal-dialog-title">Legal &amp; Compliance</h3>
        </div>
        <button type="button" class="btn-modal-close" onclick="window.closeFooterLegal()" aria-label="Close dialog">&times;</button>
      </div>
      
      <div class="modal-dialog-body">
        <p id="footerLegalModalContent" class="modal-dialog-text"></p>

        <!-- Regulatory Notice Box matching official LegalModal component -->
        <div class="legal-regulatory-notice">
          <span class="regulatory-notice-title">Pre-Launch Regulatory Verification Notice</span>
          <p class="regulatory-notice-text">
            Prestige Thane is an upcoming development. MahaRERA registration details are awaited and will be published upon official grant by the Maharashtra Real Estate Regulatory Authority. All purchase decisions should be preceded by independent inspection of certified statutory records.
          </p>
        </div>
      </div>

      <div class="modal-dialog-footer">
        <button type="button" class="btn-modal-dismiss" onclick="window.closeFooterLegal()">Close</button>
      </div>
    </div>
  </div>

  <!-- Lead Management & CRM Hub Drawer -->
  <div id="footerLeadDrawer" class="footer-lead-drawer-backdrop" onclick="window.closeFooterLeadDrawer(event)">
    <div class="footer-lead-drawer-panel" onclick="event.stopPropagation()">
      <div class="lead-drawer-header">
        <div>
          <div class="lead-drawer-tag">
            <svg class="icon-inline text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            <span>LEAD MANAGEMENT & CRM HUB</span>
          </div>
          <h3 class="lead-drawer-title">Prestige Thane Inquiries</h3>
        </div>
        <button type="button" class="btn-drawer-close" onclick="window.closeFooterLeadDrawer()">&times;</button>
      </div>

      <div class="lead-drawer-tabs">
        <button type="button" id="tabBtnLeads" class="drawer-tab active" onclick="window.switchLeadDrawerTab('leads')">
          Registered Leads (<span id="countLeadsTab">0</span>)
        </button>
        <button type="button" id="tabBtnEvents" class="drawer-tab" onclick="window.switchLeadDrawerTab('events')">
          Event Tracking Log (<span id="countEventsTab">0</span>)
        </button>
      </div>

      <div class="lead-drawer-toolbar">
        <span class="toolbar-hint">Local Lead Cache & Analytics Monitor</span>
        <div class="toolbar-actions">
          <button type="button" id="btnExportCsv" class="btn-action-tool" onclick="window.exportLeadsCsv()" style="display:none;">
            <svg class="icon-inline text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Export CSV</span>
          </button>
          <button type="button" id="btnClearAll" class="btn-action-tool text-rose-600" onclick="window.clearAllLeads()" style="display:none;">
            <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div class="lead-drawer-body">
        <div id="tabContentLeads" class="drawer-tab-content">
          <div id="leadsListEmpty" class="drawer-empty-state">
            <div class="empty-icon-wrap">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h4>No leads captured yet</h4>
            <p>Submit the hero or lead capture form to simulate and verify real lead intake.</p>
          </div>
          <div id="leadsListContainer" class="drawer-items-list" style="display:none;"></div>
        </div>

        <div id="tabContentEvents" class="drawer-tab-content" style="display:none;">
          <div id="eventsListEmpty" class="text-center py-16 space-y-3" style="text-align:center; padding:64px 20px;">
            <svg class="w-12 h-12 text-slate-300 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:48px; height:48px; margin:0 auto 12px; display:block;">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
            <p class="text-sm font-semibold text-slate-700" style="font-size:14px; font-weight:600; color:#334155; margin:0 0 6px 0;">No events logged yet</p>
            <p class="text-xs text-slate-500" style="font-size:12px; color:#64748b; margin:0; line-height:1.5;">Interact with buttons, scroll down the page, or submit forms to trigger analytics events.</p>
          </div>
          <div id="eventsListContainer" class="drawer-items-list" style="display:none;"></div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

const customCss = `
.prestige-luxury-footer {
  background-color: #020617;
  color: #94a3b8;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-top: 1px solid #1e293b;
  width: 100%;
  position: relative;
  padding: 64px 0 36px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.prestige-luxury-footer * {
  box-sizing: border-box;
}

.footer-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 4.5fr 2.5fr 2.5fr 2.5fr;
    gap: 36px;
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.prestige-svg-logo {
  height: 52px;
  width: auto;
  display: block;
}

.brand-desc {
  font-size: 12px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0;
}

.badge-rera {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #0f172a;
  border: 1px solid #1e293b;
  color: #fde047;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
}

.partner-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background-color: rgba(15, 23, 42, 0.8);
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 12px 14px;
  margin-top: 6px;
}

.firstteam-badge-mini {
  width: 72px;
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #f59e0b;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.ft-top {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  padding: 5px 4px;
  text-align: center;
}

.ft-auth {
  display: block;
  font-size: 6.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #020617;
  text-transform: uppercase;
  line-height: 1;
}

.ft-title {
  display: block;
  font-size: 10px;
  font-weight: 900;
  color: #020617;
  line-height: 1.1;
  margin-top: 2px;
}

.ft-bottom {
  padding: 4px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ft-logo-inline {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ft-brand-text {
  font-size: 9px;
  font-weight: 800;
  color: #0a192f;
  line-height: 1;
}

.ft-dot {
  color: #f59e0b;
}

.partner-info {
  display: flex;
  flex-direction: column;
}

.partner-kicker {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: #f59e0b;
  letter-spacing: 0.08em;
}

.partner-name {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}

.partner-sub {
  font-size: 10px;
  color: #94a3b8;
  margin: 3px 0 0 0;
  line-height: 1.3;
}

.col-heading {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links-list a {
  color: #94a3b8;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
  display: inline-block;
}

.footer-links-list a:hover {
  color: #f59e0b;
}

.btn-link-gold {
  background: none;
  border: none;
  padding: 0;
  color: #f59e0b;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;
}

.btn-link-gold:hover {
  color: #fde047;
}

.btn-link-legal {
  background: none;
  border: none;
  padding: 0;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s;
}

.btn-link-legal:hover {
  color: #f59e0b;
}

.rera-filing-text {
  font-size: 11px;
  color: #64748b;
  padding-top: 4px;
}

.desk-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.desk-phone {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #f59e0b;
  text-decoration: none;
  margin-top: 4px;
}

.desk-phone:hover {
  text-decoration: underline;
}

.desk-hours {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.btn-enquiry-log {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #0f172a;
  border: 1px solid #1e293b;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 6px;
}

.btn-enquiry-log:hover {
  background-color: #1e293b;
  border-color: #f59e0b;
}

.disclaimer-banner-wrap {
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid rgba(30, 41, 59, 0.8);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.disclaimer-banner-card {
  background-color: rgba(15, 23, 42, 0.6);
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
}

.disclaimer-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.disclaimer-p {
  font-size: 11px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0;
}

.disclaimer-bottom-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11px;
  color: #64748b;
  justify-content: space-between;
}

@media (min-width: 640px) {
  .disclaimer-bottom-bar {
    flex-direction: row;
    align-items: center;
  }
}

.disclaimer-bottom-bar p {
  margin: 0;
}

.compliance-tag {
  font-size: 11px;
  color: #64748b;
}

.icon-inline {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: middle;
}

.text-gold {
  color: #f59e0b;
}

.text-rose-600 {
  color: #e11d48;
}

/* ========================================================
   PREMIUM LEGAL MODAL (Matching React LegalModal Component)
   ======================================================== */
.footer-legal-modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(4px);
  z-index: 999999;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.footer-legal-modal-backdrop.open {
  display: flex;
}

.footer-legal-modal-dialog {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  max-width: 36rem;
  width: 100%;
  max-height: 85vh;
  color: #1e293b;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  animation: legalModalPop 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes legalModalPop {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #0A192F;
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  flex-shrink: 0;
}

.modal-dialog-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-dialog-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.01em;
}

.btn-modal-close {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.btn-modal-close:hover {
  color: #ffffff;
  background-color: #1e293b;
}

.modal-dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-dialog-text {
  font-size: 0.875rem;
  line-height: 1.65;
  color: #334155;
  margin: 0;
}

.legal-regulatory-notice {
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  color: #78350f;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.regulatory-notice-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #92400e;
}

.regulatory-notice-text {
  font-size: 0.75rem;
  line-height: 1.5;
  color: #78350f;
  margin: 0;
}

.modal-dialog-footer {
  padding: 12px 24px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn-modal-dismiss {
  background-color: #0f172a;
  color: #ffffff;
  border: none;
  padding: 8px 20px;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-modal-dismiss:hover {
  background-color: #1e293b;
}

/* CRM Lead Management Drawer */
.footer-lead-drawer-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.65);
  backdrop-filter: blur(3px);
  z-index: 999999;
  justify-content: flex-end;
}

.footer-lead-drawer-backdrop.open {
  display: flex;
}

.footer-lead-drawer-panel {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  height: 100%;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  animation: drawerSlideIn 0.28s ease-out;
}

@keyframes drawerSlideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.lead-drawer-header {
  padding: 20px 24px;
  background-color: #0a192f;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

.lead-drawer-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #f59e0b;
  text-transform: uppercase;
}

.lead-drawer-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin: 4px 0 0 0;
}

.btn-drawer-close {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}

.btn-drawer-close:hover {
  color: #ffffff;
  background: #1e293b;
}

.lead-drawer-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  gap: 16px;
}

.drawer-tab {
  background: none;
  border: none;
  padding: 14px 4px 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.drawer-tab.active {
  color: #0f172a;
  border-bottom-color: #d97706;
}

.lead-drawer-toolbar {
  padding: 10px 24px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.toolbar-hint {
  color: #64748b;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-action-tool {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.btn-action-tool:hover {
  background: #f8fafc;
}

.lead-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #ffffff;
}

.drawer-empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.empty-icon {
  width: 28px;
  height: 28px;
  color: #94a3b8;
}

.drawer-empty-state h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.drawer-empty-state p {
  font-size: 12px;
  color: #64748b;
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.5;
}

.drawer-items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lead-item-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.lead-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lead-item-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.lead-item-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fef3c7;
  color: #b45309;
}

.lead-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #475569;
}
`;

const customJs = `
(function() {
  const disclaimerText = 'This website is intended for general informational and lead-generation purposes only. Prestige Thane is presented as an upcoming/pre-launch development. Project details including RERA registration, carpet areas, pricing, floor plans, amenities, specifications, launch dates and possession timelines are subject to official announcements and approvals. Visitors should independently verify all project information and statutory details before making any purchase or investment decision.';

  const privacyText = 'We are committed to safeguarding your privacy. The information collected on this website (such as name, phone number, and email address) is used exclusively for property consultation, sending requested project updates, and facilitating communication regarding Prestige Thane. Your details will not be sold, rented, or distributed to unauthorized third parties.';

  const termsText = 'By browsing this website and submitting your contact details, you confirm that you have read and understood that Prestige Thane is an upcoming/pre-launch development for which MahaRERA registration details are awaited. All content, illustrations, and specifications are conceptual and subject to formal developer approval and statutory clearance.';

  const legalTexts = {
    'Disclaimer': {
      title: 'Disclaimer',
      text: disclaimerText
    },
    'Statutory Disclaimer': {
      title: 'Statutory Disclaimer',
      text: disclaimerText
    },
    'Privacy Policy': {
      title: 'Privacy Policy',
      text: privacyText
    },
    'Terms & Conditions': {
      title: 'Terms & Conditions',
      text: termsText
    }
  };

  function getLeads() {
    try {
      const stored = localStorage.getItem('prestige_thane_leads');
      return stored ? JSON.parse(stored) : [];
    } catch(e) {
      return [];
    }
  }

  function getEvents() {
    try {
      const stored = localStorage.getItem('prestige_thane_events');
      return stored ? JSON.parse(stored) : [];
    } catch(e) {
      return [];
    }
  }

  // Global event tracker matching React analytics.ts
  window.trackEvent = function(eventType, details) {
    if (!eventType) return;
    const eventObj = {
      event: eventType,
      timestamp: new Date().toISOString(),
      details: details || {}
    };

    console.log('[Analytics Event Tracked]:', eventType, eventObj);

    try {
      const existing = getEvents();
      existing.push(eventObj);
      localStorage.setItem('prestige_thane_events', JSON.stringify(existing.slice(-200)));
      updateFooterCounts();
    } catch(e) {
      console.warn('Analytics storage error:', e);
    }
  };

  function updateFooterCounts() {
    const leads = getLeads();
    const events = getEvents();
    const btnText = document.getElementById('footerEnquiryLogBtnText');
    if (btnText) btnText.textContent = 'Enquiry Log (' + leads.length + ')';
    const leadsTab = document.getElementById('countLeadsTab');
    if (leadsTab) leadsTab.textContent = leads.length;
    const eventsTab = document.getElementById('countEventsTab');
    if (eventsTab) eventsTab.textContent = events.length;

    const btnClear = document.getElementById('btnClearAll');
    if (btnClear) {
      btnClear.style.display = (leads.length > 0 || events.length > 0) ? 'inline-flex' : 'none';
    }
  }

  function renderLeads() {
    const leads = getLeads();
    const emptyEl = document.getElementById('leadsListEmpty');
    const containerEl = document.getElementById('leadsListContainer');
    const btnCsv = document.getElementById('btnExportCsv');
    const btnClear = document.getElementById('btnClearAll');

    if (!leads || leads.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (containerEl) {
        containerEl.style.display = 'none';
        containerEl.innerHTML = '';
      }
      if (btnCsv) btnCsv.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (btnCsv) btnCsv.style.display = 'inline-flex';
    if (btnClear) btnClear.style.display = 'inline-flex';

    if (containerEl) {
      containerEl.style.display = 'flex';
      containerEl.innerHTML = leads.map(function(l) {
        const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString();
        return '<div class="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5 lead-item-card">' +
          '<div class="flex items-center justify-between lead-item-top">' +
            '<span class="font-bold text-slate-900 text-sm lead-item-name">' + (l.name || 'Prospect') + '</span>' +
            '<span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 lead-item-tag">' + (l.intent || 'Buying') + '</span>' +
          '</div>' +
          '<div class="grid grid-cols-2 gap-2 text-xs text-slate-600 lead-item-row">' +
            '<span>📞 ' + (l.phone || '-') + '</span>' +
            (l.email ? '<span class="truncate">✉️ ' + l.email + '</span>' : '') +
          '</div>' +
          '<div class="text-[10px] text-slate-400 flex items-center justify-between pt-1" style="font-size:10px; color:#94a3b8; display:flex; justify-content:space-between;">' +
            '<span>Source: ' + (l.source || 'Website') + '</span>' +
            '<span>' + dateStr + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }
  }

  function renderEvents() {
    const events = getEvents();
    const emptyEl = document.getElementById('eventsListEmpty');
    const containerEl = document.getElementById('eventsListContainer');

    if (!events || events.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (containerEl) {
        containerEl.style.display = 'none';
        containerEl.innerHTML = '';
      }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (containerEl) {
      containerEl.style.display = 'flex';
      containerEl.innerHTML = events.slice().reverse().map(function(ev) {
        const dateStr = ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : '';
        const payload = ev.details || ev.metadata || {};
        return '<div class="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs flex items-center justify-between" style="padding:12px; border-radius:8px; border:1px solid #e2e8f0; background:#f8fafc; font-size:12px; display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">' +
          '<div class="space-y-0.5" style="display:flex; flex-direction:column; gap:2px;">' +
            '<span class="font-mono font-bold text-amber-800" style="font-family:monospace; font-weight:700; color:#92400e;">' + (ev.event || 'Action') + '</span>' +
            '<p class="text-[10px] text-slate-500 font-mono" style="font-size:10px; color:#64748b; font-family:monospace; margin:0;">' +
              JSON.stringify(payload) +
            '</p>' +
          '</div>' +
          '<span class="text-[10px] text-slate-400" style="font-size:10px; color:#94a3b8; white-space:nowrap; margin-left:8px;">' +
            dateStr +
          '</span>' +
        '</div>';
      }).join('');
    }
  }

  window.openFooterLegal = function(type, customContent) {
    const item = legalTexts[type] || { title: type || 'Legal & Compliance', text: customContent || disclaimerText };
    const modal = document.getElementById('footerLegalModal');
    const titleEl = document.getElementById('footerLegalModalTitle');
    const contentEl = document.getElementById('footerLegalModalContent');
    if (modal && titleEl && contentEl) {
      titleEl.textContent = item.title;
      contentEl.textContent = customContent || item.text;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeFooterLegal = function(event) {
    if (event && event.target && event.target !== event.currentTarget) return;
    const modal = document.getElementById('footerLegalModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.triggerFooterEnquiry = function() {
    if (typeof window.openEarlyAccessModal === 'function') {
      window.openEarlyAccessModal('footer_enquire', 'Enquire Now');
    } else {
      const el = document.getElementById('cta-banner') || document.getElementById('lead-capture') || document.querySelector('form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.triggerFooterEnquiryLog = function() {
    const drawer = document.getElementById('footerLeadDrawer');
    if (drawer) {
      updateFooterCounts();
      renderLeads();
      renderEvents();
      drawer.classList.add('open');
    }
  };

  window.closeFooterLeadDrawer = function(event) {
    if (event && event.target && event.target !== event.currentTarget) return;
    const drawer = document.getElementById('footerLeadDrawer');
    if (drawer) drawer.classList.remove('open');
  };

  window.switchLeadDrawerTab = function(tab) {
    const tabBtnLeads = document.getElementById('tabBtnLeads');
    const tabBtnEvents = document.getElementById('tabBtnEvents');
    const contentLeads = document.getElementById('tabContentLeads');
    const contentEvents = document.getElementById('tabContentEvents');

    if (tab === 'leads') {
      if (tabBtnLeads) tabBtnLeads.classList.add('active');
      if (tabBtnEvents) tabBtnEvents.classList.remove('active');
      if (contentLeads) contentLeads.style.display = 'block';
      if (contentEvents) contentEvents.style.display = 'none';
      renderLeads();
    } else {
      if (tabBtnLeads) tabBtnLeads.classList.remove('active');
      if (tabBtnEvents) tabBtnEvents.classList.add('active');
      if (contentLeads) contentLeads.style.display = 'none';
      if (contentEvents) contentEvents.style.display = 'block';
      renderEvents();
    }
  };

  window.exportLeadsCsv = function() {
    const leads = getLeads();
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Intent', 'Source', 'Date'];
    const rows = leads.map(function(l) {
      return [
        l.id || '',
        '"' + (l.name || '') + '"',
        '"' + (l.phone || '') + '"',
        '"' + (l.email || '') + '"',
        '"' + (l.intent || '') + '"',
        '"' + (l.source || '') + '"',
        '"' + (l.createdAt ? new Date(l.createdAt).toLocaleString() : '') + '"'
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), rows.map(function(e) { return e.join(','); }).join('\\n')].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'prestige_thane_leads_' + new Date().toISOString().slice(0, 10) + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  window.clearAllLeads = function() {
    if (confirm('Clear all stored leads and events?')) {
      localStorage.removeItem('prestige_thane_leads');
      localStorage.removeItem('prestige_thane_events');
      updateFooterCounts();
      renderLeads();
      renderEvents();
    }
  };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeFooterLegal();
      window.closeFooterLeadDrawer();
    }
  });

  // Automatic Interaction & Scroll Analytics Tracking (Once per session)
  var hasTrackedScroll50 = false;
  var hasTrackedScroll90 = false;
  try {
    var storedEvents = getEvents();
    hasTrackedScroll50 = storedEvents.some(function(ev) { return ev.event === 'scroll_50'; });
    hasTrackedScroll90 = storedEvents.some(function(ev) { return ev.event === 'scroll_90'; });
  } catch(e) {}

  window.addEventListener('scroll', function() {
    try {
      if (hasTrackedScroll50 && hasTrackedScroll90) return;
      var h = document.documentElement;
      var b = document.body;
      var scrollTop = h.scrollTop || b.scrollTop;
      var scrollHeight = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
      if (scrollHeight <= 0) return;
      var scrollPercent = (scrollTop / scrollHeight) * 100;

      if (scrollPercent >= 50 && !hasTrackedScroll50) {
        hasTrackedScroll50 = true;
        window.trackEvent('scroll_50', { depth: '50%' });
      }
      if (scrollPercent >= 90 && !hasTrackedScroll90) {
        hasTrackedScroll90 = true;
        window.trackEvent('scroll_90', { depth: '90%' });
      }
    } catch(e) {}
  }, { passive: true });

  // Auto-listen for clicks across the entire site
  document.addEventListener('click', function(e) {
    try {
      var target = e.target;
      if (!target) return;

      // Milestone Card click
      var milestoneCard = target.closest('.milestone-card, [data-stage]');
      if (milestoneCard) {
        var stageId = milestoneCard.getAttribute('data-stage') || milestoneCard.id || 'stage';
        var stageTitle = milestoneCard.querySelector('.m-title, h3, h4')?.textContent?.trim() || '';
        window.trackEvent('milestone_stage_click', { stage_id: stageId, stage_title: stageTitle });
      }

      // WhatsApp links/buttons
      var waEl = target.closest('a[href*="whatsapp"], a[href*="wa.me"], button[data-action="whatsapp"], .whatsapp-btn');
      if (waEl) {
        window.trackEvent('whatsapp_click', { source: 'button_or_link' });
      }

      // Phone calls
      var telEl = target.closest('a[href^="tel:"]');
      if (telEl) {
        window.trackEvent('phone_click', { href: telEl.getAttribute('href') });
      }

      // Book Site Visit / Site Visit
      var visitEl = target.closest('#hero-book-site-visit-btn, [data-action="site-visit"], .btn-site-visit, [href*="#site-visit"]');
      if (visitEl) {
        window.trackEvent('book_site_visit_click', { text: visitEl.textContent?.trim() });
      }

      // Master plan download
      var mpEl = target.closest('[data-modal-source*="master_plan"], #download-master-plan-btn, [href*="master-plan"]');
      if (mpEl) {
        window.trackEvent('master_plan_download_click', { text: mpEl.textContent?.trim() });
      }

      // Brochure download
      var broEl = target.closest('#hero-brochure-btn, [data-modal-source*="brochure"], .btn-brochure');
      if (broEl) {
        window.trackEvent('master_plan_download_click', { source: 'brochure_button' });
      }

      // Gallery / Lightbox enquire
      var galleryEl = target.closest('.gallery-item, .gallery-thumb, [data-gallery-index]');
      if (galleryEl) {
        window.trackEvent('gallery_image_view', { id: galleryEl.id || 'gallery_item' });
      }
      var lightboxEnquire = target.closest('.lightbox-enquire-btn, [data-action="lightbox_enquire"]');
      if (lightboxEnquire) {
        window.trackEvent('lightbox_enquire_click', {});
      }

      // Lead Modal open
      var modalTrigger = target.closest('[data-modal="early-access"], .btn-enquire, [data-action="open_lead_modal"]');
      if (modalTrigger) {
        var source = modalTrigger.getAttribute('data-modal-source') || modalTrigger.textContent?.trim() || 'button';
        window.trackEvent('open_lead_modal', { source: source });
      }
    } catch(err) {}
  }, true);

  // Initial count update
  updateFooterCounts();
})();
`;

const FooterSettingSchema = new mongoose.Schema(
  {
    footer_image: String,
    custom_html: String,
    custom_css: String,
    custom_js: String,
    show_default_links: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

async function seed() {
  const update = {
    custom_html: customHtml.trim(),
    custom_css: customCss.trim(),
    custom_js: customJs.trim(),
    show_default_links: false,
  };

  await runWithAllDatabases('custom-footer', async (conn, label) => {
    const FooterSetting =
      conn.models.FooterSetting || conn.model('FooterSetting', FooterSettingSchema);
    const doc = await FooterSetting.findOneAndUpdate(
      {},
      { $set: update },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`[${label}] Footer updated successfully (length: ${doc.custom_html.length})`);
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed footer:', err);
  process.exit(1);
});
