interface RateLimitOptions {
  limit: number
  windowMs: number
}

const store = new Map<string, number[]>()

export function isRateLimited(ip: string, { limit, windowMs }: RateLimitOptions): boolean {
  const now = Date.now()
  const prev = store.get(ip) ?? []
  const window = prev.filter((t) => now - t < windowMs)
  if (window.length >= limit) return true
  window.push(now)
  store.set(ip, window)
  if (store.size > 5_000) store.clear()
  return false
}
