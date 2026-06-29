import Link from 'next/link'
import { Container } from '@/components/ui/Container'

const footerLinks = [
  { href: '#features', label: 'Features' },
  { href: '#specs', label: 'Specs' },
  { href: '#newsletter', label: 'Newsletter' },
]

export function Footer() {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-bg) py-10">
      <Container>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="font-heading text-lg font-bold text-(--color-text-primary)">
            Nova<span className="text-(--color-accent)">Sense</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-sm text-(--color-text-muted)">
            &copy; {new Date().getFullYear()} NovaSense. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
