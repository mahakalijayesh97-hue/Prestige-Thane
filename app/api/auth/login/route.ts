import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/User';
import {
  getServerBootId,
  SESSION_TIMEOUT_SECONDS,
  SESSION_TIMEOUT_MS,
} from '@/lib/auth-session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid login credentials.' },
        { status: 401 }
      );
    }

    if (user.isActive === false) {
      return NextResponse.json(
        { error: 'This account has been deactivated.' },
        { status: 403 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid login credentials.' },
        { status: 401 }
      );
    }

    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const now = Date.now();
    const currentBootId = getServerBootId();
    const sessionData = {
      user: userData,
      serverBootId: currentBootId,
      createdAt: now,
      lastActive: now,
      expiresAt: now + SESSION_TIMEOUT_MS,
    };

    const response = NextResponse.json({
      ok: true,
      user: userData,
      expiresIn: SESSION_TIMEOUT_SECONDS,
    });

    // Set 30-minute session cookie tied to current server boot instance
    response.cookies.set({
      name: 'cms_admin_session',
      value: JSON.stringify(sessionData),
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT_SECONDS, // Exactly 30 minutes
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

