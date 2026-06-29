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
        'rounded-lg border border-(--color-border) bg-(--color-bg-card) p-6 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  )
}
