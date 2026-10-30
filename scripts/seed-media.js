const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { runWithAllDatabases } = require('./env-loader');

const MediaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, default: 'image' },
    size: { type: Number, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

async function seedMedia() {
  const publicDir = path.join(__dirname, '../public');
  const itemsToSync = [
    {
      filePath: path.join(publicDir, 'assets/thumbs/prestige-entrance-gate.webp'),
      url: '/assets/thumbs/prestige-entrance-gate.webp',
      defaultName: 'Grand Entrance Gate & Iconic Sunset Towers (Elevation)',
    },
    {
      filePath: path.join(publicDir, 'assets/thumbs/prestige-aerial-lifestyle.webp'),
      url: '/assets/thumbs/prestige-aerial-lifestyle.webp',
      defaultName: 'Resort-Style Swimming Pool & Aqua Deck',
    },
    {
      filePath: path.join(publicDir, 'assets/thumbs/prestige-luxury-living-view.webp'),
      url: '/assets/thumbs/prestige-luxury-living-view.webp',
      defaultName: 'Grand Lifestyle Clubhouse & Luxury Residences View',
    },
    {
      filePath: path.join(publicDir, 'assets/prestige-hero-bg.webp'),
      url: '/assets/prestige-hero-bg.webp',
      defaultName: 'Aerial Master Township Overview across 30+ Acres',
    },
    {
      filePath: path.join(publicDir, 'uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png'),
      url: '/uploads/logo_1792837373812_Prestige_Group_Eagle_Emblem.png',
      defaultName: 'Prestige Group Official Emblem Logo',
    },
  ];

  await runWithAllDatabases('media', async (conn, label) => {
    const Media = conn.models.Media || conn.model('Media', MediaSchema);

    for (const item of itemsToSync) {
      let size = null;
      let birthtime = new Date();
      if (fs.existsSync(item.filePath)) {
        const stats = fs.statSync(item.filePath);
        size = stats.size;
        birthtime = stats.birthtime || new Date();
      }

      await Media.findOneAndUpdate(
        { url: item.url },
        {
          $set: {
            name: item.defaultName,
            url: item.url,
            type: 'image',
            size,
            created_at: birthtime,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    const count = await Media.countDocuments();
    console.log(`[${label}] Seeded ${count} media gallery assets`);
  });

  process.exit(0);
}

seedMedia().catch((err) => {
  console.error('Seed Media error:', err);
  process.exit(1);
});
