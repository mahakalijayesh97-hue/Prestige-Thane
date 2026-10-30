const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'AmenitiesSection.ts',
    defaultTitle: 'World-Class Amenities',
    defaultSlug: 'amenities',
    sortOrder: 6,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding amenities template:', e);
  process.exit(1);
});
