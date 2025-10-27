import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/auth";
import { getRepositoryFactory } from "@/lib/repositories";

export async function GET(request: NextRequest) {
  try {
    // Get current user from Supabase Auth
    const user = await authService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile from our database
    const repositories = getRepositoryFactory();
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
        phone: userProfile.phone,
        role: userProfile.role,
        isActive: userProfile.is_active,
        isVerified: userProfile.is_verified,
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
    // Get current user from Supabase Auth
    const user = await authService.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, phone } = await request.json();

    // Update user profile
    const repositories = getRepositoryFactory();
    const userRepo = repositories.getUserRepository();

    const updatedUser = await userRepo.updateProfile(user.id, {
      first_name: firstName,
      last_name: lastName,
      phone: phone,
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
        phone: updatedUser.phone,
        role: updatedUser.role,
        isActive: updatedUser.is_active,
        isVerified: updatedUser.is_verified,
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
