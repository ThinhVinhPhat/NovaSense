'use client'

export function trackClick(label: string): void {
  console.info('[analytics] click', { label, timestamp: Date.now() })
  // Forward to webhook if available — fire-and-forget
  const url = '/api/track'
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, JSON.stringify({ event: 'click', label }))
  }
}

let scrollDepthsReported = new Set<number>()

export function initScrollTracking(): () => void {
  scrollDepthsReported = new Set()

  function onScroll() {
    const scrolled = window.scrollY + window.innerHeight
    const total = document.documentElement.scrollHeight
    const pct = Math.floor((scrolled / total) * 100)

    const milestones = [25, 50, 75, 100] as const
    for (const milestone of milestones) {
      if (pct >= milestone && !scrollDepthsReported.has(milestone)) {
        scrollDepthsReported.add(milestone)
        console.info('[analytics] scroll_depth', { depth: milestone })
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
