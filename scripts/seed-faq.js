const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'FaqSection.ts',
    defaultTitle: 'Frequently Asked Questions',
    defaultSlug: 'faq',
    sortOrder: 13,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding FAQ template:', e);
  process.exit(1);
});
