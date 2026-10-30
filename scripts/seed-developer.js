const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'DeveloperSection.ts',
    defaultTitle: 'About Prestige Group - The Developer',
    defaultSlug: 'developer',
    sortOrder: 12,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding developer template:', e);
  process.exit(1);
});
