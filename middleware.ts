import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getRepositoryFactory } from '@/lib/repositories';

const ADMIN_ROLES = new Set(['superadmin', 'admin', 'moderator']);
const userRepository = getRepositoryFactory(supabase).getUserRepository();

// Paths exempt from admin auth checks
const PUBLIC_ADMIN_PATHS = new Set(['/admin/login']);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public admin routes (login)
  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const csrfHeader = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get('csrfToken')?.value;
  const lastActivity = request.cookies.get('lastActivity')?.value;

  // Session idle timeout (15-30 min) from env, default 30m
  const sessionTimeoutMs = parseInt(process.env.SESSION_TIMEOUT || '1800000');
  if (!lastActivity || Date.now() - Number(lastActivity) > sessionTimeoutMs) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }

  // For state-changing requests, enforce CSRF header matches cookie
  const method = request.method.toUpperCase();
  const isMutating = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
  if (isMutating) {
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      const forbiddenUrl = new URL('/403', request.url);
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // Get Supabase session from cookies
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'unauthenticated');
    return NextResponse.redirect(loginUrl);
  }

  // Get user profile from our database
  const userProfile = await userRepository.findById(session.user.id);
  if (!userProfile) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'user_not_found');
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has admin role
  const role = userProfile.role;
  if (!ADMIN_ROLES.has(role)) {
    const forbiddenUrl = new URL('/403', request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  // Enforce stricter RBAC for certain paths
  if (pathname.startsWith('/admin/settings') && role !== 'superadmin') {
    const forbiddenUrl = new URL('/403', request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  // Update last activity (we'll use a custom cookie for this)
  const res = NextResponse.next();
  res.cookies.set('lastActivity', Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60,
    path: '/',
  });
  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
