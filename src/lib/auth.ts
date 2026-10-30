import type { D1Database } from '@cloudflare/workers-types';

// Types
export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'business_owner';
  name: string | null;
  is_active: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: string;
}

// Constants
const JWT_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_EXPIRY = 7 * 24 * 60 * 60; // 7 days
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Password hashing using Web Crypto API (no bcrypt dependency needed)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordData = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  const hashArray = new Uint8Array(hash);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);

  return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const combined = Uint8Array.from(atob(storedHash), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const storedHashBytes = combined.slice(16);

    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const hash = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashArray = new Uint8Array(hash);

    if (hashArray.length !== storedHashBytes.length) return false;

    let result = 0;
    for (let i = 0; i < hashArray.length; i++) {
      result |= hashArray[i] ^ storedHashBytes[i];
    }

    return result === 0;
  } catch {
    return false;
  }
}

// JWT functions using Web Crypto API
export async function createJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + JWT_EXPIRY
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payloadB64 = btoa(JSON.stringify(fullPayload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${data}.${signatureB64}`;
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const data = `${headerB64}.${payloadB64}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode signature
    const signaturePadded = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const signatureBytes = Uint8Array.from(atob(signaturePadded), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(data));
    if (!valid) return null;

    // Decode payload
    const payloadPadded = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const payload: JWTPayload = JSON.parse(atob(payloadPadded));

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

// Generate secure random token
export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// Database helpers
export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const result = await db.prepare(
    'SELECT id, email, password_hash, role, name, is_active, failed_login_attempts, locked_until FROM users WHERE email = ? AND is_active = 1'
  ).bind(email.toLowerCase()).first();

  return result as User | null;
}

export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  const result = await db.prepare(
    'SELECT id, email, role, name, is_active FROM users WHERE id = ? AND is_active = 1'
  ).bind(id).first();

  return result as User | null;
}

export async function createSession(
  db: D1Database,
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<{ refreshToken: string; expiresAt: Date }> {
  const refreshToken = generateToken();
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRY * 1000);
  const id = generateToken().slice(0, 32);

  await db.prepare(
    'INSERT INTO sessions (id, user_id, refresh_token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, userId, refreshToken, expiresAt.toISOString(), ipAddress, userAgent).run();

  return { refreshToken, expiresAt };
}

export async function getSessionByToken(db: D1Database, refreshToken: string): Promise<Session | null> {
  const result = await db.prepare(
    'SELECT * FROM sessions WHERE refresh_token = ? AND expires_at > datetime("now")'
  ).bind(refreshToken).first();

  return result as Session | null;
}

export async function deleteSession(db: D1Database, refreshToken: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE refresh_token = ?').bind(refreshToken).run();
}

export async function deleteAllUserSessions(db: D1Database, userId: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();
}

export async function updateLastLogin(db: D1Database, userId: string): Promise<void> {
  await db.prepare(
    'UPDATE users SET last_login = datetime("now"), failed_login_attempts = 0, locked_until = NULL WHERE id = ?'
  ).bind(userId).run();
}

export async function incrementFailedAttempts(db: D1Database, email: string): Promise<void> {
  await db.prepare(`
    UPDATE users
    SET failed_login_attempts = failed_login_attempts + 1,
        locked_until = CASE
          WHEN failed_login_attempts + 1 >= ? THEN datetime('now', '+15 minutes')
          ELSE locked_until
        END
    WHERE email = ?
  `).bind(MAX_LOGIN_ATTEMPTS, email.toLowerCase()).run();
}

export async function isAccountLocked(db: D1Database, email: string): Promise<boolean> {
  const result = await db.prepare(
    'SELECT locked_until FROM users WHERE email = ? AND locked_until > datetime("now")'
  ).bind(email.toLowerCase()).first();

  return result !== null;
}

export async function logAuditEvent(
  db: D1Database,
  userId: string,
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: string,
  ipAddress?: string
): Promise<void> {
  await db.prepare(
    'INSERT INTO audit_log (user_id, action, resource_type, resource_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(userId, action, resourceType || null, resourceId || null, details || null, ipAddress || null).run();
}

// Cookie helpers
export function setAuthCookies(accessToken: string, refreshToken: string, expiresAt: Date): string[] {
  const secure = 'Secure;';
  const sameSite = 'SameSite=Strict;';

  return [
    `access_token=${accessToken}; HttpOnly; ${secure} ${sameSite} Path=/; Max-Age=${JWT_EXPIRY}`,
    `refresh_token=${refreshToken}; HttpOnly; ${secure} ${sameSite} Path=/api/auth; Max-Age=${REFRESH_EXPIRY}`
  ];
}

export function clearAuthCookies(): string[] {
  return [
    'access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=0'
  ];
}

export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length) {
      cookies[name] = rest.join('=');
    }
  });

  return cookies;
}
