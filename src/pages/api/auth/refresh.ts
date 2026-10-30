import type { APIRoute } from 'astro';
import {
  getSessionByToken,
  getUserById,
  createJWT,
  deleteSession,
  createSession,
  parseCookies,
  setAuthCookies,
  clearAuthCookies
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

    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const refreshToken = cookies['refresh_token'];

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'No refresh token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get session
    const session = await getSessionByToken(db, refreshToken);
    if (!session) {
      const clearCookies = clearAuthCookies();
      return new Response(JSON.stringify({ error: 'Invalid or expired refresh token' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    }

    // Get user
    const user = await getUserById(db, session.user_id);
    if (!user) {
      await deleteSession(db, refreshToken);
      const clearCookies = clearAuthCookies();
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    }

    // Delete old session
    await deleteSession(db, refreshToken);

    // Create new tokens
    const accessToken = await createJWT(
      { sub: user.id, email: user.email, role: user.role },
      jwtSecret
    );

    const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const { refreshToken: newRefreshToken, expiresAt } = await createSession(db, user.id, ipAddress, userAgent);

    // Set new cookies
    const newCookies = setAuthCookies(accessToken, newRefreshToken, expiresAt);

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
        'Set-Cookie': newCookies.join(', ')
      }
    });

  } catch (error) {
    console.error('Refresh error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
