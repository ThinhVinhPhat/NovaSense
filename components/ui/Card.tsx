import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-shadow',
        className,
      )}
      style={{
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-card)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </div>
  )
}
