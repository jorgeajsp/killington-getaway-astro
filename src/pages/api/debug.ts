import type { APIRoute } from 'astro';
import { getUserByEmail, verifyPassword } from '../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;

  return new Response(JSON.stringify({
    hasRuntime: !!runtime,
    hasEnv: !!runtime?.env,
    envKeys: runtime?.env ? Object.keys(runtime.env) : [],
    hasDB: !!runtime?.env?.DB,
    hasJwtSecret: !!runtime?.env?.JWT_SECRET
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });
    }

    const body = await request.json();
    const { email, password, action } = body;

    // Generate hash action
    if (action === 'hash') {
      const { hashPassword } = await import('../../lib/auth');
      const hash = await hashPassword(password);
      return new Response(JSON.stringify({ hash }), { status: 200 });
    }

    // Update password action - DISABLED IN PRODUCTION
    // if (action === 'update') {
    //   const { hashPassword } = await import('../../lib/auth');
    //   const hash = await hashPassword(password);
    //   await db.prepare('UPDATE users SET password_hash = ? WHERE email = ?')
    //     .bind(hash, email.toLowerCase()).run();
    //   return new Response(JSON.stringify({ success: true, hash }), { status: 200 });
    // }

    const user = await getUserByEmail(db, email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found', email }), { status: 404 });
    }

    const passwordHash = (user as any).password_hash;

    try {
      const valid = await verifyPassword(password, passwordHash);
      return new Response(JSON.stringify({
        user: { id: (user as any).id, email: user.email },
        hashLength: passwordHash?.length,
        valid
      }), { status: 200 });
    } catch (err: any) {
      return new Response(JSON.stringify({
        error: 'Password verify failed',
        message: err.message
      }), { status: 500 });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({
      error: 'Debug failed',
      message: err.message
    }), { status: 500 });
  }
};
