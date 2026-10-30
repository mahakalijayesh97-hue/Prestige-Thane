const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'FloorPlanSection.ts',
    defaultTitle: 'Master Plan & Floor Plans',
    defaultSlug: 'floor-plans',
    sortOrder: 5,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding floor plans template:', e);
  process.exit(1);
});
