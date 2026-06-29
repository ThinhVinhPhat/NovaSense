import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      toggle(id) {
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id],
        }))
      },
    }),
    { name: 'novasense-wishlist' },
  ),
)
