import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getRepositoryFactory } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  try {
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
            // Not needed for GET request
          },
          remove(name: string, options: CookieOptions) {
            // Not needed for GET request
          },
        },
      }
    );

    // Get current user from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile from our database
    const repositories = getRepositoryFactory(supabase);
    const userRepo = repositories.getUserRepository();
    const userProfile = await userRepo.findById(user.id);

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        isActive: userProfile.is_active,
        twoFactorEnabled: userProfile.two_factor_enabled,
        lastLogin: userProfile.last_login,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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
            // Not needed for PUT request
          },
          remove(name: string, options: CookieOptions) {
            // Not needed for PUT request
          },
        },
      }
    );

    // Get current user from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName } = await request.json();

    // Update user profile
    const repositories = getRepositoryFactory(supabase);
    const userRepo = repositories.getUserRepository();

    const updatedUser = await userRepo.updateProfile(user.id, {
      first_name: firstName,
      last_name: lastName,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 });
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role,
        isActive: updatedUser.is_active,
        twoFactorEnabled: updatedUser.two_factor_enabled,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
