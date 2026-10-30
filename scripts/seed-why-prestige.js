const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'WhyPrestigeSection.ts',
    defaultTitle: 'Why Choose Prestige Thane',
    defaultSlug: 'why-prestige',
    sortOrder: 11,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding why prestige template:', e);
  process.exit(1);
});
