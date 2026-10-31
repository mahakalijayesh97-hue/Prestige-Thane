export const EARLY_ACCESS_MODAL_TEMPLATE = {
  title: 'Pre-Launch Early Access & Site Visit Booking',
  slug: 'early-access',
  status: 'published',
  seo_title: 'Pre-Launch Early Access & Site Visit | Prestige Thane',
  meta_description: 'Register for official pre-launch updates, floor plans, instant WhatsApp details, or schedule an exclusive guided site visit at Prestige Thane.',
  meta_keywords: 'Prestige Thane, early access, book site visit, pre-launch enquiry, floor plans, price sheet',

  html: `<!-- ===== PRE-LAUNCH EARLY ACCESS SECTION & MODAL ===== -->
<section id="early-access-section" class="early-access-page-section">
  <div class="early-access-page-container">
    <div class="early-access-card">
      <!-- Card Header -->
      <div class="early-card-header">
        <div class="early-header-branding">
          <div class="early-brand-logo">
            <img src="/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.webp" alt="Prestige Group" />
          </div>
          <div class="early-brand-text">
            <span class="early-badge-pill">PRE-LAUNCH ENQUIRY</span>
            <h2 class="early-page-title" id="page-early-title">Register for Early Access</h2>
          </div>
        </div>
      </div>

      <!-- Notice Banner -->
      <div class="early-notice-bar">
        <svg class="notice-sparkle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        <span>Official pre-launch updates, floor plans, and pricing will be shared directly.</span>
      </div>

      <!-- Success Confirmation Box (Initially hidden) -->
      <div id="page-early-success" class="early-success-banner" style="display: none;">
        <svg class="success-check-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <path d="m9 11 3 3L22 4"/>
        </svg>
        <div class="success-text">
          <h4 class="success-heading">Inquiry Received Successfully!</h4>
          <p class="success-sub" id="page-early-success-msg">Thank you! Our Prestige sales desk will reach out shortly.</p>
        </div>
      </div>

      <!-- Lead Capture Form -->
      <form id="page-early-access-form" class="early-access-form" onsubmit="return false;">
        <div id="page-early-error" class="early-error-banner" style="display: none;"></div>

        <!-- 1. Mobile Number -->
        <div class="form-group">
          <label for="page-early-phone" class="form-label">
            Mobile Number <span class="required-asterisk">*</span>
          </label>
          <div class="phone-input-wrap">
            <span class="phone-prefix">+91</span>
            <input 
              type="tel" 
              id="page-early-phone" 
              name="phone" 
              placeholder="Enter 10-digit mobile number" 
              maxlength="10" 
              required 
            />
          </div>
        </div>

        <!-- 2. Email Address -->
        <div class="form-group">
          <label for="page-early-email" class="form-label">
            Email Address <span class="required-asterisk">*</span>
          </label>
          <input 
            type="email" 
            id="page-early-email" 
            name="email" 
            placeholder="your.email@example.com" 
            required 
          />
        </div>

        <!-- 3. Configuration Pills -->
        <div class="form-group">
          <label class="form-label">
            Configuration <span class="required-asterisk">*</span>
          </label>
          <div class="config-pill-grid" id="page-early-config-selector">
            <button type="button" class="cfg-pill active" data-cfg="2 BHK">2 BHK</button>
            <button type="button" class="cfg-pill" data-cfg="3 BHK">3 BHK</button>
            <button type="button" class="cfg-pill" data-cfg="4 BHK">4 BHK</button>
            <button type="button" class="cfg-pill" data-cfg="All Units">All Units</button>
          </div>
        </div>

        <!-- 2 Action Options -->
        <div class="options-container">
          <!-- Option 1: WhatsApp -->
          <button type="button" class="btn-option-whatsapp" id="page-early-whatsapp-btn">
            <div class="btn-label-row">
              <svg class="wa-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
              </svg>
              <span>Get Info via WhatsApp</span>
            </div>
            <span class="btn-subtext">Option 1 • Instant Details</span>
          </button>

          <!-- Option 2: Schedule Site Visit -->
          <button type="button" class="btn-option-visit" id="page-early-visit-btn">
            <div class="btn-label-row">
              <svg class="cal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
                <path d="m9 16 2 2 4-4"/>
              </svg>
              <span>Schedule Site Visit</span>
            </div>
            <span class="btn-subtext">Option 2 • Guided Tour</span>
          </button>
        </div>

        <!-- Authorized Partner Note -->
        <div class="partner-note-row">
          <svg class="shield-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <span>Marketed by Authorized Sales Partner: <strong>First Team</strong></span>
        </div>

        <!-- Privacy disclaimer -->
        <p class="privacy-disclaimer">
          🔒 100% Privacy Protected • Zero spam • Official pre-launch project updates only
        </p>
      </form>
    </div>
  </div>
</section>`,

  css: `/* ===== PRE-LAUNCH EARLY ACCESS SECTION STYLING ===== */
.early-access-page-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #0A192F 0%, #0f172a 100%);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.early-access-page-container {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.early-access-card {
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(226, 232, 240, 0.9);
  overflow: hidden;
}

.early-card-header {
  padding: 1.25rem 1.5rem;
  background: #0A192F;
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

.early-header-branding {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.early-brand-logo img {
  height: 2.25rem;
  width: auto;
  object-fit: contain;
}

.early-brand-text {
  border-left: 1px solid #334155;
  padding-left: 0.85rem;
}

.early-badge-pill {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
}

.early-page-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0.25rem 0 0;
  letter-spacing: -0.01em;
}

.early-notice-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fffbeb;
  border-bottom: 1px solid #fef3c7;
  padding: 0.65rem 1.5rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: #78350f;
}

.notice-sparkle {
  width: 0.95rem;
  height: 0.95rem;
  color: #d97706;
  flex-shrink: 0;
}

.early-access-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #334155;
}

.required-asterisk {
  color: #d97706;
}

.phone-input-wrap {
  display: flex;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.phone-input-wrap:focus-within {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.phone-prefix {
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  background: #f8fafc;
  border-right: 1px solid #cbd5e1;
  font-size: 0.82rem;
  font-weight: 700;
  color: #64748b;
}

.phone-input-wrap input {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.88rem;
  border: none;
  outline: none;
  font-weight: 600;
  color: #0f172a;
}

.form-group input[type="email"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.88rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-group input[type="email"]:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.config-pill-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
}

.cfg-pill {
  padding: 0.55rem 0.25rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cfg-pill:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.cfg-pill.active {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #78350f;
  font-weight: 800;
  box-shadow: 0 0 0 1px #f59e0b;
}

.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  padding: 0.5rem;
  border-radius: 0.85rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

@media (max-width: 480px) {
  .options-container {
    grid-template-columns: 1fr;
  }
}

.btn-option-whatsapp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.65rem;
  background: #ffffff;
  border: 2px solid #10b981;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-option-whatsapp:hover {
  background: #ecfdf5;
  transform: translateY(-1px);
}

.btn-label-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 800;
  font-size: 0.8rem;
}

.wa-icon {
  width: 1rem;
  height: 1rem;
  color: #059669;
  flex-shrink: 0;
}

.btn-subtext {
  font-size: 0.65rem;
  font-weight: 600;
  color: #047857;
  margin-top: 0.15rem;
}

.btn-option-visit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border-radius: 0.65rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  transition: all 0.15s ease;
}

.btn-option-visit:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
}

.btn-option-visit .btn-subtext {
  color: #fef3c7;
  font-weight: 500;
}

.cal-icon {
  width: 1rem;
  height: 1rem;
  color: #ffffff;
  flex-shrink: 0;
}

.partner-note-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: #64748b;
  padding-top: 0.25rem;
}

.shield-icon {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

.privacy-disclaimer {
  font-size: 0.68rem;
  color: #64748b;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.early-error-banner {
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.75rem;
  font-weight: 600;
}

.early-success-banner {
  padding: 1rem 1.25rem;
  border-radius: 0.65rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 1.5rem 0;
}

.success-check-icon {
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
}

.success-heading {
  font-size: 0.9rem;
  font-weight: 800;
  color: #065f46;
  margin: 0;
}

.success-sub {
  font-size: 0.75rem;
  color: #047857;
  margin: 0.15rem 0 0;
}`,

  js: `// ===== PRE-LAUNCH EARLY ACCESS SECTION INTERACTION =====
(function() {
  var selectedConfig = '2 BHK';
  var configPills = document.querySelectorAll('#page-early-config-selector .cfg-pill');
  configPills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      configPills.forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      selectedConfig = this.getAttribute('data-cfg') || '2 BHK';
    });
  });

  var errorBox = document.getElementById('page-early-error');
  var successBox = document.getElementById('page-early-success');
  var successMsg = document.getElementById('page-early-success-msg');
  var phoneInput = document.getElementById('page-early-phone');
  var emailInput = document.getElementById('page-early-email');
  var form = document.getElementById('page-early-access-form');

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }

  function hideError() {
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.style.display = 'none';
  }

  async function handleEarlySubmit(actionType) {
    hideError();
    var phone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    if (!phone || phone.length < 10) {
      showError('Please enter a valid 10-digit mobile number.');
      return;
    }

    var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    var defaultName = email.split('@')[0] || 'Homebuyer';
    var payload = {
      name: defaultName,
      phone: phone,
      email: email,
      configuration: selectedConfig,
      intent: actionType === 'whatsapp' ? 'WhatsApp Inquiry' : 'Schedule Site Visit',
      source: 'Page (/early-access) - ' + (actionType === 'whatsapp' ? 'WhatsApp' : 'Site Visit'),
      notes: 'Option: ' + (actionType === 'whatsapp' ? 'Option 1: Info via WhatsApp' : 'Option 2: Schedule Site Visit') + ' | Config: ' + selectedConfig
    };

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Lead submit note:', e);
    }

    if (actionType === 'whatsapp') {
      var textMsg = encodeURIComponent(
        'Hi Prestige Sales Desk, I would like to get complete project info (brochure, floor plans, and pricing) on WhatsApp for ' + selectedConfig + ' at Prestige Thane. My email is ' + email + '.'
      );
      window.open('https://api.whatsapp.com/send?phone=919022222448&text=' + textMsg, '_blank');
    }

    if (form) form.style.display = 'none';
    if (successBox) {
      if (successMsg) {
        successMsg.textContent = actionType === 'whatsapp'
          ? 'WhatsApp details opened in a new tab. Our sales desk will assist you shortly!'
          : 'Thank you! Your guided Site Visit for ' + selectedConfig + ' has been registered. Our representative will contact you on +91 ' + phone + '.';
      }
      successBox.style.display = 'flex';
    }
  }

  var waBtn = document.getElementById('page-early-whatsapp-btn');
  if (waBtn) {
    waBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleEarlySubmit('whatsapp');
    });
  }

  var visitBtn = document.getElementById('page-early-visit-btn');
  if (visitBtn) {
    visitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleEarlySubmit('visit');
    });
  }
})();`
};

