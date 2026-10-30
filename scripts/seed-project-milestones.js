const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'ProjectMilestoneSection.ts',
    defaultTitle: 'Project Timeline & Development Milestones',
    defaultSlug: 'project-milestones',
    sortOrder: 3,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding project milestones template:', e);
  process.exit(1);
});
