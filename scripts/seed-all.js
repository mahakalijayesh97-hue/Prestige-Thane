const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure .env is loaded
require('./env-loader');

const scriptsToRun = [
  'patch-next-sigint.js',
  'seed-admin.mjs',
  'seed-home-hero.js',
  'seed-project-overview.js',
  'seed-why-prestige.js',
  'seed-pricing.js',
  'seed-floor-plans.js',
  'seed-amenities.js',
  'seed-gallery.js',
  'seed-location.js',
  'seed-master-plan.js',
  'seed-pre-launch-advantage.js',
  'seed-project-milestones.js',
  'seed-developer.js',
  'seed-lead-capture.js',
  'seed-strong-cta.js',
  'seed-faq.js',
  'seed-compliance-notice-page.js',
  'seed-early-access-page.js',
  'seed-nav.js',
  'seed-media.js',
  'seed-custom-footer.js',
];

console.log('========================================================');
console.log('🚀 Running Unified Seeder across configured MongoDB DBs');
console.log('Target MONGODB_URI:', (process.env.MONGODB_URI || 'mongodb+srv://jayesh:jayesh%40123@cluster0.9usafbn.mongodb.net/Prestige').replace(/:([^:@]+)@/, ':****@'));
console.log('========================================================');

let passed = 0;
let failed = 0;

for (const scriptName of scriptsToRun) {
  const scriptPath = path.join(__dirname, scriptName);
  if (!fs.existsSync(scriptPath)) {
    console.warn(`⚠️ Skipped missing script: ${scriptName}`);
    continue;
  }

  process.stdout.write(`⏳ Seeding: ${scriptName}... `);
  try {
    execSync(`node "${scriptPath}"`, {
      stdio: 'pipe',
      env: process.env,
    });
    console.log('✅ Done');
    passed++;
  } catch (err) {
    console.log('❌ Failed');
    console.error(`   ${err.message}`);
    failed++;
  }
}

console.log('========================================================');
console.log(`🎉 Seeding Summary: ${passed} succeeded, ${failed} failed.`);
console.log('All page templates, navigation, admin credentials, media,');
console.log('and footer settings are synchronized in your database!');
console.log('========================================================');

process.exit(failed > 0 ? 1 : 0);

