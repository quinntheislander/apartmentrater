/**
 * Simple in-memory rate limiter for API routes.
 *
 * Uses a sliding window approach. Each key (typically IP or IP+route)
 * tracks timestamps of recent requests. Expired entries are cleaned up
 * on each check.
 *
 * Note: This is per-process. In a multi-instance deployment, use Redis
 * or a similar shared store instead.
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const cutoff = now - windowMs
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter(t => t > cutoff)
    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  }
}

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number
  /** Max requests allowed in the window */
  maxRequests: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterMs: number | null
}

/**
 * Check if a request is allowed under the rate limit.
 *
 * @param key - Unique identifier (e.g., IP address, IP+route)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed and metadata
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const cutoff = now - config.windowMs

  cleanup(config.windowMs)

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter(t => t > cutoff)

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    const retryAfterMs = oldestInWindow + config.windowMs - now

    return {
      allowed: false,
      remaining: 0,
      retryAfterMs
    }
  }

  entry.timestamps.push(now)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    retryAfterMs: null
  }
}

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers)

  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

// Preset configurations for common use cases
export const RATE_LIMITS = {
  /** Auth endpoints: 10 requests per 15 minutes */
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 } as RateLimitConfig,
  /** Contact form: 5 requests per 15 minutes */
  contact: { windowMs: 15 * 60 * 1000, maxRequests: 5 } as RateLimitConfig,
  /** Data requests: 3 requests per hour */
  dataRequest: { windowMs: 60 * 60 * 1000, maxRequests: 3 } as RateLimitConfig,
  /** General API: 60 requests per minute */
  general: { windowMs: 60 * 1000, maxRequests: 60 } as RateLimitConfig,
  /** Residency verification: 5 attempts per hour — each one is a paid model call */
  residencyVerification: { windowMs: 60 * 60 * 1000, maxRequests: 5 } as RateLimitConfig,
} as const

/**
 * Helper to create a rate-limited NextResponse for denied requests.
 */
export function rateLimitResponse(result: RateLimitResult) {
  const retryAfterSeconds = result.retryAfterMs
    ? Math.ceil(result.retryAfterMs / 1000)
    : 60

  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    }
  )
}
