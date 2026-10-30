const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'LocationSection.ts',
    defaultTitle: 'Prime Location & Seamless Connectivity',
    defaultSlug: 'location',
    sortOrder: 8,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding location template:', e);
  process.exit(1);
});
