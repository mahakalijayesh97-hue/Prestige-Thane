const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Live Server MongoDB Atlas connection string
const LIVE_ATLAS_URI =
  'mongodb+srv://jayesh:jayesh%40123@cluster0.9usafbn.mongodb.net/Prestige?retryWrites=true&w=majority&appName=Cluster0';

// 1. Automatically load .env file from project root into process.env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (val) {
        process.env[key] = val;
      }
    }
  }
}

// 2. Resolve target URI: strictly Live MongoDB Atlas
function getTargetUris() {
  let uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
    uri = LIVE_ATLAS_URI;
  }
  return [uri];
}

// 3. Shared Page Schema
const PageSchema = new mongoose.Schema(
  {
    supabase_id: String,
    title: String,
    slug: String,
    status: { type: String, default: 'published' },
    content: String,
    seo_title: String,
    meta_description: String,
    meta_keywords: String,
    hero_image: String,
    is_homepage: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// 4. Live Server database runner
async function runWithAllDatabases(taskName, taskFn) {
  const uris = getTargetUris();
  let successCount = 0;

  for (const uri of uris) {
    const label = 'MongoDB Atlas Live Server';
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');

    try {
      const conn = await mongoose.createConnection(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      }).asPromise();

      const Page = conn.models.Page || conn.model('Page', PageSchema);
      await taskFn(conn, Page, label);
      await conn.close();
      successCount++;
    } catch (err) {
      console.error(`❌ [${label}] Error in ${taskName} (${maskedUri}):`, err.message);
    }
  }

  return successCount;
}

// 5. Generic Page Seeder Helper
async function seedPageFromTemplate({
  templateFile,
  defaultTitle,
  defaultSlug,
  sortOrder = 0,
  isHomepage = false,
  heroImage = '',
  overrideSlug = null,
}) {
  const templatePath = path.join(__dirname, '../lib/templates', templateFile);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const templateRaw = fs.readFileSync(templatePath, 'utf8');

  const titleMatch = templateRaw.match(/title:\s*['"]([^'"]+)['"]/);
  const slugMatch = templateRaw.match(/slug:\s*['"]([^'"]+)['"]/);
  const statusMatch = templateRaw.match(/status:\s*['"]([^'"]+)['"]/);
  const seoTitleMatch = templateRaw.match(/seo_title:\s*['"]([^'"]+)['"]/);
  const metaDescMatch = templateRaw.match(/meta_description:\s*['"]([^'"]+)['"]/);
  const metaKeysMatch = templateRaw.match(/meta_keywords:\s*['"]([^'"]+)['"]/);

  const htmlMatch = templateRaw.match(/html:\s*`([\s\S]*?)`,\s*\n\s*css:/);
  const cssMatch = templateRaw.match(/css:\s*`([\s\S]*?)`,\s*\n\s*js:/);
  const jsMatch = templateRaw.match(/js:\s*`([\s\S]*?)`[\s\n]*,?\s*\n\};/);

  const title = titleMatch ? titleMatch[1] : defaultTitle;
  const slug = overrideSlug || (slugMatch ? slugMatch[1] : defaultSlug);
  const status = statusMatch ? statusMatch[1] : 'published';
  const seo_title = seoTitleMatch ? seoTitleMatch[1] : title;
  const meta_description = metaDescMatch ? metaDescMatch[1] : '';
  const meta_keywords = metaKeysMatch ? metaKeysMatch[1] : '';

  const html = htmlMatch ? htmlMatch[1] : '';
  const css = cssMatch ? cssMatch[1] : '';
  const js = jsMatch ? jsMatch[1] : '';

  let combined = '';
  if (css && css.trim()) {
    combined +=
      '<!-- CUSTOM_PAGE_CSS_START -->\n<style id="custom-page-css">\n' +
      css.trim() +
      '\n</style>\n<!-- CUSTOM_PAGE_CSS_END -->\n';
  }
  combined += html || '';
  if (js && js.trim()) {
    combined +=
      '\n<!-- CUSTOM_PAGE_JS_START -->\n<script id="custom-page-js">\n' +
      js.trim() +
      '\n</script>\n<!-- CUSTOM_PAGE_JS_END -->';
  }

  await runWithAllDatabases(slug, async (conn, Page, label) => {
    const filter = isHomepage ? { $or: [{ is_homepage: true }, { slug: 'home' }] } : { slug };

    const pageDoc = await Page.findOneAndUpdate(
      filter,
      {
        $set: {
          title,
          slug,
          status,
          content: combined,
          seo_title,
          meta_description,
          meta_keywords,
          is_homepage: isHomepage,
          sort_order: sortOrder,
          ...(heroImage ? { hero_image: heroImage } : {}),
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`[${label}] Page "${pageDoc.slug}" upserted: ${pageDoc.title}`);
  });
}

module.exports = {
  getTargetUris,
  PageSchema,
  runWithAllDatabases,
  seedPageFromTemplate,
};
