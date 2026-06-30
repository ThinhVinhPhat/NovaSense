import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Counter } from '@/components/motion/Counter'
import { Reveal } from '@/components/motion/Reveal'
import { stats } from '@/content/stats'

export function Statistics() {
  return (
    <Section id="stats">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <GlassCard className="p-8 text-center">
                <p className="text-gradient font-heading text-4xl font-extrabold sm:text-5xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </p>
                <p className="mt-2 text-sm text-(--color-text-secondary)">{s.label}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
