import fs from 'fs';
import path from 'path';

export const SESSION_TIMEOUT_SECONDS = 30 * 60; // 30 minutes (1800 seconds)
export const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_SECONDS * 1000;

export interface AdminSessionData {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  serverBootId?: string;
  createdAt: number;
  lastActive: number;
  expiresAt: number;
}

/**
 * Returns a stable server boot identifier.
 * Persists in memory (globalThis) and on disk (.next/server_boot.id)
 * so that it NEVER changes during Next.js hot-reloads, fast-refreshes,
 * or module recompilations.
 * It ONLY changes when the developer actually stops and restarts the server process.
 */
export function getServerBootId(): string {
  if (process.env.NODE_ENV === 'test') {
    return 'test-boot-id';
  }

  // 1. Check in-memory globalThis (persists across module re-evaluations in the same Node process)
  if (typeof globalThis !== 'undefined' && (globalThis as any).__CMS_SERVER_BOOT_ID) {
    return (globalThis as any).__CMS_SERVER_BOOT_ID;
  }

  // 2. Check disk file created when server started
  try {
    const bootFile = path.join(process.cwd(), '.next', 'server_boot.id');
    if (fs.existsSync(bootFile)) {
      const saved = fs.readFileSync(bootFile, 'utf8').trim();
      if (saved) {
        if (typeof globalThis !== 'undefined') {
          (globalThis as any).__CMS_SERVER_BOOT_ID = saved;
        }
        return saved;
      }
    }

    // 3. Fallback: generate and save once
    const newBootId = 'boot_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
    fs.mkdirSync(path.join(process.cwd(), '.next'), { recursive: true });
    fs.writeFileSync(bootFile, newBootId, 'utf8');
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__CMS_SERVER_BOOT_ID = newBootId;
    }
    return newBootId;
  } catch {
    const fallback = 'boot_active_session';
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__CMS_SERVER_BOOT_ID = fallback;
    }
    return fallback;
  }
}
