/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at startup
 */

interface EnvConfig {
  // Required variables (will throw if missing)
  required: string[];
  // Optional variables (will warn if missing in production)
  optional: string[];
}

const envConfig: EnvConfig = {
  required: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  optional: [
    'SUPABASE_SERVICE_ROLE_KEY',
    'PAYHERE_MERCHANT_ID',
    'PAYHERE_MERCHANT_SECRET',
    'PAYHERE_SANDBOX',
    'NEXT_PUBLIC_BASE_URL',
    'SESSION_TIMEOUT',
  ],
};

/**
 * Validate that all required environment variables are present
 * Call this at application startup
 */
export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const key of envConfig.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check optional variables in production
  if (process.env.NODE_ENV === 'production') {
    for (const key of envConfig.optional) {
      if (!process.env[key]) {
        warnings.push(key);
      }
    }
  }

  // Log warnings for optional missing variables
  if (warnings.length > 0) {
    console.warn(
      `⚠️  Missing optional environment variables: ${warnings.join(', ')}`
    );
  }

  // Throw error for required missing variables
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
      `Please add them to your .env.local file or Vercel environment settings.`
    );
  }
}

/**
 * Get an environment variable with a default value
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

/**
 * Get an environment variable as a number
 */
export function getEnvNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} is not a valid number: ${value}`);
  }
  return num;
}

/**
 * Get an environment variable as a boolean
 */
export function getEnvBoolean(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value.toLowerCase() === 'true';
}
