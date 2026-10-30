import type { APIRoute } from 'astro';
import {
  getUserByEmail,
  verifyPassword,
  createJWT,
  createSession,
  updateLastLogin,
  incrementFailedAttempts,
  isAccountLocked,
  logAuditEvent,
  setAuthCookies
} from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    const jwtSecret = (locals as any).runtime?.env?.JWT_SECRET;

    if (!db || !jwtSecret) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if account is locked
    if (await isAccountLocked(db, email)) {
      return new Response(JSON.stringify({ error: 'Account temporarily locked. Try again in 15 minutes.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user
    const user = await getUserByEmail(db, email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const passwordHash = (user as any).password_hash;
    const validPassword = await verifyPassword(password, passwordHash);

    if (!validPassword) {
      await incrementFailedAttempts(db, email);
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create JWT
    const accessToken = await createJWT(
      { sub: user.id, email: user.email, role: user.role },
      jwtSecret
    );

    // Create refresh token session
    const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const { refreshToken, expiresAt } = await createSession(db, user.id, ipAddress, userAgent);

    // Update last login
    await updateLastLogin(db, user.id);

    // Log audit event
    await logAuditEvent(db, user.id, 'login', 'user', user.id, null, ipAddress);

    // Set cookies
    const cookies = setAuthCookies(accessToken, refreshToken, expiresAt);

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookies.join(', ')
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
