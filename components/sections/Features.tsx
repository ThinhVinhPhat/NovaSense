'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { TiltCard } from '@/components/motion/TiltCard'
import { Stagger, staggerItem } from '@/components/motion/Stagger'
import { waveBars, sparkPoints, features } from '@/content/features'

function Waveform({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="flex h-12 items-end gap-1.5">
      {waveBars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-linear-to-t from-(--color-accent) to-cyan-400"
          {...(reduced
            ? { style: { height: `${h}%` } }
            : {
                animate: { height: [`${h * 0.4}%`, `${h}%`, `${h * 0.4}%`] },
                transition: { duration: 1.2 + i * 0.07, repeat: Infinity, ease: 'easeInOut' as const },
              })}
        />
      ))}
    </div>
  )
}

function Sparkline({ reduced }: { reduced: boolean | null }) {
  const max = Math.max(...sparkPoints)
  const points = sparkPoints
    .map((v, i) => `${(i / (sparkPoints.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(' ')

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-12 w-full sm:w-40">
      <motion.polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-(--color-accent)"
        initial={reduced ? false : { pathLength: 0 }}
        {...(reduced ? {} : { whileInView: { pathLength: 1 } })}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
    </svg>
  )
}

export function Features() {
  const reduced = useReducedMotion()

  return (
    <Section id="features">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Everything your home needs <span className="text-gradient">in one hub</span>
          </h2>
        </div>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[14rem]">
          {features.map((f) => {
            const Icon = f.icon

            const card = (
              <GlassCard
                className={`flex h-full flex-col p-6 transition-colors duration-500 hover:border-cyan-400/40 ${
                  f.analytics ? 'sm:flex-row sm:items-center sm:justify-between sm:gap-8' : ''
                } ${f.hero ? 'justify-between sm:p-8' : ''}`}
              >
                <div>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-accent)/15 text-(--color-accent) shadow-(--shadow-glow)">
                    <Icon size={f.hero ? 22 : 20} />
                  </div>
                  <h3 className={`font-heading font-semibold text-(--color-text-primary) ${f.hero ? 'text-2xl' : 'text-lg'}`}>
                    {f.title}
                  </h3>
                  <p className={`mt-2 leading-relaxed text-(--color-text-secondary) ${f.hero ? 'max-w-sm text-base' : 'text-sm'}`}>
                    {f.desc}
                  </p>
                </div>

                {f.hero && <Waveform reduced={reduced} />}
                {f.analytics && <Sparkline reduced={reduced} />}
              </GlassCard>
            )

            return reduced ? (
              <div key={f.title} className={f.span}>
                {card}
              </div>
            ) : (
              <motion.div key={f.title} variants={staggerItem} className={f.span}>
                <TiltCard className="h-full">{card}</TiltCard>
              </motion.div>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}