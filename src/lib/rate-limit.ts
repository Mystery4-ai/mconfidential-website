/**
 * Minimal in-memory rate limiter keyed by IP, for public form submissions.
 * Good enough for a single-instance deployment; swap for a shared store
 * (e.g. Upstash/Redis) if the app scales to multiple server instances.
 */
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}
