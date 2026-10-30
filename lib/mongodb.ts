import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Live Server MongoDB Atlas connection string
const LIVE_ATLAS_URI =
  'mongodb+srv://jayesh:jayesh%40123@cluster0.9usafbn.mongodb.net/Prestige?retryWrites=true&w=majority&appName=Cluster0';

export function getMongoUri(): string {
  // 1. Read fresh from .env if present
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('MONGODB_URI=')) {
          const val = trimmed.replace('MONGODB_URI=', '').trim().replace(/^["']|["']$/g, '');
          if (val && !val.includes('127.0.0.1') && !val.includes('localhost')) {
            return val;
          }
        }
      }
    }
  } catch {}

  // 2. Read from process.env if set to Atlas
  const envUri = process.env.MONGODB_URI;
  if (envUri && !envUri.includes('127.0.0.1') && !envUri.includes('localhost')) {
    return envUri;
  }

  // 3. Fallback strictly to Live Atlas Server
  return LIVE_ATLAS_URI;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    uri: string | null;
  } | undefined;
}

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null, uri: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const targetUri = getMongoUri();

  // If already connected to target Live Atlas database
  if (
    cached!.conn &&
    cached!.conn.connection &&
    cached!.conn.connection.readyState === 1 &&
    cached!.uri === targetUri &&
    cached!.conn.connection.name === 'Prestige'
  ) {
    return cached!.conn;
  }

  // If connected to local or old database, disconnect first
  if (cached!.conn) {
    try {
      await mongoose.disconnect();
    } catch {}
    cached!.conn = null;
    cached!.promise = null;
    cached!.uri = null;
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
  };

  cached!.uri = targetUri;
  cached!.promise = mongoose.connect(targetUri, opts).then((instance) => {
    return instance;
  });

  try {
    cached!.conn = await cached!.promise;
  } catch (error) {
    cached!.promise = null;
    cached!.uri = null;
    throw error;
  }

  return cached!.conn;
}

export default connectToDatabase;
