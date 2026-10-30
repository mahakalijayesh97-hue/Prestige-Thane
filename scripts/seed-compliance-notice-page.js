const { seedPageFromTemplate } = require('./env-loader');

async function run() {
  await seedPageFromTemplate({
    templateFile: 'ComplianceNoticeStrip.ts',
    defaultTitle: 'Legal Disclaimer & RERA Compliance Notice',
    defaultSlug: 'compliance-notice',
    sortOrder: 1,
  });
  process.exit(0);
}

run().catch((e) => {
  console.error('Error seeding compliance notice template:', e);
  process.exit(1);
});
