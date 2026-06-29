import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-(--color-accent-subtle) px-3 py-1 text-xs font-semibold text-(--color-accent)',
        className,
      )}
    >
      {children}
    </span>
  )
}
