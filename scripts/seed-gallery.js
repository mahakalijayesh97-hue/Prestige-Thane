const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'GallerySection.ts',
    defaultTitle: 'Project Visual Gallery',
    defaultSlug: 'gallery',
    sortOrder: 9,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding gallery template:', e);
  process.exit(1);
});
