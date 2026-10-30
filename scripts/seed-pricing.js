const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'PriceSection.ts',
    defaultTitle: 'Official Price List & Configurations',
    defaultSlug: 'pricing',
    sortOrder: 4,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding pricing template:', e);
  process.exit(1);
});
