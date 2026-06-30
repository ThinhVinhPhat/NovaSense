'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { trustedBrands } from '@/content/trusted-brands'

export function TrustedBy() {
  const reduced = useReducedMotion()
  const loop = [...trustedBrands, ...trustedBrands]

  return (
    <section aria-label="Compatible brands" className="border-y border-(--color-glass-border) py-10">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-gradient sm:text-sm">
            Works with the brands you already own
          </p>
        </Reveal>
      </Container>

      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {reduced ? (
          <Container>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustedBrands.map((name) => (
                <li key={name} className="text-sm font-medium text-(--color-text-muted) opacity-70">
                  {name}
                </li>
              ))}
            </ul>
          </Container>
        ) : (
          <motion.ul
            className="flex w-max items-center gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          >
            {loop.map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= trustedBrands.length || undefined}
                className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-wide text-(--color-text-muted) opacity-60 transition hover:text-(--color-text-primary) hover:opacity-100"
              >
                {name}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  )
}
