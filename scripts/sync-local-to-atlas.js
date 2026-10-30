require('./env-loader');
const mongoose = require('mongoose');

async function syncAll() {
  const localUri = 'mongodb://127.0.0.1:27017/cms_database';
  const atlasUri = process.env.MONGODB_URI;

  if (!atlasUri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('========================================================');
  console.log('🔄 Syncing Local Database to MongoDB Atlas');
  console.log('Source (Local):', localUri);
  console.log('Target (Atlas):', atlasUri.replace(/:([^:@]+)@/, ':****@'));
  console.log('========================================================');

  const localConn = await mongoose.createConnection(localUri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  }).asPromise();

  const atlasConn = await mongoose.createConnection(atlasUri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
  }).asPromise();

  const collections = await localConn.db.listCollections().toArray();
  console.log(`Found ${collections.length} collections in Local MongoDB.`);

  for (const colInfo of collections) {
    const colName = colInfo.name;
    const localCollection = localConn.collection(colName);
    const atlasCollection = atlasConn.collection(colName);

    const docs = await localCollection.find({}).toArray();

    if (docs.length === 0) {
      try {
        await atlasConn.db.createCollection(colName);
        console.log(`📁 Created collection "${colName}" in Atlas`);
      } catch (err) {
        // already exists
      }
      continue;
    }

    let syncedCount = 0;
    for (const doc of docs) {
      const { _id, ...rest } = doc;
      let filter = { _id };

      if (colName === 'users' && rest.email) {
        filter = { email: rest.email };
      } else if (colName === 'pages' && rest.slug) {
        filter = { slug: rest.slug };
      } else if (colName === 'media' && rest.url) {
        filter = { url: rest.url };
      } else if (colName === 'forms' && rest.title) {
        filter = { title: rest.title };
      }

      await atlasCollection.updateOne(
        filter,
        { $set: rest },
        { upsert: true }
      );
      syncedCount++;
    }

    console.log(`✅ Synced collection "${colName}": ${syncedCount} document(s) transferred to Atlas`);
  }

  console.log('========================================================');
  console.log('🎉 All collections and documents successfully synced to Atlas!');
  console.log('========================================================');

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

syncAll().catch((err) => {
  console.error('❌ Sync error:', err);
  process.exit(1);
});
