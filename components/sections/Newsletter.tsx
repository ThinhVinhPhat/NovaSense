'use client'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mail } from 'lucide-react'

export function Newsletter() {
  return (
    <Section id="newsletter" className="bg-(--color-bg-subtle)">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <Badge className="mb-4">
            <Mail size={12} />
            Stay Updated
          </Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Be first to know when NovaSense ships
          </h2>
          <p className="mt-4 text-(--color-text-secondary)">
            Join thousands of smart home enthusiasts. No spam, just launch updates.
          </p>
          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@example.com"
              required
              aria-label="Email address"
              className="flex-1 rounded-md border border-(--color-border) bg-(--color-bg) px-4 py-2.5 text-sm text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            />
            <Button type="submit" size="md">
              Notify Me
            </Button>
          </form>
          <p className="mt-3 text-xs text-(--color-text-muted)">
            By subscribing you agree to our privacy policy.
          </p>
        </div>
      </Container>
    </Section>
  )
}
