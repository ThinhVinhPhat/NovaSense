'use client'

import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CartDrawer } from '@/components/ecommerce/CartDrawer'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#showcase', label: 'Product' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-heading text-xl font-bold text-(--color-text-primary)">
            Nova<span className="text-(--color-accent)">Sense</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CartDrawer />
            <Button size="sm" className="hidden sm:inline-flex">
              Pre-order
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
