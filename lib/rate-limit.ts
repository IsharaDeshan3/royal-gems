/**
 * Rate Limiting Utility
 * Protects API endpoints from abuse
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  uniqueTokenPerInterval?: number; // Max requests per interval
  interval?: number; // Time window in milliseconds
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const {
    uniqueTokenPerInterval = 10,
    interval = 60 * 1000, // 1 minute default
  } = config;

  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + interval,
    });

    return {
      success: true,
      limit: uniqueTokenPerInterval,
      remaining: uniqueTokenPerInterval - 1,
      reset: now + interval,
    };
  }

  // Increment count
  entry.count++;

  if (entry.count > uniqueTokenPerInterval) {
    return {
      success: false,
      limit: uniqueTokenPerInterval,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit: uniqueTokenPerInterval,
    remaining: uniqueTokenPerInterval - entry.count,
    reset: entry.resetTime,
  };
}

// Helper to get rate limit identifier from request
export function getRateLimitIdentifier(req: Request): string {
  // Try to get IP from headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Strict rate limit for authentication endpoints
  auth: (identifier: string) =>
    rateLimit(identifier, {
      uniqueTokenPerInterval: 5, // 5 requests
      interval: 15 * 60 * 1000, // per 15 minutes
    }),

  // Moderate rate limit for API endpoints
  api: (identifier: string) =>
    rateLimit(identifier, {
      uniqueTokenPerInterval: 30, // 30 requests
      interval: 60 * 1000, // per minute
    }),

  // Strict rate limit for payment endpoints
  payment: (identifier: string) =>
    rateLimit(identifier, {
      uniqueTokenPerInterval: 3, // 3 requests
      interval: 60 * 1000, // per minute
    }),

  // Very strict for critical operations
  critical: (identifier: string) =>
    rateLimit(identifier, {
      uniqueTokenPerInterval: 2, // 2 requests
      interval: 5 * 60 * 1000, // per 5 minutes
    }),
};
