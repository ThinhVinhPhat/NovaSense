import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-(--color-accent) text-white hover:bg-(--color-accent-hover) active:scale-[0.98]',
          variant === 'secondary' && 'border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-bg-subtle) active:scale-[0.98]',
          variant === 'ghost' && 'text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-subtle)',
          size === 'sm' && 'text-sm px-3 py-1.5 gap-1.5',
          size === 'md' && 'text-sm px-5 py-2.5 gap-2',
          size === 'lg' && 'text-base px-7 py-3.5 gap-2.5',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
