'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Play } from 'lucide-react'

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prior = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prior?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Product demo"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-(--color-glass-border) bg-(--color-bg-card) shadow-2xl">
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close demo"
          className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
        >
          <X size={20} />
        </button>
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-(--color-accent)/20 via-(--color-violet)/10 to-(--color-cyan)/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
            <Play size={28} className="ml-1 text-white" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
