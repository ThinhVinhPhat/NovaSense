'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface ParticleFieldProps {
  className?: string
  count?: number
}

export function ParticleField({ className, count = 40 }: ParticleFieldProps) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: 0.6 + (i % 5) * 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }))

    function resize() {
      const c = canvasRef.current
      if (!c) return
      c.width = c.clientWidth * dpr
      c.height = c.clientHeight * dpr
      ctx!.scale(dpr, dpr)
    }

    function draw() {
      const c = canvasRef.current
      if (!c || !running) return
      ctx!.clearRect(0, 0, c.clientWidth, c.clientHeight)
      ctx!.fillStyle = 'rgba(129,140,248,0.5)'
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = c.clientWidth
        if (p.x > c.clientWidth) p.x = 0
        if (p.y < 0) p.y = c.clientHeight
        if (p.y > c.clientHeight) p.y = 0
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      running = entry.isIntersecting
      if (running) {
        raf = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(raf)
      }
    })

    resize()
    window.addEventListener('resize', resize)
    observer.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [reduced, count])

  if (reduced) return null

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
