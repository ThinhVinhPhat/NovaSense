'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface CounterProps {
  to: number
  durationMs?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function Counter({
  to,
  durationMs = 1600,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CounterProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return

    let raf = 0
    let startTs = 0
    let triggered = false

    function tick(ts: number) {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(to * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting && !triggered) {
          triggered = true
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, durationMs, reduced])

  const display = reduced ? to : value

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
