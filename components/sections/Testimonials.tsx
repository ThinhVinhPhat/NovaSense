'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { testimonials } from '@/content/testimonials'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

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
    <Section id="testimonials">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Loved in homes worldwide
          </h2>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <GlassCard className="p-8 text-center sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={reduced ? {} : { opacity: 1, y: 0 }}
                exit={reduced ? {} : { opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-(--color-accent) to-(--color-violet) font-heading font-bold text-white">
                  {t.initials}
                </div>
                <div className="mb-4 flex justify-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? 'fill-(--color-accent) text-(--color-accent)' : 'text-(--color-text-muted)'}
                    />
                  ))}
                </div>
                <p className="text-lg text-(--color-text-primary)">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 font-semibold text-(--color-text-primary)">{t.name}</p>
                <p className="text-sm text-(--color-text-muted)">{t.role}</p>
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="rounded-full border border-(--color-glass-border) p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                  className={i === index ? 'h-2 w-6 rounded-full bg-(--color-accent) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)' : 'h-2 w-2 rounded-full bg-(--color-text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)'}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="rounded-full border border-(--color-glass-border) p-2 text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
