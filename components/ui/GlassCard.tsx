import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type GlassCardProps = HTMLAttributes<HTMLDivElement>

export function GlassCard({ className, children, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-(--color-glass-border) bg-(--color-glass) shadow-(--shadow-glass) backdrop-blur-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
