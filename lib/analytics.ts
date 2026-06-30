'use client'

type TrackEvent =
  | { type: 'click'; label: string }
  | { type: 'scroll'; depth: number }

function send(event: TrackEvent): void {
  if (typeof window === 'undefined') return
  const payload = JSON.stringify({ ...event, path: window.location.pathname, ts: Date.now() })
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
    return
  }
  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => undefined)
}

export function trackClick(label: string): void {
  send({ type: 'click', label })
}

export function initScrollTracking(): () => void {
  const reported = new Set<number>()
  const milestones = [25, 50, 75, 100] as const

  function onScroll() {
    const total = document.documentElement.scrollHeight - window.innerHeight
    if (total <= 0) return
    const pct = Math.floor((window.scrollY / total) * 100)
    for (const milestone of milestones) {
      if (pct >= milestone && !reported.has(milestone)) {
        reported.add(milestone)
        send({ type: 'scroll', depth: milestone })
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
