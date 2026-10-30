const mongoose = require('mongoose');
const { runWithAllDatabases } = require('./env-loader');

const DEFAULT_NAV = [
  { label: 'Overview', url: '/overview', sort_order: 0 },
  { label: 'Pricing', url: '#pricing', sort_order: 1 },
  { label: 'Amenities', url: '/amenities', sort_order: 2 },
  { label: 'Floor Plans', url: '/floor-plans', sort_order: 3 },
  { label: 'Gallery', url: '/gallery', sort_order: 4 },
  { label: 'Location', url: '/location', sort_order: 5 },
  { label: 'FAQ', url: '/faq', sort_order: 6 },
];

const NavItemSchema = new mongoose.Schema(
  {
    supabase_id: String,
    label: String,
    url: String,
    parent_id: String,
    sort_order: Number,
    target: { type: String, default: '_self' },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

async function seedNav() {
  await runWithAllDatabases('nav', async (conn, label) => {
    const NavItem = conn.models.NavItem || conn.model('NavItem', NavItemSchema);
    await NavItem.deleteMany({});

    for (const it of DEFAULT_NAV) {
      await NavItem.create({
        label: it.label,
        url: it.url,
        parent_id: null,
        sort_order: it.sort_order,
        target: '_self',
        is_active: true,
      });
    }

    const count = await NavItem.countDocuments();
    console.log(`[${label}] Seeded ${count} navigation links`);
  });

  process.exit(0);
}

seedNav().catch((err) => {
  console.error('Error seeding nav:', err);
  process.exit(1);
});
