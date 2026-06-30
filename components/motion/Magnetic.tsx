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

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const reduced = useReducedMotion()
  const hasPointer = useSyncExternalStore(subscribePointer, () => window.matchMedia(POINTER_MQ).matches, () => false)
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  function handleMove(e: MouseEvent<HTMLSpanElement>) {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  if (reduced || !hasPointer) {
    return <span className={className}>{children}</span>
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
