/**
 * CSRF Protection Utility
 * Protects against Cross-Site Request Forgery attacks
 */

import crypto from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');

// In-memory store for tokens (use Redis in production)
const tokenStore = new Map<string, { token: string; expiresAt: number }>();

// Cleanup expired tokens every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of tokenStore.entries()) {
    if (data.expiresAt < now) {
      tokenStore.delete(sessionId);
    }
  }
}, 10 * 60 * 1000);

/**
 * Generate a CSRF token for a session
 */
export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  tokenStore.set(sessionId, { token, expiresAt });

  return token;
}

/**
 * Verify a CSRF token
 */
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = tokenStore.get(sessionId);

  if (!stored) {
    return false;
  }

  if (stored.expiresAt < Date.now()) {
    tokenStore.delete(sessionId);
    return false;
  }

  return stored.token === token;
}

/**
 * Get CSRF token from request headers or body
 */
export function getCSRFTokenFromRequest(req: Request): string | null {
  // Check header first
  const headerToken = req.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // For form submissions, token would be in body
  // This needs to be called after reading the body
  return null;
}

/**
 * Middleware helper to verify CSRF token
 */
export async function verifyCSRF(req: Request, sessionId: string): Promise<boolean> {
  // Skip CSRF check for GET, HEAD, OPTIONS
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const token = getCSRFTokenFromRequest(req);
  if (!token) {
    return false;
  }

  return verifyCSRFToken(sessionId, token);
}

/**
 * Generate CSRF token for response
 */
export function createCSRFCookie(sessionId: string): { name: string; value: string; options: any } {
  const token = generateCSRFToken(sessionId);

  return {
    name: 'csrf-token',
    value: token,
    options: {
      httpOnly: false, // Needs to be accessible by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    },
  };
}
