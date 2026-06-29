'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'success' | 'error' | 'info'
}

interface ToastItem extends ToastOptions {
  id: number
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((opts: ToastOptions) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...opts, id }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[280px] max-w-sm bg-(--color-bg-card)',
              t.variant === 'error' ? 'border-red-400/40' : 'border-(--color-border)',
            )}
          >
            {t.variant === 'error' ? (
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            ) : (
              <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-400" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-(--color-text-primary)">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-(--color-text-secondary)">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded p-0.5 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
