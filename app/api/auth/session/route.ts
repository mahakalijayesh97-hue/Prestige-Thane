import { NextRequest, NextResponse } from 'next/server';
import {
  getServerBootId,
  SESSION_TIMEOUT_SECONDS,
  SESSION_TIMEOUT_MS,
  AdminSessionData,
} from '@/lib/auth-session';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('cms_admin_session');
    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(sessionCookie.value);
    } catch {
      const res = NextResponse.json({ user: null, reason: 'invalid_cookie' });
      res.cookies.delete('cms_admin_session');
      return res;
    }

    const session = parsed as AdminSessionData;
    if (!session || !session.user) {
      const res = NextResponse.json({ user: null });
      res.cookies.delete('cms_admin_session');
      return res;
    }

    const currentBootId = getServerBootId();

    // 1. Check if server was closed and restarted
    if (session.serverBootId && session.serverBootId !== currentBootId) {
      const res = NextResponse.json({
        user: null,
        reason: 'server_restarted',
        message: 'Server was closed and restarted. Please log in again.',
      });
      res.cookies.delete('cms_admin_session');
      return res;
    }

    // If serverBootId wasn't set, assign the current boot ID so it stays valid
    if (!session.serverBootId) {
      session.serverBootId = currentBootId;
    }

    // 2. Check 30-minute timeout expiry
    const now = Date.now();
    const lastActive = session.lastActive || session.createdAt || now;
    const isExpired = (session.expiresAt && now > session.expiresAt) || (now - lastActive > SESSION_TIMEOUT_MS);

    if (isExpired) {
      const res = NextResponse.json({
        user: null,
        reason: 'session_expired',
        message: 'Your 30-minute session has expired. Please log in again.',
      });
      res.cookies.delete('cms_admin_session');
      return res;
    }

    // Session is valid - update lastActive timestamp (activity heart-beat)
    session.lastActive = now;
    // Keep max lifetime at 30 minutes of inactivity
    session.expiresAt = now + SESSION_TIMEOUT_MS;

    const res = NextResponse.json({
      user: session.user,
      expiresIn: Math.round((session.expiresAt - now) / 1000),
    });

    res.cookies.set({
      name: 'cms_admin_session',
      value: JSON.stringify(session),
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT_SECONDS,
    });

    return res;
  } catch (err) {
    console.error('Session validation error:', err);
    return NextResponse.json({ user: null });
  }
}
