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

  // Session idle timeout (15-30 min) from env, default 30m
  const sessionTimeoutMs = parseInt(process.env.SESSION_TIMEOUT || '1800000');
  console.log('Middleware debug - Pathname:', pathname);
  console.log('Middleware debug - Last activity cookie:', lastActivity);
  console.log('Middleware debug - Current time:', Date.now());
  console.log('Middleware debug - Session timeout (ms):', sessionTimeoutMs);

  // Ensure lastActivity cookie is set if missing
  if (!lastActivity) {
    console.log('Middleware debug - Setting initial lastActivity cookie');
    response.cookies.set('lastActivity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return response;
  }

  if (Date.now() - Number(lastActivity) > sessionTimeoutMs) {
    console.log('Middleware debug - Session expired, redirecting to login');
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
  let session = null;
  let sessionError = null;
  
  try {
    const sessionResult = await supabase.auth.getSession();
    session = sessionResult.data.session;
    sessionError = sessionResult.error;
  } catch (error) {
    console.log('Middleware debug - Error getting session:', error);
    sessionError = error;
  }

  console.log('Middleware debug - Session check:', {
    hasSession: !!session,
    hasError: !!sessionError,
    userId: session?.user?.id
  });

  if (sessionError || !session) {
    console.log('Middleware debug - No valid session, redirecting to login');
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'unauthenticated');
    return NextResponse.redirect(loginUrl);
  }

  // Get user profile from our database
  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(session.user.id);
  
  console.log('Middleware debug - User profile:', {
    found: !!userProfile,
    role: userProfile?.role
  });

  if (!userProfile) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('reason', 'user_not_found');
    return NextResponse.redirect(loginUrl);
  }

  // Check if user has admin role
  const role = userProfile.role;
  if (!ADMIN_ROLES.has(role)) {
    console.log('Middleware debug - Access denied, insufficient role');
    const forbiddenUrl = new URL('/403', request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  // Enforce stricter RBAC for certain paths
  if (pathname.startsWith('/admin/settings') && 
      role.toLowerCase() !== 'superadmin') {
    const forbiddenUrl = new URL('/403', request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  console.log('Middleware debug - Access granted, updating lastActivity');

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
