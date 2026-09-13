import { NextRequest } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store for rate limiting by IP
const rateLimitMap = new Map<string, RateLimitRecord>();

// Configuration: max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 15;      // Max 15 requests per minute per IP
const MAX_MAP_SIZE = 5000;    // Prevent unbounded memory growth

/**
 * Extracts client IP from Next.js request headers or fallback.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}

/**
 * Checks whether an IP has exceeded the rate limit.
 * Returns { success: true } if allowed, or { success: false, retryAfter: seconds } if limited.
 */
export function checkRateLimit(req: NextRequest): { success: boolean; retryAfter?: number } {
  const ip = getClientIp(req);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Periodic cleanup if map grows too large
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    for (const [key, record] of rateLimitMap.entries()) {
      const active = record.timestamps.filter((ts) => ts > windowStart);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        record.timestamps = active;
      }
    }
  }

  const record = rateLimitMap.get(ip) ?? { timestamps: [] };
  // Filter out timestamps outside current window
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    const oldest = recentTimestamps[0];
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { success: false, retryAfter: Math.max(retryAfter, 1) };
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, { timestamps: recentTimestamps });
  return { success: true };
}
