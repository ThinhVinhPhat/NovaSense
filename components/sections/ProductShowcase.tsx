'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { DeviceMock, type DeviceView, type DeviceTier } from '@/components/ui/DeviceMock'
import { productVariants, type ProductVariant } from '@/content/products'
import { useCart } from '@/store/cart'
import { ShoppingCart } from 'lucide-react'

const views: { key: DeviceView; label: string }[] = [
  { key: 'front', label: 'Front' },
  { key: 'side', label: 'Side' },
  { key: 'back', label: 'Back' },
  { key: 'exploded', label: 'Exploded' },
]

const specStrip = [
  'AI NPU processor',
  'Wi-Fi 6 · BT 5.3 · Zigbee · Z-Wave · Thread · Matter',
  '100+ devices',
  'On-device AI',
]

export function ProductShowcase() {
  const reduced = useReducedMotion()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [view, setView] = useState<DeviceView>('front')
  const [selectedId, setSelectedId] = useState<string>(productVariants[0]!.id)

  const selected: ProductVariant = productVariants.find((v) => v.id === selectedId) ?? productVariants[0]!
  const tier: DeviceTier = selected.name.includes('Pro') ? 'pro' : 'hub'

  function handleAdd() {
    addItem(selected)
    toast({ title: 'Added to cart', description: `${selected.name} — ${selected.colorLabel}`, variant: 'success' })
  }

  return (
    <Section id="showcase">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Designed from <span className="text-gradient">every angle</span>
          </h2>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="relative flex aspect-square items-center justify-center">
              {reduced ? (
                <div className="flex w-full items-center justify-center">
                  <DeviceMock view={view} color={selected.color} tier={tier} />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${view}-${selected.id}`}
                    initial={{ opacity: 0, rotateY: -20 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 20 }}
                    transition={{ duration: 0.35 }}
                    className="flex w-full items-center justify-center"
                  >
                    <DeviceMock view={view} color={selected.color} tier={tier} />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            <div role="tablist" aria-label="Device views" className="mt-6 flex justify-center gap-2">
              {views.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  role="tab"
                  aria-selected={view === v.key}
                  onClick={() => setView(v.key)}
                  className={
                    view === v.key
                      ? 'rounded-full bg-(--color-accent) px-4 py-1.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)'
                      : 'rounded-full border border-(--color-glass-border) px-4 py-1.5 text-sm font-medium text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)'
                  }
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <GlassCard className="p-6 sm:p-8">
            <h3 className="font-heading text-2xl font-bold text-(--color-text-primary)">{selected.name}</h3>
            <p className="mt-1 text-sm text-(--color-text-secondary)">{selected.colorLabel}</p>
            <p className="mt-4 font-heading text-4xl font-extrabold text-(--color-text-primary)">
              ${selected.price.toFixed(2)}
            </p>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Choose your model</p>
              <div className="flex flex-wrap gap-2">
                {productVariants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedId(v.id)}
                    aria-pressed={selectedId === v.id}
                    className={
                      selectedId === v.id
                        ? 'rounded-lg border border-(--color-accent) bg-(--color-accent)/10 px-3 py-2 text-left text-xs text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)'
                        : 'rounded-lg border border-(--color-glass-border) px-3 py-2 text-left text-xs text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)'
                    }
                  >
                    <span className="block font-semibold">{v.name}</span>
                    <span className="block">{v.colorLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button className="mt-7 w-full" size="lg" onClick={handleAdd}>
              <ShoppingCart size={18} />
              Add to Cart
            </Button>

            <ul className="mt-6 grid grid-cols-1 gap-2 border-t border-(--color-glass-border) pt-5 text-xs text-(--color-text-secondary) sm:grid-cols-2">
              {specStrip.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-(--color-accent)" />
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </Container>
    </Section>
  )
}
