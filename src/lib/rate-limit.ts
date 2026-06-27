import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitRouteId =
  | "auth-session-post"
  | "auth-session-delete"
  | "invite-get"
  | "invite-accept"
  | "tenants-post";

const LIMITS: Record<
  RateLimitRouteId,
  { requests: number; window: `${number} m` | `${number} s` }
> = {
  "auth-session-post": { requests: 10, window: "15 m" },
  "auth-session-delete": { requests: 30, window: "15 m" },
  "invite-get": { requests: 30, window: "15 m" },
  "invite-accept": { requests: 5, window: "15 m" },
  "tenants-post": { requests: 5, window: "15 m" },
};

let warnedMissingRedis = false;

function resolveRedisCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;
  return { url, token };
}

function getRedis(): Redis | null {
  const credentials = resolveRedisCredentials();
  if (!credentials) {
    if (process.env.NODE_ENV === "production" && !warnedMissingRedis) {
      warnedMissingRedis = true;
      console.warn(
        "[rate-limit] Redis REST credentials not set (UPSTASH_* or KV_REST_API_*) — rate limiting disabled",
      );
    }
    return null;
  }
  return new Redis(credentials);
}

const limiters = new Map<RateLimitRouteId, Ratelimit>();

function getLimiter(routeId: RateLimitRouteId): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  let limiter = limiters.get(routeId);
  if (!limiter) {
    const config = LIMITS[routeId];
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      prefix: `mesio:rl:${routeId}`,
      analytics: true,
    });
    limiters.set(routeId, limiter);
  }
  return limiter;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkRateLimit(
  routeId: RateLimitRouteId,
  identifier: string,
): Promise<RateLimitResult | null> {
  const limiter = getLimiter(routeId);
  if (!limiter) return null;

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function resolveRateLimitRoute(pathname: string, method: string): RateLimitRouteId | null {
  if (pathname === "/api/auth/session") {
    if (method === "POST") return "auth-session-post";
    if (method === "DELETE") return "auth-session-delete";
  }
  if (pathname === "/api/tenants" && method === "POST") return "tenants-post";
  if (method === "GET" && /^\/api\/invites\/[^/]+$/.test(pathname)) {
    return "invite-get";
  }
  if (method === "POST" && /^\/api\/invites\/[^/]+\/accept$/.test(pathname)) {
    return "invite-accept";
  }
  return null;
}
