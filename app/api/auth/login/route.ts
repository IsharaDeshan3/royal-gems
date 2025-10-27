import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth";
import { getRepositoryFactory } from "@/lib/repositories";

export async function POST(request: NextRequest) {
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
    const authResponse = await authService.signIn({ email, password });

    if (authResponse.error) {
      return NextResponse.json(
        { error: authResponse.error },
        { status: 401 }
      );
    }

    const { user, session } = authResponse;

    // Get user profile from our database
    const repositories = getRepositoryFactory();
    const userRepo = repositories.getUserRepository();
    const userProfile = await userRepo.findById(user.id);

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if user is active
    if (!userProfile.is_active) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    // Check role-based access (admin panel requirement)
    if (!["superadmin", "admin", "moderator"].includes(userProfile.role)) {
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

      // Verify 2FA token
      const twoFactorResult = await authService.verify2FA({ code: twoFactorToken });
      if (twoFactorResult.error) {
        return NextResponse.json(
          { error: twoFactorResult.error },
          { status: 401 }
        );
      }
    }

    // Return success response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        twoFactorEnabled: userProfile.two_factor_enabled,
        isVerified: userProfile.is_verified,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
    });

    // Set session cookies for client-side access
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: session.expires_in || 3600,
    });

    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
