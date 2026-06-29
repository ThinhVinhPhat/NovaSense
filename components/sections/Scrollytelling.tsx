'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'

const steps = [
  {
    step: '01',
    title: 'Wake up to a smarter home',
    body: 'NovaSense learns your morning routine and has everything ready before you open your eyes.',
  },
  {
    step: '02',
    title: 'Speak. It listens.',
    body: 'Far-field microphones catch your voice from across the room, even through background noise.',
  },
  {
    step: '03',
    title: 'Leave. The home takes care of itself.',
    body: 'Sensors detect occupancy, AI adjusts lighting and temperature. Energy saved, automatically.',
  },
  {
    step: '04',
    title: 'Goodnight, everything off.',
    body: 'One phrase locks the doors, dims the lights, sets the thermostat, and arms the system.',
  },
]

export function Scrollytelling() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['0%', '-20%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-(--color-bg) py-24 sm:py-40">
      <motion.div
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-accent)_5%,transparent)] via-transparent to-[color-mix(in_srgb,purple_10%,transparent)]"
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge className="mb-4">A Day with NovaSense</Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Intelligence that fits your life
          </h2>
        </div>
        <div className="mx-auto max-w-2xl space-y-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={reducedMotion ? false : { opacity: 0, x: i % 2 === 0 ? -32 : 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border border-(--color-accent)/40 bg-(--color-accent-subtle)">
                <span className="font-heading text-sm font-bold text-(--color-accent)">{step.step}</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-(--color-text-primary) mb-2">
                  {step.title}
                </h3>
                <p className="text-(--color-text-secondary) leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
