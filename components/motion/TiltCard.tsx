'use client'

import { useRef, useSyncExternalStore } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'

const POINTER_MQ = '(hover: hover) and (pointer: fine)'
function subscribePointer(cb: () => void) {
  const mq = window.matchMedia(POINTER_MQ)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

interface TiltCardProps {
  children: ReactNode
  className?: string
  max?: number
}

export function TiltCard({ children, className, max = 8 }: TiltCardProps) {
  const reduced = useReducedMotion()
  const hasPointer = useSyncExternalStore(subscribePointer, () => window.matchMedia(POINTER_MQ).matches, () => false)
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 18 })
  const sry = useSpring(ry, { stiffness: 150, damping: 18 })

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rx.set(-py * max)
    ry.set(px * max)
  }

  function reset() {
    rx.set(0)
    ry.set(0)
  }

  if (reduced || !hasPointer) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
