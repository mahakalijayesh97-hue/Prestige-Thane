export const LEAD_CAPTURE_SECTION_TEMPLATE = {
  title: 'Lead Capture & Early Registration',
  slug: 'lead-capture',
  status: 'published',
  seo_title: 'Register for Early Access | Prestige Thane Pre-Launch Desk',
  meta_description: 'Register your interest today and receive official updates on launch timing, architectural layouts, site progress, and early priority allotment for Prestige Thane.',
  meta_keywords: 'Prestige Thane lead registration, early access registration, pre launch desk Thane, book site visit Prestige Thane',

  html: `<section class="lead-capture-section font-sans scroll-mt-20" id="lead-capture">
  <div class="lead-capture-container">
    <div class="lead-capture-card">
      
      <!-- Subtle gold accent top border -->
      <div class="lead-card-accent-bar"></div>

      <!-- Heading & Subheading -->
      <div class="lead-header">
        <div class="lead-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sparkles-icon">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4"/>
            <path d="M19 17v4"/>
            <path d="M3 5h4"/>
            <path d="M17 19h4"/>
          </svg>
          <span>PRE-LAUNCH PRIORITY DESK</span>
        </div>

        <h2 class="lead-main-title">
          Be the First to Know About Prestige Thane
        </h2>

        <p class="lead-sub-desc">
          Register your interest today and receive updates on launch timing, architectural layouts, site progress and early priority availability.
        </p>
      </div>

      <!-- Form -->
      <form class="lead-form" id="main-lead-capture-form" novalidate>
        
        <!-- Error Message Alert -->
        <div class="lead-error-box" id="lead-form-error" style="display: none;"></div>

        <!-- Success Message Alert -->
        <div class="lead-success-box" id="lead-form-success" style="display: none;"></div>

        <!-- 3 Input Fields Grid -->
        <div class="lead-inputs-grid">
          
          <!-- Full Name -->
          <div class="lead-input-group">
            <label for="lead-input-name" class="lead-input-label">
              Full Name <span class="lead-req-star">*</span>
            </label>
            <input
              type="text"
              id="lead-input-name"
              name="name"
              required
              placeholder="e.g. Rahul Sharma"
              class="lead-input-field"
              autocomplete="name"
            />
          </div>

          <!-- Mobile Number with +91 Prefix -->
          <div class="lead-input-group">
            <label for="lead-input-phone" class="lead-input-label">
              Mobile Number <span class="lead-req-star">*</span>
            </label>
            <div class="lead-phone-wrapper">
              <span class="lead-phone-prefix">+91</span>
              <input
                type="tel"
                id="lead-input-phone"
                name="phone"
                required
                maxlength="10"
                inputmode="numeric"
                pattern="[0-9]{10}"
                placeholder="90222 22448"
                class="lead-phone-field"
                autocomplete="tel"
              />
            </div>
          </div>

          <!-- Email Address -->
          <div class="lead-input-group">
            <label for="lead-input-email" class="lead-input-label">
              Email Address
            </label>
            <input
              type="email"
              id="lead-input-email"
              name="email"
              placeholder="name@company.com"
              class="lead-input-field"
              autocomplete="email"
              inputmode="email"
            />
          </div>

        </div>

        <!-- Interest Radio Selection -->
        <div class="lead-intent-section">
          <span class="lead-intent-label">I am interested in:</span>
          
          <div class="lead-intent-grid">
            <label class="lead-intent-option active" id="intent-opt-buying">
              <input type="radio" name="lead-intent" value="Buying" checked class="lead-sr-only" />
              <span>Self-Use / End Home Buying</span>
            </label>

            <label class="lead-intent-option" id="intent-opt-investment">
              <input type="radio" name="lead-intent" value="Investment" class="lead-sr-only" />
              <span>Real Estate Investment</span>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          id="lead-capture-submit-btn"
          class="lead-submit-btn"
        >
          <span>GET EARLY ACCESS</span>
        </button>

        <!-- Privacy & Consent Notice -->
        <div class="lead-privacy-note">
          <p class="lead-consent-text">
            “By submitting this form, you agree to be contacted regarding this project and related property information.”
          </p>
          <div class="lead-lock-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lock-icon">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Your privacy is strictly respected. Zero spam policy.</span>
          </div>
        </div>

      </form>

    </div>
  </div>
</section>`,

  css: `/* ===== LEAD CAPTURE SECTION STYLES ===== */
.lead-capture-section {
  padding: 4rem 1rem 5rem;
  background-color: #FAF9F5;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .lead-capture-section {
    padding: 5rem 1.5rem;
  }
}

.lead-capture-section * {
  box-sizing: border-box;
}

.lead-capture-container {
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 0.5rem;
}

@media (min-width: 640px) {
  .lead-capture-container {
    padding: 0 1.5rem;
  }
}

.lead-capture-card {
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

@media (min-width: 640px) {
  .lead-capture-card {
    border-radius: 2rem;
    padding: 3rem 2.5rem;
  }
}

.lead-card-accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.375rem;
  background: linear-gradient(to right, #fbbf24, #d97706, #fbbf24);
}

/* HEADER */
.lead-header {
  text-align: center;
  max-width: 42rem;
  margin: 0 auto 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lead-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background-color: #fef3c7;
  color: #78350f;
  border: 1px solid #fde68a;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  width: fit-content;
  margin: 0 auto;
}

.sparkles-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #d97706;
}

.lead-main-title {
  font-size: 1.75rem;
  line-height: 1.25;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin: 0;
}

@media (min-width: 640px) {
  .lead-main-title {
    font-size: 2.25rem;
  }
}

.lead-sub-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

@media (min-width: 640px) {
  .lead-sub-desc {
    font-size: 1rem;
  }
}

/* FORM */
.lead-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lead-error-box {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.75rem;
  font-weight: 600;
}

.lead-success-box {
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
}

.lead-inputs-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .lead-inputs-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.lead-input-group {
  display: flex;
  flex-direction: column;
}

.lead-input-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #334155;
  margin-bottom: 0.4rem;
}

.lead-req-star {
  color: #b45309;
}

.lead-input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.lead-input-field:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.lead-phone-wrapper {
  display: flex;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.lead-phone-wrapper:focus-within {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
}

.lead-phone-prefix {
  display: inline-flex;
  align-items: center;
  padding: 0 0.85rem;
  background-color: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  border-right: 1px solid #cbd5e1;
  user-select: none;
}

.lead-phone-field {
  flex: 1;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  font-size: 0.875rem;
  color: #0f172a;
  outline: none;
}

/* INTENT SELECTOR */
.lead-intent-section {
  display: flex;
  flex-direction: column;
}

.lead-intent-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #334155;
  margin-bottom: 0.5rem;
}

.lead-intent-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .lead-intent-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

.lead-intent-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  background-color: #ffffff;
  transition: all 0.2s ease;
  user-select: none;
}

.lead-intent-option:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.lead-intent-option.active {
  border-color: #d97706;
  background-color: #fffbeb;
  color: #78350f;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(217, 119, 6, 0.12);
}

.lead-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* SUBMIT BUTTON */
.lead-submit-btn {
  width: 100%;
  padding: 1.05rem 1.5rem;
  border-radius: 0.75rem;
  background-color: #0A192F;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(10, 25, 47, 0.25);
  transition: all 0.25s ease;
}

.lead-submit-btn:hover {
  background-color: #1e293b;
  box-shadow: 0 20px 25px -5px rgba(10, 25, 47, 0.35);
  transform: translateY(-1px);
}

.lead-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* PRIVACY NOTE */
.lead-privacy-note {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: center;
  padding-top: 0.5rem;
}

.lead-consent-text {
  font-size: 0.75rem;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.lead-lock-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  color: #64748b;
}

.lock-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #94a3b8;
}
`,

  js: `// Lead Capture Section Form Submission & API Integration
(function() {
  const form = document.getElementById('main-lead-capture-form');
  if (!form) return;

  const errorBox = document.getElementById('lead-form-error');
  const successBox = document.getElementById('lead-form-success');
  const submitBtn = document.getElementById('lead-capture-submit-btn');

  const intentOptions = form.querySelectorAll('.lead-intent-option');
  let selectedIntent = 'Buying';

  // Radio toggle visual state
  intentOptions.forEach(function(opt) {
    opt.addEventListener('click', function() {
      intentOptions.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedIntent = radio.value;
      }
    });
  });

  // Form Submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (errorBox) { errorBox.style.display = 'none'; errorBox.textContent = ''; }
    if (successBox) { successBox.style.display = 'none'; successBox.textContent = ''; }

    const nameInput = document.getElementById('lead-input-name');
    const phoneInput = document.getElementById('lead-input-phone');
    const emailInput = document.getElementById('lead-input-email');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    let email = emailInput ? emailInput.value.trim() : '';

    if (!name) {
      if (errorBox) {
        errorBox.textContent = 'Please enter your full name.';
        errorBox.style.display = 'block';
      }
      if (nameInput) nameInput.focus();
      return;
    }

    if (!phone || phone.length < 10) {
      if (errorBox) {
        errorBox.textContent = 'Please enter a valid 10-digit mobile number.';
        errorBox.style.display = 'block';
      }
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!email) {
      email = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@prestigethane.lead';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'REGISTERING YOUR INTEREST...';
    }

    try {
      // 1. Submit lead to database API
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          configuration: '2 BHK',
          intent: selectedIntent === 'Investment' ? 'Real Estate Investment' : 'End Home Buying',
          source: 'Main Lead Capture Section Form',
          notes: 'Registered from pre-launch priority desk'
        })
      });

      // 2. Also save to localStorage for sync
      try {
        const stored = JSON.parse(localStorage.getItem('prestige_leads') || '[]');
        stored.unshift({
          name: name,
          phone: phone,
          email: email,
          intent: selectedIntent,
          source: 'Main Lead Capture Section Form',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('prestige_leads', JSON.stringify(stored));
      } catch (err) {}

      if (successBox) {
        successBox.textContent = 'Thank you, ' + name + '! Your pre-launch priority pass request has been registered. Our representative will contact you on +91 ' + phone + ' shortly.';
        successBox.style.display = 'block';
      }

      form.reset();
      intentOptions.forEach(o => o.classList.remove('active'));
      const buyOpt = document.getElementById('intent-opt-buying');
      if (buyOpt) buyOpt.classList.add('active');
      selectedIntent = 'Buying';

    } catch (err) {
      console.warn('Lead submission error:', err);
      if (successBox) {
        successBox.textContent = 'Thank you, ' + name + '! Your interest has been submitted successfully.';
        successBox.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'GET EARLY ACCESS';
      }
    }
  });
})();
`,
};

