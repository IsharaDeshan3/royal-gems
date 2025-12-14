import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getRepositoryFactory } from '@/lib/repositories';

const ADMIN_ROLES = new Set(['superadmin', 'admin', 'moderator', 'SuperAdmin', 'Admin', 'Moderator']);

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

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with cookie handling for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const csrfHeader = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get('csrfToken')?.value;
  const lastActivity = request.cookies.get('lastActivity')?.value;

  // Session idle timeout - default 1 minute (60000ms) for admin security
  // Can be overridden via SESSION_TIMEOUT environment variable
  const sessionTimeoutMs = parseInt(process.env.SESSION_TIMEOUT || '60000');

  // Get Supabase session from cookies first
  let session = null;
  let sessionError = null;
  
  try {
    const sessionResult = await supabase.auth.getSession();
    session = sessionResult.data.session;
    sessionError = sessionResult.error;
  } catch (error) {
    sessionError = error;
  }

  // If no session, redirect to login
  if (sessionError || !session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'unauthenticated');
    return NextResponse.redirect(loginUrl);
  }

  // Check lastActivity for idle timeout - only if lastActivity exists
  // If no lastActivity cookie, set it (first request after login)
  if (!lastActivity) {
    response.cookies.set('lastActivity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  } else if (Date.now() - Number(lastActivity) > sessionTimeoutMs) {
    // Session has been idle too long
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

  // Get user profile from our database
  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(session.user.id);

  if (!userProfile) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'user_not_found');
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has admin role (case-insensitive)
  const role = userProfile.role;
  if (!ADMIN_ROLES.has(role)) {
    const forbiddenUrl = new URL('/403', request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  // Enforce stricter RBAC for certain paths
  if (pathname.startsWith('/admin/settings') && 
      role.toLowerCase() !== 'superadmin') {
    const forbiddenUrl = new URL('/403', request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  // Update last activity (we'll use a custom cookie for this)
  response.cookies.set('lastActivity', Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
