'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '../motion/Reveal'
import { Cpu, Mic, Wifi, Shield, RefreshCcw } from 'lucide-react'
import { Section } from '../ui/Section'
import { Container } from '../ui/Container'

const timeline = [
  {
    title: 'AI Learning',
    description:
      'NovaSense continuously learns your routines and adapts automatically.',
    icon: Cpu,
  },
  {
    title: 'Voice Recognition',
    description:
      'Far-field microphones recognize your voice from anywhere.',
    icon: Mic,
  },
  {
    title: 'IoT Connectivity',
    description:
      'Supports Matter, Zigbee, Z-Wave and Thread devices.',
    icon: Wifi,
  },
  {
    title: 'Secure Cloud',
    description:
      'End-to-end encryption with optional local processing.',
    icon: Shield,
  },
  {
    title: 'OTA Updates',
    description:
      'Receive new AI features automatically over time.',
    icon: RefreshCcw,
  },
]

export function WhyTimeline() {
  const reduced = useReducedMotion()

  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  })

  return (
    <Section
      id="why"
      className="relative overflow-hidden"
    >
      <div className="absolute -left-60 top-0 h-125 w-125 rounded-full bg-indigo-500/10 blur-[150px]" />

      <div className="absolute -right-60 bottom-0 h-125 w-125 rounded-full bg-cyan-400/10 blur-[150px]" />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-bold text-(--color-text-primary) lg:text-6xl">
            Built to get smarter every day
          </h2>

          <p className="mt-6 text-xl text-gradient">
            NovaSense evolves with your lifestyle, making every interaction
            faster, smarter and more personalized.
          </p>
        </div>

        <div className="mt-24 grid items-start gap-24 lg:grid-cols-2">
          <div ref={ref} className="relative">
            <div className="absolute left-6 top-0 h-full w-px bg-(--color-glass-border)" />

            {!reduced && (
              <motion.div
                style={{
                  scaleY,
                  transformOrigin: 'top',
                }}
                className="absolute left-6 top-0 h-full w-px bg-linear-to-b from-cyan-400 via-(--color-accent) to-(--color-violet)"
              />
            )}

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const Icon = item.icon

                return (
                  <Reveal key={item.title} delay={index * 0.05}>
                    <motion.div
                      whileHover={{
                        y: -6,
                      }}
                      className="relative pl-20"
                    >

                      <motion.div
                        whileHover={{
                          scale: 1.15,
                          rotate: 8,
                        }}
                        className="absolute left-0 top-3 flex h-12 w-12 items-center justify-center rounded-full border border-(--color-glass-border) bg-(--color-bg-subtle) backdrop-blur-xl"
                      >
                        <Icon
                          className="text-(--color-accent)"
                          size={20}
                        />
                      </motion.div>

                      <div className="rounded-3xl border border-(--color-glass-border) bg-(--color-bg-subtle) p-6 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(59,130,246,.15)]">
                        <span className="text-sm font-semibold tracking-widest text-gradient">
                          0{index + 1}
                        </span>

                        <h3 className="mt-2 text-xl font-semibold text-(--color-text-primary)">
                          {item.title}
                        </h3>

                        <p className="mt-3 leading-7 text-(--color-text-secondary)">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          <div className="sticky top-28">
            <motion.div
              animate={reduced ? false : { y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="relative"
            >

              <div className="absolute inset-0 rounded-full bg-[#7C86EF]/20 blur-[120px]" />

              <div className="relative overflow-hidden rounded-[40px] border border-(--color-glass-border) bg-(--color-bg-subtle) p-12 backdrop-blur-xl">
                {/* Khối mockup thiết bị luôn giữ tông tối để giống ảnh sản phẩm thật, không đổi theo theme */}
                <div className="aspect-square rounded-3xl border border-white/10 bg-linear-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-cyan-400 blur-3xl opacity-30" />

                    <div className="relative h-48 w-48 rounded-[32px] border border-white/20 bg-linear-to-br from-slate-700 to-slate-900 shadow-2xl flex items-center justify-center">
                      <Cpu
                        size={80}
                        className="text-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-3xl font-bold text-(--color-text-primary)">
                    NovaSense Hub
                  </h3>

                  <p className="mt-4 leading-8 text-(--color-text-secondary)">
                    Your intelligent smart home companion powered by AI,
                    capable of understanding, automating and securing every
                    connected device.
                  </p>

                  <div className="mt-8 flex gap-4">
                    <button className="rounded-full pointer-events-auto bg-linear-to-r from-[#7C86EF] to-blue-500 px-6 py-3 font-medium text-white transition hover:from-cyan-400 hover:to-blue-400">
                      Explore
                    </button>

                    <button className="rounded-full border border-(--color-glass-border) px-6 py-3 text-(--color-text-primary) transition hover:bg-(--color-bg-subtle)">
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  )
}