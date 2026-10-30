const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'LeadCaptureSection.ts',
    defaultTitle: 'Schedule a Site Visit & Get Brochure',
    defaultSlug: 'lead-capture',
    sortOrder: 14,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding lead capture template:', e);
  process.exit(1);
});
