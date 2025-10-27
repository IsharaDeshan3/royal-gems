import { NextResponse } from "next/server";
import { authService } from "@/lib/auth";

export async function POST() {
  try {
    console.log('Refresh - Attempting to refresh session');
    
    // Refresh the session using Supabase
    const authResponse = await authService.refreshSession();

    if (authResponse.error || !authResponse.session) {
      console.log('Refresh - Failed to refresh session:', authResponse.error);
      return NextResponse.json(
        { error: authResponse.error || "Failed to refresh session" },
        { status: 401 }
      );
    }

    const { session } = authResponse;

    console.log('Refresh - Session refreshed successfully');

    // Return success response
    const response = NextResponse.json({
      success: true,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
    });

    // Update session cookies
    response.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: session.expires_in || 3600,
      path: '/',
    });

    response.cookies.set("sb-refresh-token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
