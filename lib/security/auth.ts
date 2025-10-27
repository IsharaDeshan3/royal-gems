import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12");

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const validatePasswordStrength = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// 2FA utilities
export const generate2FASecret = (email: string) => {
  const secret = speakeasy.generateSecret({
    name: `Royal Gems Institute (${email})`,
    issuer: "Royal Gems Institute",
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  return QRCode.toDataURL(otpauthUrl);
};

export const verify2FAToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 2,
  });
};

// CSRF utilities
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const verifyCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  return token === sessionToken;
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
};

export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Rate limiting utilities
export const createRateLimitKey = (ip: string, action: string): string => {
  return `rate_limit:${action}:${ip}`;
};

// File upload security
export const validateFileType = (
  mimeType: string,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(mimeType);
};

export const generateSecureFilename = (originalName: string): string => {
  const ext = originalName.split(".").pop();
  const randomName = crypto.randomBytes(16).toString("hex");
  return `${randomName}.${ext}`;
};

export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};
