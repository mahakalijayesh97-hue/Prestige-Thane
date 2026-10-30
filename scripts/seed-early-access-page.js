const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'early-access-template.ts',
    defaultTitle: 'Prestige Thane - Pre-Launch Priority Access',
    defaultSlug: 'early-access',
    sortOrder: 17,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding early access template:', e);
  process.exit(1);
});
