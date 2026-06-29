'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/motion/Magnetic'
import { ParticleField } from '@/components/motion/ParticleField'
import { DeviceMock } from '@/components/ui/DeviceMock'
import { DemoModal } from '@/components/ui/DemoModal'
import { Reveal } from '@/components/motion/Reveal'
import { Play, ShoppingBag } from 'lucide-react'

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28">
      <ParticleField className="absolute inset-0 h-full w-full" />
      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Reveal>
              <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                NovaSense AI
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-(--color-text-primary) sm:text-6xl">
                The Future of <span className="text-gradient">Smart Living</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-(--color-text-secondary) lg:mx-0">
                One AI hub that connects and orchestrates every device in your home — by voice or app. Calm, private, effortless.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Magnetic>
                  <Button size="lg" onClick={() => { document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    <ShoppingBag size={18} />
                    Buy Now
                  </Button>
                </Magnetic>
                <Button variant="secondary" size="lg" onClick={() => setDemoOpen(true)}>
                  <Play size={18} />
                  Watch Demo
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex justify-center">
            <DeviceMock view="front" className="max-w-md" />
          </Reveal>
        </div>
      </Container>
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  )
}
