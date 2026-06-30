import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { GitFork, Globe, Link2 } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Showcase', href: '#showcase' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why NovaSense', href: '#why' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

const socials = [
  { label: 'GitHub', href: 'https://github.com', icon: GitFork },
  { label: 'Facebook', href: 'https://facebook.com', icon: Globe },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Link2 },
]

export function Footer() {
  return (
    <footer className="border-t border-(--color-glass-border) py-14">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-heading text-xl font-bold text-(--color-text-primary)">
              Nova<span className="text-(--color-accent)">Sense</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-(--color-text-secondary)">
              The intelligent brain of the home. Premium, calm technology.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="rounded-md border border-(--color-glass-border) p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-semibold text-(--color-text-primary)">{col.title}</h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="rounded text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="font-heading text-sm font-semibold text-(--color-text-primary)">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)">Terms</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-(--color-glass-border) pt-6 text-center text-xs text-(--color-text-muted)">
          © {new Date().getFullYear()} NovaSense. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
