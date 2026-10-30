const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'StrongCtaSection.ts',
    defaultTitle: 'Unlock Exclusive Pre-Launch Benefits',
    defaultSlug: 'strong-cta',
    sortOrder: 15,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding strong CTA template:', e);
  process.exit(1);
});
