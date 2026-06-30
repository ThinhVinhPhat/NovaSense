'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { timeline } from '@/content/timeline'

export function WhyTimeline() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <Section id="why">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Built to get smarter every day
          </h2>
        </div>

        <div ref={ref} className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute left-5 top-0 h-full w-px bg-(--color-glass-border)" aria-hidden="true" />
          {!reduced && (
            <motion.div
              aria-hidden="true"
              style={{ scaleY, transformOrigin: 'top' }}
              className="absolute left-5 top-0 h-full w-px bg-(--color-accent)"
            />
          )}
          <ul className="space-y-10">
            {timeline.map((step, i) => {
              const Icon = step.icon
              return (
                <li key={step.title} className="relative pl-16">
                  <Reveal delay={reduced ? 0 : i * 0.05}>
                    <span className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full border border-(--color-glass-border) bg-(--color-bg-card) text-(--color-accent) shadow-(--shadow-glow)">
                      <Icon size={18} />
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-(--color-text-primary)">{step.title}</h3>
                    <p className="mt-1 text-sm text-(--color-text-secondary)">{step.description}</p>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
