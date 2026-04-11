/**
 * Simple in-memory rate limiter.
 *
 * Good enough for single-server deployments and development.
 * For production at scale, swap this with @upstash/ratelimit + Redis:
 *
 *   import { Ratelimit } from '@upstash/ratelimit';
 *   import { Redis } from '@upstash/redis';
 *   const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(10, '60 s') });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 60_000);

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is within the rate limit.
 *
 * @param key - Unique identifier (e.g. IP address, user ID)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60 seconds)
 */
export function rateLimit(key: string, limit: number, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
