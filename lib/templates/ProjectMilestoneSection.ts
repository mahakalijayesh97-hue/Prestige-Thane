export const PROJECT_MILESTONE_TEMPLATE = {
  title: 'Project Timeline & Milestones',
  slug: 'project-milestones',
  status: 'published',
  seo_title: 'Project Timeline & Milestones | Prestige Thane',
  meta_description: 'Upcoming development stages, construction timeline, and handover roadmap for Prestige Thane from priority pass to OC receipt.',
  meta_keywords: 'Prestige Thane timeline, project milestones, construction stages, handover 2029, Mivan technology, MahaRERA escrow',

  html: `<section class="milestones-section font-sans" id="milestones">
  <div class="milestones-container">
    
    <!-- Section Header -->
    <div class="milestones-header-row">
      <div class="milestones-header-text">
        <div class="milestones-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="milestone-clock-icon">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>PROJECT TIMELINE &amp; MILESTONES</span>
        </div>

        <h2 class="milestones-main-title">
          Upcoming Development Stages &amp; Timeline
        </h2>

        <p class="milestones-sub-desc">
          Explore the master roadmap of Prestige Thane — from initial priority pre-launch bookings to foundational engineering, skyscraper construction, and scheduled handover.
        </p>
      </div>

      <!-- Slider controls & schedule button -->
      <div class="milestones-actions">
        <button type="button" class="milestone-nav-btn" id="milestone-prev-btn" aria-label="Previous milestone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button type="button" class="milestone-nav-btn" id="milestone-next-btn" aria-label="Next milestone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <a href="#early-access" class="milestone-download-btn" id="download-milestone-schedule-btn" data-modal="early-access" data-modal-title="Download Detailed Milestone &amp; Construction Schedule" data-modal-source="milestones_schedule_pdf">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="download-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download Schedule</span>
        </a>
      </div>
    </div>

    <!-- Mobile Swipe Prompt -->
    <div class="milestones-mobile-prompt">
      <span>Scroll horizontally to view all stages</span>
      <span class="swipe-text">Swipe →</span>
    </div>

    <!-- Horizontal Timeline Cards Track -->
    <div class="milestones-track-wrapper">
      <div class="milestones-track" id="milestones-scroll-track">
        
        <!-- STAGE 01 -->
        <div class="milestone-card active selected" data-stage="stage-1" id="milestone-card-stage-1">
          <div class="m-card-top">
            <div class="m-card-badge-wrap">
              <span class="m-stage-tag active">STAGE 01</span>
              <span class="m-live-ping"><span class="ping-wave"></span><span class="ping-dot"></span></span>
            </div>
            <span class="m-timeline-chip">Q1 – Q2 2025</span>
          </div>

          <div class="m-card-body">
            <div class="m-card-heading-group">
              <div class="m-icon-box active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <div>
                <h3 class="m-title">Priority Pass &amp; EOI</h3>
                <p class="m-subtitle">Early Access &amp; Pre-Launch Privilege</p>
              </div>
            </div>
            <p class="m-desc">Exclusive Expression of Interest (EOI) window. Homebuyers secure priority unit allotment queues, inaugural pricing advantages, and savings of up to ₹5 Lacs before public launch.</p>
          </div>

          <div class="m-card-footer">
            <span class="m-status-text active">CURRENT ACTIVE STAGE</span>
            <span class="m-view-prompt selected">Selected <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>

        <!-- STAGE 02 -->
        <div class="milestone-card" data-stage="stage-2" id="milestone-card-stage-2">
          <div class="m-card-top">
            <div class="m-card-badge-wrap">
              <span class="m-stage-tag">STAGE 02</span>
            </div>
            <span class="m-timeline-chip">Q3 2025</span>
          </div>

          <div class="m-card-body">
            <div class="m-card-heading-group">
              <div class="m-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <h3 class="m-title">Booking Launch</h3>
                <p class="m-subtitle">Official Public Launch &amp; Allotment</p>
              </div>
            </div>
            <p class="m-desc">Official opening of the grand experience centre and show residences at Kapurbawadi. Direct unit selection, booking confirmation, and execution of registered agreement for sale.</p>
          </div>

          <div class="m-card-footer">
            <span class="m-status-text">UPCOMING PHASE</span>
            <span class="m-view-prompt">View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>

        <!-- STAGE 03 -->
        <div class="milestone-card" data-stage="stage-3" id="milestone-card-stage-3">
          <div class="m-card-top">
            <div class="m-card-badge-wrap">
              <span class="m-stage-tag">STAGE 03</span>
            </div>
            <span class="m-timeline-chip">Q4 2025</span>
          </div>

          <div class="m-card-body">
            <div class="m-card-heading-group">
              <div class="m-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
              </div>
              <div>
                <h3 class="m-title">Ground Breaking &amp; Plinth</h3>
                <p class="m-subtitle">Substructure &amp; Deep Piling</p>
              </div>
            </div>
            <p class="m-desc">Mobilization of high-capacity piling rigs, foundational geo-technical engineering, and casting of multi-level basement retaining walls and ground plinth.</p>
          </div>

          <div class="m-card-footer">
            <span class="m-status-text">SCHEDULED</span>
            <span class="m-view-prompt">View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>

        <!-- STAGE 04 -->
        <div class="milestone-card" data-stage="stage-4" id="milestone-card-stage-4">
          <div class="m-card-top">
            <div class="m-card-badge-wrap">
              <span class="m-stage-tag">STAGE 04</span>
            </div>
            <span class="m-timeline-chip">2026 – 2028</span>
          </div>

          <div class="m-card-body">
            <div class="m-card-heading-group">
              <div class="m-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"/></svg>
              </div>
              <div>
                <h3 class="m-title">Construction Phase</h3>
                <p class="m-subtitle">High-Rise Superstructure Rise</p>
              </div>
            </div>
            <p class="m-desc">Full-scale construction utilizing advanced monolithic aluminum formwork (Mivan technology) to erect the 50+ storey luxury residential towers at rapid, high-precision pace.</p>
          </div>

          <div class="m-card-footer">
            <span class="m-status-text">PROJECTED</span>
            <span class="m-view-prompt">View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>

        <!-- STAGE 05 -->
        <div class="milestone-card" data-stage="stage-5" id="milestone-card-stage-5">
          <div class="m-card-top">
            <div class="m-card-badge-wrap">
              <span class="m-stage-tag">STAGE 05</span>
            </div>
            <span class="m-timeline-chip">2028 – 2029</span>
          </div>

          <div class="m-card-body">
            <div class="m-card-heading-group">
              <div class="m-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <h3 class="m-title">Architectural Finishing</h3>
                <p class="m-subtitle">Façade, MEP &amp; Clubhouse Curation</p>
              </div>
            </div>
            <p class="m-desc">External double-glazed façade installation, interior premium sanitary/marble fitments, high-speed elevator commissioning, and completion of the 50,000 sq.ft clubhouse.</p>
          </div>

          <div class="m-card-footer">
            <span class="m-status-text">PROJECTED</span>
            <span class="m-view-prompt">View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>

        <!-- STAGE 06 -->
        <div class="milestone-card" data-stage="stage-6" id="milestone-card-stage-6">
          <div class="m-card-top">
            <div class="m-card-badge-wrap">
              <span class="m-stage-tag">STAGE 06</span>
            </div>
            <span class="m-timeline-chip">2029 – 2030</span>
          </div>

          <div class="m-card-body">
            <div class="m-card-heading-group">
              <div class="m-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 2-2 2m-6 6a5 5 0 0 0-7 7l-4 4a1 1 0 0 0 0 1.42l1.58 1.58a1 1 0 0 0 1.42 0l4-4a5 5 0 0 0 7-7l2-2"/><circle cx="15.5" cy="8.5" r=".5"/></svg>
              </div>
              <div>
                <h3 class="m-title">Expected Handover</h3>
                <p class="m-subtitle">Possession &amp; Community Welcome</p>
              </div>
            </div>
            <p class="m-desc">Receipt of final Occupancy Certificate (OC) from civic authorities, final snagging inspection, handover of keys with official resident welcome packs, and community formation.</p>
          </div>

          <div class="m-card-footer">
            <span class="m-status-text">TARGET COMPLETION</span>
            <span class="m-view-prompt">View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
          </div>
        </div>

      </div>
    </div>

    <!-- Selected Stage Spotlight Banner -->
    <div class="milestone-spotlight-card">
      <div class="spotlight-grid">
        
        <!-- Left: Stage Detail Info -->
        <div class="spotlight-left-info">
          <div class="spotlight-tags-row">
            <span class="spotlight-stage-badge" id="spotlight-stage-badge">STAGE 01 DETAILS</span>
            <span class="spotlight-time-badge" id="spotlight-time-badge">Q1 – Q2 2025</span>
            <span class="spotlight-status-badge active" id="spotlight-status-badge">CURRENT ACTIVE STAGE</span>
          </div>

          <h3 class="spotlight-title" id="spotlight-title">
            Priority Pass &amp; EOI — Early Access &amp; Pre-Launch Privilege
          </h3>

          <p class="spotlight-desc" id="spotlight-desc">
            Exclusive Expression of Interest (EOI) window. Homebuyers secure priority unit allotment queues, inaugural pricing advantages, and savings of up to ₹5 Lacs before public launch.
          </p>

          <div class="spotlight-deliverables-wrap">
            <h4 class="deliverables-heading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              <span>Key Deliverables &amp; Homebuyer Milestones:</span>
            </h4>
            <div class="deliverables-grid" id="spotlight-deliverables-grid">
              <div class="deliverable-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                <span>Priority Token Number Generation</span>
              </div>
              <div class="deliverable-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                <span>Inaugural Pre-Launch Pricing Locks</span>
              </div>
              <div class="deliverable-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                <span>VIP Access to Master Layouts &amp; Deck</span>
              </div>
              <div class="deliverable-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                <span>Dedicated Senior Relationship Manager</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Action CTA Card -->
        <div class="spotlight-cta-card">
          <div class="spotlight-cta-bg-glow"></div>
          
          <div class="spotlight-cta-content">
            <div class="assurance-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
              <span>PRESTIGE TIMELINE ASSURANCE</span>
            </div>

            <h4 class="spotlight-cta-heading" id="spotlight-cta-heading">
              Reserve Your Place for the Priority Pass &amp; EOI
            </h4>

            <p class="spotlight-cta-desc">
              Join the pre-launch priority queue today to lock your preferred tower, floor orientation, and inaugural price discount.
            </p>
          </div>

          <div class="spotlight-cta-action">
            <a href="#early-access" class="spotlight-btn" id="spotlight-action-btn" data-modal="early-access" data-modal-title="Priority Access: Priority Pass &amp; EOI" data-modal-source="milestone_action_stage-1">
              <span>Book Priority Token for This Stage</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>

            <div class="spotlight-guarantee">
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              <span>100% Refundable EOI Token • MahaRERA Statutory Escrow</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Statutory Assurance Footer Bar -->
    <div class="milestones-assurance-bar">
      <div class="assurance-left">
        <div class="assurance-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        </div>
        <div>
          <p class="assurance-title">Statutory Milestone Escrow Governance</p>
          <p class="assurance-sub">Prestige Thane adheres to MahaRERA project milestones. All construction phases are subject to civic engineer and architect certificate approvals.</p>
        </div>
      </div>

      <a href="#early-access" class="assurance-link-btn" id="milestone-spec-sheet-btn" data-modal="early-access" data-modal-title="Request Construction Schedule &amp; Milestone Specifications" data-modal-source="milestones_construction_specs">
        <span>Request Detailed Spec Sheet</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    </div>

  </div>
</section>`,

  css: `/* ===== PROJECT TIMELINE & MILESTONES SECTION STYLES ===== */
.milestones-section {
  padding: 3.5rem 1rem 5rem;
  background-color: #f8fafc;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
  position: relative;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

.milestones-section * {
  box-sizing: border-box;
}

.milestones-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 0.75rem;
}

@media (min-width: 640px) {
  .milestones-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .milestones-container {
    padding: 0 2rem;
  }
}

/* HEADER ROW */
.milestones-header-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

@media (min-width: 768px) {
  .milestones-header-row {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 2.5rem;
  }
}

.milestones-header-text {
  max-width: 48rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.milestones-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background-color: rgba(254, 243, 199, 0.8);
  color: #78350f;
  border: 1px solid rgba(253, 230, 138, 0.8);
  width: fit-content;
}

.milestone-clock-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #b45309;
}

.milestones-main-title {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .milestones-main-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .milestones-main-title {
    font-size: 3rem;
  }
}

.milestones-sub-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #475569;
  font-weight: 500;
  margin: 0;
}

@media (min-width: 640px) {
  .milestones-sub-desc {
    font-size: 1rem;
  }
}

/* ACTIONS (ARROWS + BUTTON) */
.milestones-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.milestone-nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease;
}

.milestone-nav-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.milestone-nav-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.milestone-download-btn {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.15rem;
  border-radius: 0.75rem;
  background-color: #0f172a;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.15s ease;
  cursor: pointer;
}

.milestone-download-btn:hover {
  background-color: #1e293b;
}

.download-icon {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
}

@media (min-width: 640px) {
  .milestone-download-btn {
    display: inline-flex;
  }
}

/* MOBILE SWIPE */
.milestones-mobile-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
  margin: 1rem 0 0.5rem;
}

.swipe-text {
  color: #b45309;
  font-weight: 700;
}

@media (min-width: 768px) {
  .milestones-mobile-prompt {
    display: none;
  }
}

/* HORIZONTAL TRACK */
.milestones-track-wrapper {
  margin-top: 1.5rem;
  position: relative;
}

.milestones-track {
  display: flex;
  align-items: stretch;
  gap: 1rem;
  overflow-x: auto;
  padding-top: 0.5rem;
  padding-bottom: 1.25rem;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.milestones-track::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .milestones-track {
    gap: 1.5rem;
  }
}

/* CARD ITEM */
.milestone-card {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 280px;
  border-radius: 1rem;
  padding: 1.25rem 1.35rem;
  background-color: rgba(255, 255, 255, 0.85);
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  transition: all 0.2s ease;
  user-select: none;
}

@media (min-width: 640px) {
  .milestone-card {
    width: 320px;
    padding: 1.5rem;
  }
}

.milestone-card:hover {
  background-color: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.milestone-card.selected {
  background-color: #ffffff;
  border-color: #fbbf24;
  box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.15);
  outline: 2px solid rgba(251, 191, 36, 0.4);
}

.m-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.m-card-badge-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.m-stage-tag {
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  background-color: #f1f5f9;
  color: #475569;
}

.m-stage-tag.active {
  background-color: #f59e0b;
  color: #ffffff;
}

.milestone-card.selected:not(.active) .m-stage-tag {
  background-color: #0f172a;
  color: #ffffff;
}

.m-live-ping {
  position: relative;
  display: flex;
  width: 0.5rem;
  height: 0.5rem;
}

.ping-wave {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  position: absolute;
  display: inline-flex;
  height: 100%;
  width: 100%;
  border-radius: 9999px;
  background-color: #34d399;
  opacity: 0.75;
}

.ping-dot {
  position: relative;
  display: inline-flex;
  border-radius: 9999px;
  height: 0.5rem;
  width: 0.5rem;
  background-color: #10b981;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.m-timeline-chip {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.m-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.m-card-heading-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.m-icon-box {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: #f1f5f9;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-icon-box.active {
  background: linear-gradient(135deg, #fbbf24, #d97706);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3);
}

.milestone-card.selected:not(.active) .m-icon-box {
  background-color: #fef3c7;
  color: #78350f;
}

.m-icon-box svg {
  width: 1.25rem;
  height: 1.25rem;
}

.m-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  margin: 0;
}

.m-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

.m-desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: #475569;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.m-card-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m-status-text {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.m-status-text.active {
  color: #047857;
  font-weight: 800;
}

.m-view-prompt {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.m-view-prompt.selected {
  color: #b45309;
}

.m-view-prompt svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* EXPANDED SPOTLIGHT CARD */
.milestone-spotlight-card {
  margin-top: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 1.5rem;
}

@media (min-width: 640px) {
  .milestone-spotlight-card {
    padding: 2rem;
  }
}

.spotlight-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .spotlight-grid {
    grid-template-columns: 7fr 5fr;
  }
}

.spotlight-left-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spotlight-tags-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.spotlight-stage-badge {
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 0.375rem;
  background-color: #f59e0b;
  color: #ffffff;
}

.spotlight-time-badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 0.375rem;
  background-color: #f1f5f9;
  color: #1e293b;
}

.spotlight-status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 0.375rem;
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.spotlight-status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #6ee7b7;
}

.spotlight-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
  margin: 0;
}

@media (min-width: 640px) {
  .spotlight-title {
    font-size: 1.875rem;
  }
}

.spotlight-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

@media (min-width: 640px) {
  .spotlight-desc {
    font-size: 1rem;
  }
}

.spotlight-deliverables-wrap {
  padding-top: 0.5rem;
}

.deliverables-heading {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #0f172a;
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.deliverables-heading svg {
  width: 1rem;
  height: 1rem;
  color: #d97706;
}

.deliverables-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
}

@media (min-width: 640px) {
  .deliverables-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.deliverable-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #334155;
  background-color: #f8fafc;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(226, 232, 240, 0.7);
}

.deliverable-item svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* RIGHT CTA CARD */
.spotlight-cta-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .spotlight-cta-card {
    padding: 1.75rem;
  }
}

.spotlight-cta-bg-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background-color: rgba(245, 158, 11, 0.1);
  border-radius: 9999px;
  filter: blur(2rem);
  pointer-events: none;
}

.spotlight-cta-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 10;
}

.assurance-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background-color: rgba(251, 191, 36, 0.15);
  color: #fde047;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid rgba(251, 191, 36, 0.3);
  width: fit-content;
}

.assurance-pill svg {
  width: 0.875rem;
  height: 0.875rem;
}

.spotlight-cta-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

@media (min-width: 640px) {
  .spotlight-cta-heading {
    font-size: 1.5rem;
  }
}

.spotlight-cta-desc {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #cbd5e1;
  margin: 0;
}

.spotlight-cta-action {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 10;
}

.spotlight-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #f59e0b, #fbbf24, #f59e0b);
  color: #020617;
  font-weight: 800;
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3);
  transition: all 0.2s ease;
  cursor: pointer;
}

.spotlight-btn:hover {
  background: linear-gradient(to right, #fbbf24, #f59e0b, #fbbf24);
  box-shadow: 0 15px 20px -3px rgba(245, 158, 11, 0.4);
  transform: translateY(-1px);
}

.spotlight-btn svg {
  width: 1rem;
  height: 1rem;
}

.spotlight-guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  color: #94a3b8;
  text-align: center;
}

.spotlight-guarantee svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* STATUTORY ASSURANCE FOOTER */
.milestones-assurance-bar {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .milestones-assurance-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.assurance-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.assurance-icon-box {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #b45309;
}

.assurance-icon-box svg {
  width: 1rem;
  height: 1rem;
}

.assurance-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.assurance-sub {
  font-size: 0.6875rem;
  color: #64748b;
  margin: 0;
}

.assurance-link-btn {
  font-size: 0.75rem;
  font-weight: 700;
  color: #92400e;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.assurance-link-btn:hover {
  text-decoration: underline;
}

.assurance-link-btn svg {
  width: 0.875rem;
  height: 0.875rem;
}`,

  js: `// Interactive Stage Selection & Carousel Scroll Logic
(function() {
  const stagesData = {
    'stage-1': {
      number: '01',
      title: 'Priority Pass & EOI',
      subtitle: 'Early Access & Pre-Launch Privilege',
      status: 'active',
      statusLabel: 'CURRENT ACTIVE STAGE',
      timeline: 'Q1 – Q2 2025',
      desc: 'Exclusive Expression of Interest (EOI) window. Homebuyers secure priority unit allotment queues, inaugural pricing advantages, and savings of up to ₹5 Lacs before public launch.',
      deliverables: [
        'Priority Token Number Generation',
        'Inaugural Pre-Launch Pricing Locks',
        'VIP Access to Master Layouts & Deck',
        'Dedicated Senior Relationship Manager'
      ]
    },
    'stage-2': {
      number: '02',
      title: 'Booking Launch',
      subtitle: 'Official Public Launch & Allotment',
      status: 'upcoming',
      statusLabel: 'UPCOMING PHASE',
      timeline: 'Q3 2025',
      desc: 'Official opening of the grand experience centre and show residences at Kapurbawadi. Direct unit selection, booking confirmation, and execution of registered agreement for sale.',
      deliverables: [
        'Sample Flats & Experience Pavilion Opening',
        'Inventory Allotment & High-Floor Selection',
        'RERA-Registered Agreement Execution',
        'Flexible Milestone Payment Plan Activation'
      ]
    },
    'stage-3': {
      number: '03',
      title: 'Ground Breaking & Plinth',
      subtitle: 'Substructure & Deep Piling',
      status: 'upcoming',
      statusLabel: 'SCHEDULED',
      timeline: 'Q4 2025',
      desc: 'Mobilization of high-capacity piling rigs, foundational geo-technical engineering, and casting of multi-level basement retaining walls and ground plinth.',
      deliverables: [
        'Geo-Technical Soil Solidification',
        'Bored Cast-in-Situ Heavy Piling',
        'Multi-Tier Basement RCC Retaining',
        'Quarterly MahaRERA Progress Upload'
      ]
    },
    'stage-4': {
      number: '04',
      title: 'Construction Phase',
      subtitle: 'High-Rise Superstructure Rise',
      status: 'projected',
      statusLabel: 'PROJECTED',
      timeline: '2026 – 2028',
      desc: 'Full-scale construction utilizing advanced monolithic aluminum formwork (Mivan technology) to erect the 50+ storey luxury residential towers at rapid, high-precision pace.',
      deliverables: [
        'Mivan Monolithic Concrete Technology',
        'Multi-Tower Floor Slab Cycling (7-10 Days/Floor)',
        'Earthquake-Resistant Seismic Zone IV Design',
        'Live Site Webcam Access for Homeowners'
      ]
    },
    'stage-5': {
      number: '05',
      title: 'Architectural Finishing',
      subtitle: 'Façade, MEP & Clubhouse Curation',
      status: 'projected',
      statusLabel: 'PROJECTED',
      timeline: '2028 – 2029',
      desc: 'External double-glazed façade installation, interior premium sanitary/marble fitments, high-speed elevator commissioning, and completion of the 50,000 sq.ft clubhouse.',
      deliverables: [
        'Acoustic Glass Façade & Balcony Railings',
        'Imported Marble & Premium Fixtures',
        '50,000 Sq.Ft Clubhouse & 50+ Amenities Ready',
        'Fire & Safety NOC Compliance Audits'
      ]
    },
    'stage-6': {
      number: '06',
      title: 'Expected Handover',
      subtitle: 'Possession & Community Welcome',
      status: 'target',
      statusLabel: 'TARGET COMPLETION',
      timeline: '2029 – 2030',
      desc: 'Receipt of final Occupancy Certificate (OC) from civic authorities, final snagging inspection, handover of keys with official resident welcome packs, and community formation.',
      deliverables: [
        'Occupancy Certificate (OC) Procurement',
        'Individual Home Snag-Free Inspection',
        'Key Handover & Welcome Kit Delivery',
        'Handover to Prestige Resident Association'
      ]
    }
  };

  function selectStage(stageId) {
    const data = stagesData[stageId];
    if (!data) return;

    // Update active card styling
    document.querySelectorAll('.milestone-card').forEach(function(card) {
      if (card.getAttribute('data-stage') === stageId) {
        card.classList.add('selected');
        const viewSpan = card.querySelector('.m-view-prompt');
        if (viewSpan) {
          viewSpan.classList.add('selected');
          viewSpan.innerHTML = 'Selected <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:0.875rem;height:0.875rem;"><polyline points="9 18 15 12 9 6"/></svg>';
        }
      } else {
        card.classList.remove('selected');
        const viewSpan = card.querySelector('.m-view-prompt');
        if (viewSpan) {
          viewSpan.classList.remove('selected');
          viewSpan.innerHTML = 'View <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:0.875rem;height:0.875rem;"><polyline points="9 18 15 12 9 6"/></svg>';
        }
      }
    });

    // Update spotlight banner
    const badgeEl = document.getElementById('spotlight-stage-badge');
    const timeEl = document.getElementById('spotlight-time-badge');
    const statusEl = document.getElementById('spotlight-status-badge');
    const titleEl = document.getElementById('spotlight-title');
    const descEl = document.getElementById('spotlight-desc');
    const ctaHeadingEl = document.getElementById('spotlight-cta-heading');
    const deliverablesGrid = document.getElementById('spotlight-deliverables-grid');
    const actionBtn = document.getElementById('spotlight-action-btn');

    if (badgeEl) badgeEl.textContent = 'STAGE ' + data.number + ' DETAILS';
    if (timeEl) timeEl.textContent = data.timeline;
    if (statusEl) {
      statusEl.textContent = data.statusLabel;
      if (data.status === 'active') {
        statusEl.className = 'spotlight-status-badge active';
      } else {
        statusEl.className = 'spotlight-status-badge';
      }
    }
    if (titleEl) titleEl.textContent = data.title + ' — ' + data.subtitle;
    if (descEl) descEl.textContent = data.desc;
    if (ctaHeadingEl) ctaHeadingEl.textContent = 'Reserve Your Place for the ' + data.title;
    if (actionBtn) {
      actionBtn.setAttribute('data-modal-title', 'Priority Access: ' + data.title);
      actionBtn.setAttribute('data-modal-source', 'milestone_action_' + stageId);
    }

    if (deliverablesGrid) {
      deliverablesGrid.innerHTML = data.deliverables.map(function(item) {
        return '<div class="deliverable-item">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" style="width:1rem;height:1rem;flex-shrink:0;margin-top:0.1rem;">' +
          '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>' +
          '<path d="m9 12 2 2 4-4"/>' +
          '</svg>' +
          '<span>' + item + '</span>' +
          '</div>';
      }).join('');
    }
  }

  // Scroll controls & Active Card Navigation
  const track = document.getElementById('milestones-scroll-track');
  const prevBtn = document.getElementById('milestone-prev-btn');
  const nextBtn = document.getElementById('milestone-next-btn');

  const stageKeys = ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5', 'stage-6'];
  let currentStageIndex = 0;

  function scrollToSelectedCard(stageId) {
    const card = document.getElementById('milestone-card-' + stageId);
    if (card && track) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentStageIndex > 0) {
        currentStageIndex--;
      } else {
        currentStageIndex = stageKeys.length - 1; // Wrap around to last
      }
      const targetStage = stageKeys[currentStageIndex];
      selectStage(targetStage);
      scrollToSelectedCard(targetStage);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (currentStageIndex < stageKeys.length - 1) {
        currentStageIndex++;
      } else {
        currentStageIndex = 0; // Wrap around to first
      }
      const targetStage = stageKeys[currentStageIndex];
      selectStage(targetStage);
      scrollToSelectedCard(targetStage);
    });
  }

  // Card click triggers
  document.querySelectorAll('.milestone-card').forEach(function(card) {
    card.addEventListener('click', function() {
      const stageId = this.getAttribute('data-stage');
      const idx = stageKeys.indexOf(stageId);
      if (idx !== -1) {
        currentStageIndex = idx;
      }
      selectStage(stageId);
      scrollToSelectedCard(stageId);
    });
  });
})();`,
};

