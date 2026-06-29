'use client'

export function trackClick(label: string): void {
  console.info('[analytics] click', { label, timestamp: Date.now() })
  const url = '/api/track'
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, JSON.stringify({ event: 'click', label }))
  }
}

export function initScrollTracking(): () => void {
  const reported = new Set<number>()

  function onScroll() {
    const scrolled = window.scrollY + window.innerHeight
    const total = document.documentElement.scrollHeight
    const pct = Math.floor((scrolled / total) * 100)

    const milestones = [25, 50, 75, 100] as const
    for (const milestone of milestones) {
      if (pct >= milestone && !reported.has(milestone)) {
        reported.add(milestone)
        console.info('[analytics] scroll_depth', { depth: milestone })
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}
