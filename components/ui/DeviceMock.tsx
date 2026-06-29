import { cn } from '@/lib/utils'

export type DeviceView = 'front' | 'side' | 'back' | 'exploded'

interface DeviceMockProps {
  view?: DeviceView
  className?: string
}

function MicRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid h-3/4 w-3/4 place-items-center rounded-full border border-white/10">
        <div className="flex h-1/2 w-1/2 items-center justify-center rounded-full bg-gradient-to-br from-(--color-accent) to-(--color-violet) shadow-(--shadow-glow)">
          <div className="h-2 w-2 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  )
}

export function DeviceMock({ view = 'front', className }: DeviceMockProps) {
  return (
    <div className={cn('relative aspect-square w-full max-w-sm select-none', className)}>
      <div className="absolute inset-6 rounded-full bg-(--color-accent) opacity-25 blur-3xl" />

      {view === 'front' && (
        <div className="absolute inset-8 rounded-[40%] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-2xl backdrop-blur-sm">
          <MicRing />
        </div>
      )}

      {view === 'side' && (
        <div className="absolute inset-x-16 inset-y-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-white/[0.03] via-white/10 to-white/[0.03] shadow-2xl">
          <div className="absolute right-3 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full bg-white/20" />
        </div>
      )}

      {view === 'back' && (
        <div className="absolute inset-8 rounded-[40%] border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/10 shadow-2xl">
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
            <div className="h-6 w-12 rounded-md border border-white/15 bg-black/30" />
            <div className="h-2 w-16 rounded-full bg-white/10" />
            <div className="h-2 w-10 rounded-full bg-white/10" />
          </div>
        </div>
      )}

      {view === 'exploded' && (
        <div className="absolute inset-6">
          <div className="absolute inset-x-10 top-2 h-16 rounded-[40%] border border-white/10 bg-white/[0.06]" />
          <div className="absolute inset-x-8 top-24 h-20 rounded-[36%] border border-white/10 bg-white/[0.04]">
            <MicRing />
          </div>
          <div className="absolute inset-x-12 bottom-2 h-14 rounded-[40%] border border-white/10 bg-white/[0.03]" />
        </div>
      )}
    </div>
  )
}
