'use client'

import { useState, useCallback } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Magnetic } from '@/components/motion/Magnetic'
import { ParticleField } from '@/components/motion/ParticleField'
import { DeviceMock } from '@/components/ui/DeviceMock'
import { DemoModal } from '@/components/ui/DemoModal'
import { Play, ShoppingBag } from 'lucide-react'
import { trackClick } from '@/lib/analytics'

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false)
  const closeDemo = useCallback(() => setDemoOpen(false), [])

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28">
      <ParticleField className="absolute inset-0 h-full w-full" />
      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              NovaSense AI
            </p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-text-primary sm:text-6xl">
              The Future of <span className="text-gradient">Smart Living</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary lg:mx-0">
              One AI hub that connects and orchestrates every device in your home — by voice or app. Calm, private, effortless.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Magnetic>
                <Button size="lg" onClick={() => { trackClick('hero-buy-now'); document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <ShoppingBag size={18} />
                  Buy Now
                </Button>
              </Magnetic>
              <Button variant="secondary" size="lg" onClick={() => { trackClick('hero-watch-demo'); setDemoOpen(true) }}>
                <Play size={18} />
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <DeviceMock view="front" className="max-w-md" />
          </div>
        </div>
      </Container>
      <DemoModal open={demoOpen} onClose={closeDemo} />
    </section>
  )
}
