'use client'

import { features } from '@/content/features'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function Features() {
  return (
    <Section id="features" className="bg-(--color-bg-subtle)">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4">Features</Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Everything your home needs, nothing it doesn&apos;t
          </h2>
          <p className="mt-4 text-(--color-text-secondary)">
            NovaSense quietly orchestrates your home so you never have to think about it.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollReveal key={feature.title} delay={index * 0.05}>
                <div className="group h-full rounded-lg border border-(--color-border) bg-(--color-bg-card) p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-(--color-accent-subtle) text-(--color-accent)">
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-1.5 font-heading text-sm font-semibold text-(--color-text-primary)">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-(--color-text-secondary)">{feature.description}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
