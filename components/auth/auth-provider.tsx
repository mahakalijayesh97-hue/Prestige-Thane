'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';

const THIRTY_MINUTES_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  signOut: (reason?: string) => Promise<void>;
  setUser: (user: AdminUser | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const lastActivityRef = useRef<number>(Date.now());
  const lastServerCheckRef = useRef<number>(Date.now());
  const signingOutRef = useRef<boolean>(false);
  const userRef = useRef<AdminUser | null>(null);

  const handleSetUser = useCallback((newUser: AdminUser | null) => {
    setUser(newUser);
    userRef.current = newUser;
    if (newUser) {
      signingOutRef.current = false;
      lastActivityRef.current = Date.now();
      lastServerCheckRef.current = Date.now();
      try {
        localStorage.setItem('cms_admin_user', JSON.stringify(newUser));
        localStorage.setItem('cms_admin_last_activity', String(Date.now()));
      } catch {}
    } else {
      try {
        localStorage.removeItem('cms_admin_user');
        localStorage.removeItem('cms_admin_last_activity');
      } catch {}
    }
  }, []);

  const signOut = useCallback(
    async (reason?: string) => {
      if (signingOutRef.current) return;
      signingOutRef.current = true;

      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // ignore
      }
      try {
        const supabase = getSupabaseBrowser();
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      handleSetUser(null);

      const redirectUrl = reason
        ? `/admin/login?reason=${encodeURIComponent(reason)}`
        : '/admin/login';

      if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
        window.location.replace(redirectUrl);
      }
    },
    [handleSetUser]
  );

  // Initial Auth Verification directly with server session
  useEffect(() => {
    let mounted = true;

    // Fast local restore on client mount for instant render
    try {
      const stored = localStorage.getItem('cms_admin_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          userRef.current = parsed;
          setLoading(false);
        }
      }
    } catch {}

    async function initAuth() {
      try {
        // Always verify against server session endpoint
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            if (data.user) {
              setUser(data.user);
              userRef.current = data.user;
              lastActivityRef.current = Date.now();
              try {
                localStorage.setItem('cms_admin_user', JSON.stringify(data.user));
                localStorage.setItem('cms_admin_last_activity', String(Date.now()));
              } catch {}
            } else {
              // Server restarted or session expired
              handleSetUser(null);
              if (
                data.reason &&
                typeof window !== 'undefined' &&
                window.location.pathname.startsWith('/admin') &&
                window.location.pathname !== '/admin/login'
              ) {
                window.location.href = `/admin/login?reason=${encodeURIComponent(data.reason)}`;
              }
            }
          }
        } else {
          if (mounted) handleSetUser(null);
        }
      } catch {
        if (mounted) handleSetUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, [handleSetUser]);

  // 30-Minute Inactivity & Auto-Logout Tracker
  useEffect(() => {
    if (!user) return;

    // Record user interaction on the page
    const updateActivity = () => {
      const now = Date.now();
      // Throttle updating timestamp to once every 5 seconds
      if (now - lastActivityRef.current > 5000) {
        lastActivityRef.current = now;
        localStorage.setItem('cms_admin_last_activity', String(now));
      }
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, updateActivity, { passive: true });
    });

    // Check timer every 10 seconds for 30-minute inactivity or server restart
    const interval = setInterval(async () => {
      if (signingOutRef.current) return;

      const now = Date.now();
      const last = lastActivityRef.current || now;

      // 1. Check client-side 30-minute inactivity
      if (now - last >= THIRTY_MINUTES_MS) {
        console.warn('Admin session expired after 30 minutes of inactivity. Logging out...');
        clearInterval(interval);
        await signOut('session_expired');
        return;
      }

      // 2. Periodic background verification once every 2 minutes
      if (now - lastServerCheckRef.current >= 120000) {
        lastServerCheckRef.current = now;
        try {
          const res = await fetch('/api/auth/session', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (!data.user && !signingOutRef.current) {
              console.warn('Session invalidated by server:', data.reason);
              clearInterval(interval);
              await signOut(data.reason || 'session_expired');
            }
          }
        } catch {
          // ignore transient network errors
        }
      }
    }, 10000);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, updateActivity);
      });
      clearInterval(interval);
    };
  }, [user, signOut]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
