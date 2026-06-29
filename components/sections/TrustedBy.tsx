import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/motion/Reveal'
import { trustedBrands } from '@/content/trusted-brands'

export function TrustedBy() {
  return (
    <section aria-label="Compatible brands" className="border-y border-(--color-glass-border) py-10">
      <Container>
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-(--color-text-muted)">
            Works with the brands you already own
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedBrands.map((brand) => (
              <li
                key={brand.name}
                className="font-heading text-lg font-semibold text-(--color-text-muted) opacity-70 grayscale transition hover:text-(--color-text-secondary) hover:opacity-100"
              >
                {brand.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
