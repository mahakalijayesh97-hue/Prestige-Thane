export const FAQ_SECTION_TEMPLATE = {
  title: 'Frequently Asked Questions',
  slug: 'faq',
  status: 'published',
  seo_title: 'Frequently Asked Questions (FAQ) | Prestige Thane',
  meta_description: 'Essential facts, pre-launch clarifications, RERA status, pricing, location, and statutory verification regarding Prestige Thane.',
  meta_keywords: 'Prestige Thane FAQ, is Prestige Thane RERA registered, Prestige Thane price, launch date, Prestige Thane location',

  html: `<section class="faq-section font-sans scroll-mt-20" id="faq">
  <div class="faq-container">
    
    <!-- Section Header -->
    <div class="faq-header">
      <div class="faq-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-badge-icon">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>TRANSPARENCY &amp; CLARIFICATIONS</span>
      </div>

      <h2 class="faq-main-title">
        Frequently Asked Questions
      </h2>

      <p class="faq-sub-desc">
        Essential facts, pre-launch clarification, and statutory verification regarding Prestige Thane.
      </p>
    </div>

    <!-- Search Filter Box -->
    <div class="faq-search-wrapper">
      <div class="faq-search-input-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-search-icon">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          id="faq-search-input"
          placeholder="Search FAQs (e.g. RERA, launch, pricing, location)..."
          class="faq-search-field"
          aria-label="Search FAQs"
        />
      </div>
    </div>

    <!-- FAQs Accordion List -->
    <div class="faq-list" id="faq-list-container">
      
      <!-- FAQ 0 (Default Open) -->
      <div class="faq-item open" id="faq-item-0" data-q="is prestige thane officially launched" data-a="prestige thane is currently being presented as a coming-soon/upcoming development. official launch details will be updated when announced.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(0);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">Is Prestige Thane officially launched?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              Prestige Thane is currently being presented as a coming-soon/upcoming development. Official launch details will be updated when announced.
            </p>
            <span class="faq-tag-pill">Project Status</span>
          </div>
        </div>
      </div>

      <!-- FAQ 1 -->
      <div class="faq-item" id="faq-item-1" data-q="is the project rera registered" data-a="rera registration details are currently awaited. the rera number should be added to the website only after official registration.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(1);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">Is the project RERA registered?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              RERA registration details are currently awaited. The RERA number should be added to the website only after official registration.
            </p>
            <span class="faq-tag-pill">Compliance &amp; RERA</span>
          </div>
        </div>
      </div>

      <!-- FAQ 2 -->
      <div class="faq-item" id="faq-item-2" data-q="what is the price of prestige thane" data-a="official pricing has not been published on this landing page. register to receive pricing updates when officially announced.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(2);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">What is the price of Prestige Thane?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              Official pricing has not been published on this landing page. Register to receive pricing updates when officially announced.
            </p>
            <span class="faq-tag-pill">Pricing &amp; Commercials</span>
          </div>
        </div>
      </div>

      <!-- FAQ 3 -->
      <div class="faq-item" id="faq-item-3" data-q="what residence types will be available" data-a="official residence typologies and unit sizes are awaited and will be updated once announced.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(3);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">What residence types will be available?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              Official residence typologies and unit sizes are awaited and will be updated once announced.
            </p>
            <span class="faq-tag-pill">Unit Typologies</span>
          </div>
        </div>
      </div>

      <!-- FAQ 4 -->
      <div class="faq-item" id="faq-item-4" data-q="where exactly is the project located" data-a="thane is the confirmed market/location reference for this landing page. exact project-location details should be displayed only after verification.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(4);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">Where exactly is the project located?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              Thane is the confirmed market/location reference for this landing page. Exact project-location details should be displayed only after verification.
            </p>
            <span class="faq-tag-pill">Location &amp; Geography</span>
          </div>
        </div>
      </div>

      <!-- FAQ 5 -->
      <div class="faq-item" id="faq-item-5" data-q="when will prestige thane launch" data-a="launch timing will be updated following an official announcement.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(5);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">When will Prestige Thane launch?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              Launch timing will be updated following an official announcement.
            </p>
            <span class="faq-tag-pill">Timeline</span>
          </div>
        </div>
      </div>

      <!-- FAQ 6 -->
      <div class="faq-item" id="faq-item-6" data-q="how can i get early information" data-a="submit the enquiry form to register your interest and receive project updates.">
        <button type="button" class="faq-trigger" onclick="if(window.toggleFaqItem){window.toggleFaqItem(6);}">
          <div class="faq-trigger-left">
            <span class="faq-q-badge">Q</span>
            <span class="faq-question-text">How can I get early information?</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-chevron">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="faq-answer-panel">
          <div class="faq-answer-inner">
            <p class="faq-answer-text">
              Submit the enquiry form to register your interest and receive project updates.
            </p>
            <span class="faq-tag-pill">Early Registration</span>
          </div>
        </div>
      </div>

      <!-- No Results State -->
      <div class="faq-no-results" id="faq-no-results" style="display: none;">
        No matching questions found. Please submit your enquiry above to receive dedicated assistance.
      </div>

    </div>

  </div>
</section>`,

  css: `/* ===== FAQ SECTION STYLES ===== */
.faq-section {
  padding: 3.5rem 1rem 5rem;
  background-color: #ffffff;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .faq-section {
    padding: 5rem 1.5rem;
  }
}

.faq-section * {
  box-sizing: border-box;
}

.faq-container {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 0.75rem;
}

@media (min-width: 640px) {
  .faq-container {
    padding: 0 1.5rem;
  }
}

/* HEADER */
.faq-header {
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .faq-header {
    margin-bottom: 2.5rem;
  }
}

.faq-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #b45309;
}

.faq-badge-icon {
  width: 1rem;
  height: 1rem;
}

.faq-main-title {
  font-size: 1.875rem;
  line-height: 1.2;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .faq-main-title {
    font-size: 2.25rem;
  }
}

@media (min-width: 1024px) {
  .faq-main-title {
    font-size: 3rem;
  }
}

.faq-sub-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #475569;
  font-weight: 500;
  max-width: 36rem;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .faq-sub-desc {
    font-size: 1rem;
  }
}

/* SEARCH FIELD */
.faq-search-wrapper {
  max-width: 32rem;
  margin: 0 auto 2rem;
}

.faq-search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.faq-search-icon {
  position: absolute;
  left: 0.875rem;
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
  pointer-events: none;
}

.faq-search-field {
  width: 100%;
  padding: 0.65rem 1rem 0.65rem 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  font-size: 0.875rem;
  background-color: #ffffff;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
}

.faq-search-field:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

/* FAQ LIST & ACCORDION */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.faq-item {
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: rgba(250, 249, 245, 0.45);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.faq-item:hover {
  border-color: #cbd5e1;
}

.faq-trigger {
  width: 100%;
  padding: 1rem 1.25rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}

.faq-trigger-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.faq-q-badge {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.faq-question-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
}

@media (min-width: 640px) {
  .faq-question-text {
    font-size: 1rem;
  }
}

.faq-chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: #64748b;
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

/* DEFAULT CLOSED */
.faq-answer-panel {
  display: none !important;
  padding: 0.25rem 1.25rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  background-color: #ffffff;
}

/* OPEN STATE DRIVEN BY .open CLASS */
.faq-item.open .faq-answer-panel {
  display: block !important;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg) !important;
  color: #b45309 !important;
}

.faq-answer-inner {
  padding-left: 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-answer-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #334155;
  margin: 0;
}

.faq-tag-pill {
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 600;
  color: #92400e;
  background-color: #fef3c7;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(251, 191, 36, 0.4);
  width: fit-content;
}

/* NO RESULTS */
.faq-no-results {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
}
`,

  js: `// FAQ Accordion & Search Logic
(function() {
  window.toggleFaqItem = function(targetIndex) {
    var allItems = document.querySelectorAll('.faq-item');
    var targetItem = document.getElementById('faq-item-' + targetIndex);
    if (!targetItem) return;

    var isOpen = targetItem.classList.contains('open');

    // Close all FAQs first
    allItems.forEach(function(item) {
      item.classList.remove('open');
    });

    // If target was closed, open it. If it was already open, it stays closed!
    if (!isOpen) {
      targetItem.classList.add('open');
    }
  };

  // Delegated click fallback on entire FAQ section
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('.faq-trigger');
    if (!trigger) return;
    var item = trigger.closest('.faq-item');
    if (!item) return;

    var id = item.id;
    if (id && id.indexOf('faq-item-') === 0) {
      var idx = parseInt(id.replace('faq-item-', ''), 10);
      window.toggleFaqItem(idx);
    }
  });

  // Real-time Search Filter
  var searchInput = document.getElementById('faq-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      var q = this.value.trim().toLowerCase();
      var allItems = document.querySelectorAll('.faq-item');
      var noResults = document.getElementById('faq-no-results');
      var matchCount = 0;

      allItems.forEach(function(item) {
        var questionText = (item.getAttribute('data-q') || '').toLowerCase();
        var answerText = (item.getAttribute('data-a') || '').toLowerCase();

        if (questionText.indexOf(q) !== -1 || answerText.indexOf(q) !== -1) {
          item.style.display = '';
          matchCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = matchCount === 0 ? 'block' : 'none';
      }
    });
  }
})();
`,
};
