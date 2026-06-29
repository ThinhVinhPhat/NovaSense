'use client'

import { useCallback, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { type Theme, setStoredTheme } from '@/lib/theme'

function resolveCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('theme') as Theme | null
  return stored ?? 'system'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(resolveCurrentTheme)

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setStoredTheme(next)
  }, [theme])

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-md p-2 text-(--color-text-secondary) hover:bg-(--color-bg-subtle) hover:text-(--color-text-primary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
