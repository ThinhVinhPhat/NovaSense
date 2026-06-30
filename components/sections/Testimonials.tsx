'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { testimonials } from '@/content/testimonials'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Reveal } from '../motion/Reveal'
import { Counter } from '../motion/Counter'
import { stats } from '@/content/stats'

export function Testimonials() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length

  function go(dir: number) {
    setIndex((i) => (i + dir + count) % count)
  }

  useEffect(() => {
    if (reduced || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000)
    return () => clearInterval(id)
  }, [reduced, paused, count])

  const t = testimonials[index]!

  return (
    <Section id="testimonials" className="relative overflow-hidden">
      <div className="absolute -right-60 top-0 h-125 w-125 rounded-full bg-indigo-500/10 blur-[150px]" />
      <div className="absolute -left-60 bottom-0 h-125 w-125 rounded-full bg-cyan-400/10 blur-[150px]" />

      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-3 font-heading text-4xl font-bold text-text-primary lg:text-6xl">
            Loved in homes worldwide
          </h2>
          <p className="mt-6 text-lg text-gradient">
            Thousands of households trust NovaSense to run quietly in the background of their everyday lives.
          </p>
        </div>

        <div className="mt-20 grid items-stretch gap-8 lg:grid-cols-12">
          <div
            className="relative lg:col-span-7"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <GlassCard className="relative flex h-full flex-col justify-between overflow-hidden p-10 sm:p-12">
              <Quote
                size={160}
                strokeWidth={1}
                className="pointer-events-none absolute -right-6 -top-6 text-[#7C86EF]/10"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={reduced ? {} : { opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative"
                >
                  <div className="mb-2 flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < t.rating ? 'fill-[#7C86EF] text-[#7C86EF]' : 'text-text-muted'}
                      />
                    ))}
                  </div>

                  <p className="font-heading text-2xl font-medium leading-snug text-text-primary sm:text-3xl">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="relative mt-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#7C86EF] to-violet font-heading text-lg font-bold text-white ring-2 ring-white/10">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{t.name}</p>
                    <p className="text-sm text-text-muted">{t.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className="rounded-full border border-glass-border p-2.5 text-text-secondary transition-colors hover:border-cyan-400/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C86EF]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className="rounded-full border border-glass-border p-2.5 text-text-secondary transition-colors hover:border-cyan-400/40 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C86EF]"
                    >
                      <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="relative mt-6 flex gap-2">
                {testimonials.map((item, i) => (
                  <button
                    key={item.name}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === index}
                    className={
                      i === index
                        ? 'h-1.5 w-8 rounded-full bg-[#7C86EF] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C86EF]'
                        : 'h-1.5 w-1.5 rounded-full bg-text-muted/40 transition-all hover:bg-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C86EF]'
                    }
                  />
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:col-span-5">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <GlassCard className="flex h-full flex-col justify-center p-8 text-center">
                  <p className="text-gradient font-heading text-4xl font-extrabold sm:text-5xl">
                    <Counter to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="mt-3 text-sm text-text-secondary">{s.label}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}