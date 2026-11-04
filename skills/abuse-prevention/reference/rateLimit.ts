/**
 * Fixed-window rate limiting, independent of any web framework.
 *
 * - A `CounterStore` does one thing: increment a key and give it an expiry on first use.
 *   Use `MemoryStore` on a single long-running machine. On serverless or with more than
 *   one instance, implement the interface over a shared store (Redis/Upstash: INCR, then
 *   EXPIRE when the result is 1), otherwise every cold start resets the counts.
 * - Key buckets on something the caller cannot rotate: a verified account id, or the client
 *   IP as reported by your platform. Never on raw headers the client controls.
 * - If the store fails, the request is allowed (fail open) and `storeError` is set, so an
 *   outage of the limiter does not take the service down with it. Log it.
 */

export interface CounterStore {
  /** Increment `key` and return the new count. The key expires `windowSeconds` after its first increment. */
  increment(key: string, windowSeconds: number): Promise<{ count: number; resetInSeconds: number }>;
}

export interface LimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window ends. Use it for `Retry-After`. */
  resetInSeconds: number;
  storeError?: unknown;
}

/** In-process store for a single machine. Counts are lost on restart. */
export class MemoryStore implements CounterStore {
  private readonly windows = new Map<string, { count: number; endsAt: number }>();
  constructor(private readonly now: () => number = Date.now, private readonly maxKeys = 50_000) {}

  async increment(key: string, windowSeconds: number) {
    const t = this.now();
    let w = this.windows.get(key);
    if (!w || w.endsAt <= t) {
      if (this.windows.size >= this.maxKeys) this.sweep(t);
      w = { count: 0, endsAt: t + windowSeconds * 1000 };
      this.windows.set(key, w);
    }
    w.count += 1;
    return { count: w.count, resetInSeconds: Math.max(1, Math.ceil((w.endsAt - t) / 1000)) };
  }

  private sweep(t: number) {
    for (const [k, w] of this.windows) if (w.endsAt <= t) this.windows.delete(k);
    // Still full: drop the oldest entries rather than grow without bound.
    while (this.windows.size >= this.maxKeys) {
      const first = this.windows.keys().next().value;
      if (first === undefined) break;
      this.windows.delete(first);
    }
  }
}

/** Count one request against `bucket` and say whether it is within `limit` per `windowSeconds`. */
export async function checkLimit(store: CounterStore, bucket: string, limit: number, windowSeconds: number): Promise<LimitResult> {
  try {
    const { count, resetInSeconds } = await store.increment(`rl:${bucket}`, windowSeconds);
    return { allowed: count <= limit, limit, remaining: Math.max(0, limit - count), resetInSeconds };
  } catch (storeError) {
    return { allowed: true, limit, remaining: limit, resetInSeconds: windowSeconds, storeError };
  }
}

/** Response headers for a limit result. Send `Retry-After` with every 429. */
export function rateLimitHeaders(r: LimitResult): Record<string, string> {
  const h: Record<string, string> = {
    "RateLimit-Limit": String(r.limit),
    "RateLimit-Remaining": String(r.remaining),
    "RateLimit-Reset": String(r.resetInSeconds),
  };
  if (!r.allowed) h["Retry-After"] = String(r.resetInSeconds);
  return h;
}

/** Starting points. Tune them per product and keep them in one place. */
export const LIMITS = {
  /** Safety net on every route except health checks, per client IP. */
  perIpPerMinute: 300,
  /** Signed-in or keyed callers on expensive routes, per account. */
  perAccountPerMinute: 60,
  /** Anonymous / demo use of paid features, per IP per hour. */
  anonymousPerIpPerHour: 5,
  /** Global hourly breaker for anonymous use of a shared paid key. */
  anonymousGlobalPerHour: 500,
  /** API key creation per account per hour, and active keys per account. */
  keyCreatesPerHour: 5,
  maxActiveKeys: 10,
  /** Sign-in / magic-link / reset emails, per IP and per target address per hour. */
  authEmailsPerHour: 5,
} as const;

/*
Example (any framework):

  const store = new MemoryStore();
  const r = await checkLimit(store, `ip:${clientIp}`, LIMITS.perIpPerMinute, 60);
  if (r.storeError) log.warn("rate limiter store unavailable", r.storeError);
  if (!r.allowed) return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429, headers: { "content-type": "application/json", ...rateLimitHeaders(r) },
  });
*/
