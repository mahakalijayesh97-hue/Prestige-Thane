// Guard Node.js 20+ / 24+ WebStreams against client aborts in Next.js streaming
function patchStreamController(ctor) {
  if (!ctor || !ctor.prototype) return;
  const proto = ctor.prototype;
  if (proto.__nextjs_stream_patched) return;

  const origEnqueue = proto.enqueue;
  proto.enqueue = function (chunk) {
    try {
      return origEnqueue.call(this, chunk);
    } catch (err) {
      if (
        err &&
        (err.code === 'ERR_INVALID_STATE' ||
          (typeof err.message === 'string' && err.message.includes('already closed')))
      ) {
        return;
      }
      throw err;
    }
  };

  const origClose = proto.close;
  proto.close = function () {
    try {
      return origClose.call(this);
    } catch (err) {
      if (
        err &&
        (err.code === 'ERR_INVALID_STATE' ||
          (typeof err.message === 'string' && err.message.includes('already closed')))
      ) {
        return;
      }
      throw err;
    }
  };

  proto.__nextjs_stream_patched = true;
}

if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.ReadableByteStreamController !== 'undefined') {
    patchStreamController(globalThis.ReadableByteStreamController);
  }
  if (typeof globalThis.ReadableStreamDefaultController !== 'undefined') {
    patchStreamController(globalThis.ReadableStreamDefaultController);
  }
}

const fs = require('fs');
const path = require('path');

// Initialize a stable server boot identifier for this server process run
try {
  const bootFile = path.join(__dirname, '.next', 'server_boot.id');
  fs.mkdirSync(path.join(__dirname, '.next'), { recursive: true });
  const newBootId = 'boot_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  fs.writeFileSync(bootFile, newBootId, 'utf8');
  if (typeof globalThis !== 'undefined') {
    globalThis.__CMS_SERVER_BOOT_ID = newBootId;
  }
} catch (e) {}

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Aggressive caching for static assets (fonts, JS, CSS) — improves repeat-visit performance
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
