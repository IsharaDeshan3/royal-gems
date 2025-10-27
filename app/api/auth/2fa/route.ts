import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { authService } from "@/lib/auth/service";
import { getRepositoryFactory } from "@/lib/repositories";
import { generate2FASecret, generateQRCode } from "@/lib/security/auth";
import speakeasy from "speakeasy";
import bcrypt from "bcryptjs";

const userRepository = getRepositoryFactory(supabase).getUserRepository();

export async function POST(request: NextRequest) {
  try {
    const authUser = await authService.getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const dbUser = await userRepository.findById(authUser.id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.two_factor_enabled) {
      return NextResponse.json(
        { error: "Two-factor authentication is already enabled" },
        { status: 400 }
      );
    }

    // Generate 2FA secret
    const { secret, otpauthUrl } = generate2FASecret(authUser.email!);
    const qrCode = otpauthUrl ? await generateQRCode(otpauthUrl) : null;

    // Store the secret temporarily (not enabled until verified)
    await userRepository.updateTwoFactorSecret(authUser.id, secret);

    // Log action (we'll implement this later with audit log repository)
    // await auditLogRepository.create({
    //   user_id: authUser.id,
    //   action: "2FA_ENABLE",
    //   entity_type: "user",
    //   entity_id: authUser.id,
    //   details: { step: "secret_generated" },
    //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
    //   user_agent: request.headers.get("user-agent") || "unknown",
    //   success: true
    // });

    return NextResponse.json({
      success: true,
      qrCode,
      secret, // Backup codes could be generated here
    });
  } catch (error) {
    console.error("2FA setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await authService.getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const dbUser = await userRepository.findById(authUser.id);
    if (!dbUser || !dbUser.two_factor_secret) {
      return NextResponse.json(
        { error: "No 2FA setup in progress" },
        { status: 400 }
      );
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: dbUser.two_factor_secret,
      encoding: "base32",
      token,
      window: 2,
    });

    if (!verified) {
      // Log failed attempt
      // await auditLogRepository.create({
      //   user_id: authUser.id,
      //   action: "2FA_ENABLE",
      //   entity_type: "user",
      //   entity_id: authUser.id,
      //   details: { step: "verification_failed" },
      //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
      //   user_agent: request.headers.get("user-agent") || "unknown",
      //   success: false,
      //   error_message: "Invalid verification token"
      // });

      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Enable 2FA
    await userRepository.enableTwoFactor(authUser.id, dbUser.two_factor_secret);

    // Log success
    // await auditLogRepository.create({
    //   user_id: authUser.id,
    //   action: "2FA_ENABLE",
    //   entity_type: "user",
    //   entity_id: authUser.id,
    //   details: { step: "enabled" },
    //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
    //   user_agent: request.headers.get("user-agent") || "unknown",
    //   success: true
    // });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await authService.getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to disable 2FA" },
        { status: 400 }
      );
    }

    const dbUser = await userRepository.findById(authUser.id);
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // For Supabase Auth, we need to verify the password by attempting to sign in
    // This is a simplified approach - in production, you might want to use Supabase's reauthentication
    const signInResult = await authService.signIn({
      email: authUser.email!,
      password: password
    });

    if (signInResult.error) {
      // Log failed attempt
      // await auditLogRepository.create({
      //   user_id: authUser.id,
      //   action: "2FA_DISABLE",
      //   entity_type: "user",
      //   entity_id: authUser.id,
      //   details: { step: "password_verification_failed" },
      //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
      //   user_agent: request.headers.get("user-agent") || "unknown",
      //   success: false,
      //   error_message: "Invalid password"
      // });

      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Disable 2FA
    await userRepository.disableTwoFactor(authUser.id);

    // Log success
    // await auditLogRepository.create({
    //   user_id: authUser.id,
    //   action: "2FA_DISABLE",
    //   entity_type: "user",
    //   entity_id: authUser.id,
    //   details: { step: "disabled" },
    //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
    //   user_agent: request.headers.get("user-agent") || "unknown",
    //   success: true
    // });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication disabled successfully",
    });
  } catch (error) {
    console.error("2FA disable error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
