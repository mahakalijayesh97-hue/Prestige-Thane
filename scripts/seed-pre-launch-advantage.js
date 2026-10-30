const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'PreLaunchAdvantageSection.ts',
    defaultTitle: 'Pre-Launch Advantages & Priority Booking',
    defaultSlug: 'pre-launch-advantage',
    sortOrder: 10,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding pre-launch advantage template:', e);
  process.exit(1);
});
