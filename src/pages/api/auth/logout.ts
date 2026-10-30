import type { APIRoute } from 'astro';
import {
  deleteSession,
  parseCookies,
  clearAuthCookies,
  verifyJWT,
  logAuditEvent
} from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    const jwtSecret = (locals as any).runtime?.env?.JWT_SECRET;

    if (!db) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const refreshToken = cookies['refresh_token'];
    const accessToken = cookies['access_token'];

    // Try to get user ID for audit log
    let userId = 'unknown';
    if (accessToken && jwtSecret) {
      const payload = await verifyJWT(accessToken, jwtSecret);
      if (payload) {
        userId = payload.sub;
      }
    }

    // Delete session if refresh token exists
    if (refreshToken) {
      await deleteSession(db, refreshToken);
    }

    // Log audit event
    if (userId !== 'unknown') {
      const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
      await logAuditEvent(db, userId, 'logout', 'user', userId, null, ipAddress);
    }

    // Clear cookies
    const clearCookies = clearAuthCookies();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookies.join(', ')
      }
    });

  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even on error
    const clearCookies = clearAuthCookies();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookies.join(', ')
      }
    });
  }
};
