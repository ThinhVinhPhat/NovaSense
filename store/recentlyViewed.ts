import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductVariant } from '@/content/products'

interface RecentlyViewedStore {
  items: ProductVariant[]
  add: (variant: ProductVariant) => void
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      add(variant) {
        set(() => {
          const filtered = get().items.filter((i) => i.id !== variant.id)
          return { items: [variant, ...filtered].slice(0, 6) }
        })
      },
    }),
    { name: 'novasense-recently-viewed' },
  ),
)
