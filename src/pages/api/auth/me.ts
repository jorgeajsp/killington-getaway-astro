import type { APIRoute } from 'astro';
import {
  verifyJWT,
  getUserById,
  parseCookies,
  clearAuthCookies
} from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
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
    const accessToken = cookies['access_token'];

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify JWT
    const payload = await verifyJWT(accessToken, jwtSecret);
    if (!payload) {
      const clearCookies = clearAuthCookies();
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    }

    // Get user from database
    const user = await getUserById(db, payload.sub);
    if (!user) {
      const clearCookies = clearAuthCookies();
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookies.join(', ')
        }
      });
    }

    return new Response(JSON.stringify({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Me error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
