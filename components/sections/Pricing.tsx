'use client'

import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'
import { pricingTiers } from '@/content/pricing-tiers'
import { Check } from 'lucide-react'

const ctaTarget: Record<string, string> = {
  Starter: 'showcase',
  Professional: 'contact',
  Enterprise: 'contact',
}

export function Pricing() {
  function handleCta(tier: string) {
    const id = ctaTarget[tier] ?? 'contact'
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section id="pricing">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Choose your level of intelligence
          </h2>
          <p className="mt-4 text-gradient text-lg">
            Every hub includes Starter free. Upgrade anytime for adaptive AI and insights.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.06}>
              <GlassCard
                className={
                  tier.highlighted
                    ? 'relative h-full border-(--color-accent) p-8 shadow-(--shadow-glow)'
                    : 'relative h-full p-8'
                }
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-(--color-accent) px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold text-(--color-text-primary)">{tier.name}</h3>
                <p className="mt-1 text-sm text-(--color-text-secondary)">{tier.description}</p>
                <p className="mt-5">
                  <span className="font-heading text-4xl font-extrabold text-(--color-text-primary)">{tier.price}</span>
                  <span className="ml-1 text-sm text-(--color-text-muted)">{tier.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-(--color-text-secondary)">
                      <Check size={16} className="mt-0.5 flex-shrink-0 text-(--color-accent)" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.highlighted ? 'primary' : 'secondary'}
                  size="md"
                  className="mt-8 w-full"
                  onClick={() => handleCta(tier.name)}
                >
                  {tier.cta}
                </Button>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
