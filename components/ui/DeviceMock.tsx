'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ColorVariant } from '@/content/products'

export type DeviceView = 'front' | 'side' | 'back' | 'exploded'
export type DeviceTier = 'hub' | 'pro'

interface DeviceMockProps {
  view?: DeviceView
  color?: ColorVariant
  tier?: DeviceTier
  className?: string
}

const finishes: Record<ColorVariant, { body: string; rim: string; label: string }> = {
  midnight: { body: 'bg-gradient-to-br from-slate-800 to-slate-950', rim: 'ring-1 ring-white/10', label: 'text-white/40' },
  pearl: { body: 'bg-gradient-to-br from-white to-slate-300', rim: 'ring-1 ring-black/10', label: 'text-slate-500/70' },
  slate: { body: 'bg-gradient-to-br from-slate-500 to-slate-700', rim: 'ring-1 ring-white/15', label: 'text-white/40' },
}

function Halo({ reduced }: { reduced: boolean | null }) {
  return (
    <div className="absolute inset-0">
      {!reduced && (
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full text-(--color-accent)"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 9" strokeLinecap="round" opacity="0.7" />
        </motion.svg>
      )}
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-[20%] rounded-full border border-(--color-accent)/40"
            animate={{ scale: [0.7, 1.3], opacity: [0.45, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 1.05, ease: 'easeOut' }}
          />
        ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex h-[34%] w-[34%] items-center justify-center rounded-full bg-gradient-to-br from-(--color-accent) to-(--color-violet) shadow-(--shadow-glow)"
          {...(reduced
            ? {}
            : { animate: { scale: [1, 1.08, 1] }, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const } })}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-white/90" />
        </motion.div>
      </div>
    </div>
  )
}

export function DeviceMock({ view = 'front', color = 'midnight', tier = 'hub', className }: DeviceMockProps) {
  const reduced = useReducedMotion()
  const finish = finishes[color]

  return (
    <motion.div
      className={cn('relative aspect-square w-full max-w-sm select-none', className)}
      {...(reduced ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const } })}
    >
      <div className="absolute inset-6 rounded-full bg-(--color-accent) opacity-25 blur-3xl" />

      {view === 'front' && (
        <div className={cn('absolute inset-7 rounded-full shadow-2xl', finish.body, finish.rim)}>
          <div className="absolute inset-3 rounded-full border border-white/10" />
          <div className="absolute inset-6 rounded-full border border-white/5" />
          <Halo reduced={reduced} />
          {tier === 'pro' && (
            <span className={cn('absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.3em]', finish.label)}>
              PRO
            </span>
          )}
        </div>
      )}

      {view === 'side' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn('relative rounded-[2.2rem] shadow-2xl', finish.body, finish.rim, tier === 'pro' ? 'h-[64%] w-[42%]' : 'h-[52%] w-[42%]')}>
            <div className="absolute inset-x-5 top-[20%] h-px bg-white/15" />
            <div className="absolute inset-x-5 top-[26%] h-px bg-white/10" />
            <div className="absolute right-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-white/20" />
            {reduced ? (
              <div className="absolute inset-x-0 top-[80%] mx-auto h-1 w-2/3 rounded-full bg-(--color-accent)/70" />
            ) : (
              <motion.div
                className="absolute inset-x-0 top-[80%] mx-auto h-1 w-2/3 rounded-full bg-(--color-accent)"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
        </div>
      )}

      {view === 'back' && (
        <div className={cn('absolute inset-7 rounded-full shadow-2xl', finish.body, finish.rim)}>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <div className="h-5 w-9 rounded-md border border-white/20 bg-black/40" />
            <div className="h-4 w-4 rounded-full border border-white/20 bg-black/30" />
            {tier === 'pro' && <div className="h-3 w-7 rounded-sm border border-white/20 bg-black/30" />}
            <div className="mt-1 h-1.5 w-16 rounded-full bg-white/10" />
            <div className="h-1.5 w-10 rounded-full bg-white/10" />
          </div>
        </div>
      )}

      {view === 'exploded' && (
        <div className="absolute inset-4">
          {['top-[2%] h-[22%]', 'top-[30%] h-[28%]', 'top-[64%] h-[20%]'].map((pos, i) => (
            <motion.div
              key={pos}
              className={cn('absolute inset-x-8 rounded-[45%] shadow-xl', finish.body, finish.rim, pos)}
              {...(reduced
                ? {}
                : { animate: { y: [0, i % 2 === 0 ? -4 : 4, 0] }, transition: { duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' as const } })}
            >
              {i === 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-(--color-accent) to-(--color-violet) shadow-(--shadow-glow)" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
