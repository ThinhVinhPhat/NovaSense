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
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
              {trustedBrands.map((brand) => (
                <li
                  key={brand.name}
                  className="text-(--color-text-muted) opacity-70 transition hover:text-(--color-text-secondary) hover:opacity-100"
                >
                  <brand.Icon size={30} role="img" aria-label={brand.name} />
                </li>
              ))}
            </ul>
          </Container>
        ) : (
          <motion.ul
            className="flex w-max items-center gap-16"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
          >
            {loop.map((brand, i) => (
              <li
                key={`${brand.name}-${i}`}
                aria-hidden={i >= trustedBrands.length || undefined}
                className="shrink-0 text-(--color-text-muted) opacity-60 transition hover:text-(--color-text-primary) hover:opacity-100"
              >
                <brand.Icon size={30} role="img" aria-label={brand.name} />
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  )
}