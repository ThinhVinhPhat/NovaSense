'use client'

import { useSyncExternalStore } from 'react'
import { Heart } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { GlassCard } from '@/components/ui/GlassCard'
import { useRecentlyViewed } from '@/store/recentlyViewed'
import { useWishlist } from '@/store/wishlist'

const emptyItems: never[] = []

export function RecentlyViewed() {
  const items = useSyncExternalStore(
    useRecentlyViewed.subscribe,
    () => useRecentlyViewed.getState().items,
    () => emptyItems,
  )
  const { toggle, has } = useWishlist()

  if (items.length === 0) return null

  return (
    <section className="py-10">
      <Container>
        <h2 className="mb-6 font-heading text-lg font-semibold text-(--color-text-primary)">
          Recently Viewed
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((item) => {
            const wishlisted = has(item.id)
            return (
              <GlassCard
                key={item.id}
                className="flex w-44 flex-shrink-0 flex-col gap-2 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-(--color-text-primary) leading-tight">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-(--color-text-secondary)">
                      {item.colorLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={wishlisted}
                    onClick={() => toggle(item.id)}
                    className="flex-shrink-0 rounded-md p-1 transition-colors hover:text-(--color-accent) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
                  >
                    <Heart
                      size={16}
                      className={wishlisted ? 'fill-(--color-accent) text-(--color-accent)' : 'text-(--color-text-secondary)'}
                    />
                  </button>
                </div>
                <p className="font-heading text-base font-bold text-(--color-text-primary)">
                  ${item.price.toFixed(2)}
                </p>
                <a
                  href="#showcase"
                  className="mt-1 text-xs font-medium text-(--color-accent) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent) rounded"
                >
                  View →
                </a>
              </GlassCard>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
