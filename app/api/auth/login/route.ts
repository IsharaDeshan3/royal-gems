import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getRepositoryFactory } from "@/lib/repositories";
import { isAdmin } from "@/lib/auth/roles";

export async function POST(request: NextRequest) {
  let response: NextResponse;
  const responseCookies: Array<{ name: string; value: string; options: CookieOptions }> = [];
  
  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          responseCookies.push({ name, value, options });
        },
        remove(name: string, options: CookieOptions) {
          responseCookies.push({ name, value: '', options });
        },
      },
    }
  );

  try {
    const { email, password, twoFactorToken } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign in with Supabase Auth
    console.log('Login debug - Attempting sign in for:', email);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Login debug - Auth response:', {
      hasUser: !!authData?.user,
      hasSession: !!authData?.session,
      error: authError
    });

    if (authError || !authData.session) {
      console.log('Login debug - Auth error:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Authentication failed' },
        { status: 401 }
      );
    }

    const { user, session } = authData;

    // Update last login - don't fail auth if this fails
    try {
      const repositories = getRepositoryFactory(supabase);
      const userRepo = repositories.getUserRepository();
      await userRepo.updateLastLogin(user.id);
      console.log('Login debug - Updated last login');
    } catch (loginUpdateError) {
      console.warn('Login debug - Failed to update last login:', loginUpdateError);
    }

    // Get user profile from our database
    const repositories = getRepositoryFactory();
    const userRepo = repositories.getUserRepository();
    const userProfile = await userRepo.findById(user.id);

    console.log('Login debug - User ID:', user.id);
    console.log('Login debug - User Profile:', userProfile);

    if (!userProfile) {
      console.log('Login debug - User profile not found');
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!userProfile.is_active) {
      console.log('Login debug - User not active');
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Check role-based access (admin panel requirement)
    console.log('Login debug - User role:', userProfile.role);
    console.log('Login debug - Is admin?', isAdmin(userProfile.role));
    if (!isAdmin(userProfile.role)) {
      console.log('Login debug - Access denied due to role');
      return NextResponse.json(
        { error: "Access denied. Insufficient privileges." },
        { status: 403 }
      );
    }

    // Handle 2FA if enabled
    if (userProfile.two_factor_enabled) {
      if (!twoFactorToken) {
        return NextResponse.json(
          {
            error: "Two-factor authentication token required",
            requires2FA: true,
          },
          { status: 200 }
        );
      }

      // Verify 2FA token (simplified - in production use proper TOTP library)
      if (twoFactorToken.length !== 6) {
        return NextResponse.json(
          { error: "Invalid 2FA code" },
          { status: 401 }
        );
      }
    }

    // Return success response with user data
    response = NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        twoFactorEnabled: userProfile.two_factor_enabled,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
    });

    // Set all cookies that Supabase SSR client wants to set
    responseCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    // Set lastActivity cookie to prevent immediate expiration
    response.cookies.set('lastActivity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    console.log('Login debug - Response prepared with cookies');

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
