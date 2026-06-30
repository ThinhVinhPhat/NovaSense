import { Cpu, Wifi, Mic, LayoutGrid, Box } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Reveal } from '@/components/motion/Reveal'
import { specGroups } from '@/content/specs'

const groupIcons: Record<string, LucideIcon> = {
  Processing: Cpu,
  Connectivity: Wifi,
  Audio: Mic,
  Capacity: LayoutGrid,
  Hardware: Box,
}

export function TechSpecs() {
  return (
    <Section id="specs">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
              Under the <span className="text-gradient">hood</span>
            </h2>
            <p className="mt-4 text-lg text-(--color-text-secondary)">
              Every spec chosen for speed, range, and privacy — engineered for the whole home.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {specGroups.map((group, i) => {
            const Icon = groupIcons[group.group] ?? Cpu
            return (
              <Reveal key={group.group} delay={i * 0.07} className="h-full">
                <GlassCard className="flex h-full flex-col p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-accent)/15 text-(--color-accent) shadow-(--shadow-glow)">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading text-base font-semibold text-(--color-text-primary)">
                    {group.group}
                  </h3>
                  <dl className="mt-4 flex flex-col gap-3">
                    {group.rows.map((row) => (
                      <div key={row.label}>
                        <dt className="text-xs font-medium uppercase tracking-wide text-(--color-text-secondary)">
                          {row.label}
                        </dt>
                        <dd className="mt-0.5 text-sm text-(--color-text-primary)">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </GlassCard>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
