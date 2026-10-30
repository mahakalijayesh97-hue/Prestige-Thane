const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'MasterPlanSection.ts',
    defaultTitle: 'Integrated Master Plan & Layout',
    defaultSlug: 'master-plan',
    sortOrder: 7,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding master plan template:', e);
  process.exit(1);
});
