import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env manually if not in process.env
const envPath = path.join(rootDir, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

// Arguments or environment variables
const args = process.argv.slice(2);
const adminName = args[2] || process.env.ADMIN_NAME || 'Super Admin';
const adminEmail = (args[0] || process.env.ADMIN_EMAIL || 'admin@prestige.com').toLowerCase().trim();
const adminPassword = args[1] || process.env.ADMIN_PASSWORD || 'Admin@123456';
const configuredUri =
  process.env.MONGODB_URI ||
  'mongodb+srv://jayesh:jayesh%40123@cluster0.9usafbn.mongodb.net/Prestige?retryWrites=true&w=majority&appName=Cluster0';

// Strictly Live MongoDB Atlas
const targetUris = [configuredUri];

// Define User Schema directly for the seeder script
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function seedTarget(uri) {
  const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');
  const label = isLocal ? 'Local MongoDB' : 'MongoDB Atlas';
  console.log('--------------------------------------------------');
  console.log(`⚡ Seeding ${label}: ${uri.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    const conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).asPromise();

    const User = conn.model('User', userSchema);
    const existingUser = await User.findOne({ email: adminEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    if (existingUser) {
      existingUser.name = adminName;
      existingUser.password = hashedPassword;
      existingUser.role = 'admin';
      existingUser.isActive = true;
      await existingUser.save();
      console.log(` Updated existing admin user in ${label}`);
    } else {
      const newAdmin = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      await newAdmin.save();
      console.log(` Created new admin user in ${label}`);
    }

    console.log(`   - Email:    ${adminEmail}`);
    console.log(`   - Password: ${adminPassword}`);
    console.log(`   - Role:     admin`);
    await conn.close();
  } catch (err) {
    if (isLocal) {
      console.log(`ℹ️ Note: Local MongoDB not running or skipped (${err.message})`);
    } else {
      console.error(`❌ Failed to seed ${label}:`, err.message);
    }
  }
}

async function seedAll() {
  console.log('==================================================');
  console.log(`🔐 Seeding Admin Credentials (${adminEmail} / ${adminPassword})`);
  console.log('==================================================');

  for (const uri of targetUris) {
    await seedTarget(uri);
  }

  console.log('--------------------------------------------------');
  console.log(' Admin user verification complete!');
  console.log('==================================================');
}

seedAll();

