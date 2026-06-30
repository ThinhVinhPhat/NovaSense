'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { TiltCard } from '@/components/motion/TiltCard'
import { Stagger, staggerItem } from '@/components/motion/Stagger'
import { Mic, Workflow, Leaf, Smartphone, ShieldCheck, BarChart3 } from 'lucide-react'

const features = [
  { icon: Mic, title: 'AI Voice Assistant', desc: 'Natural-language control — no rigid commands, just speak.' },
  { icon: Workflow, title: 'Smart Automation', desc: 'Scenes and routines that orchestrate the whole home.' },
  { icon: Leaf, title: 'Energy Saving', desc: 'Track consumption and cut waste with real-time insights.' },
  { icon: Smartphone, title: 'Remote Access', desc: 'Control everything from anywhere via the unified app.' },
  { icon: ShieldCheck, title: 'Security', desc: 'AI cameras with face recognition and instant alerts.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Real-time statistics across every connected device.' },
]

export function Features() {
  const reduced = useReducedMotion()

  return (
    <Section id="features">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Everything your home needs <span className="text-gradient">In One Hub</span>
          </h2>
        </div>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon
            const card = (
              <GlassCard className="h-full p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-(--color-accent)/15 text-(--color-accent) shadow-(--shadow-glow)">
                  <Icon size={20} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-(--color-text-primary)">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">{f.desc}</p>
              </GlassCard>
            )
            return reduced ? (
              <div key={f.title}>{card}</div>
            ) : (
              <motion.div key={f.title} variants={staggerItem}>
                <TiltCard className="h-full">{card}</TiltCard>
              </motion.div>
            )
          })}
        </Stagger>
      </Container>
    </Section>
  )
}
