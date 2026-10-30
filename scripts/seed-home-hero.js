const { seedPageFromTemplate } = require('./env-loader');

async function seed() {
  await seedPageFromTemplate({
    templateFile: 'hero-template.ts',
    defaultTitle: 'Home',
    defaultSlug: 'home',
    overrideSlug: 'home',
    isHomepage: true,
    sortOrder: 0,
    heroImage: '/assets/prestige-hero-bg.webp',
  });
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding home hero:', err);
  process.exit(1);
});
