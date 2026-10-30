const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'ProjectOverviewSection.ts',
    defaultTitle: 'Project Overview',
    defaultSlug: 'project-overview',
    sortOrder: 2,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding project overview template:', e);
  process.exit(1);
});
