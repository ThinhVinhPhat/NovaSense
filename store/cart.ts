import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductVariant } from '@/content/products'

export interface CartItem {
  variant: ProductVariant
  qty: number
}

interface CartStore {
  items: CartItem[]
  addItem: (variant: ProductVariant) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  count: number
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      total: 0,
      addItem(variant) {
        set((state) => {
          const existing = state.items.find((i) => i.variant.id === variant.id)
          let items: CartItem[]
          if (existing) {
            items = state.items.map((i) =>
              i.variant.id === variant.id ? { ...i, qty: i.qty + 1 } : i,
            )
          } else {
            items = [...state.items, { variant, qty: 1 }]
          }
          return {
            items,
            count: items.reduce((sum, i) => sum + i.qty, 0),
            total: items.reduce((sum, i) => sum + i.variant.price * i.qty, 0),
          }
        })
      },
      removeItem(id) {
        set((state) => {
          const items = state.items.filter((i) => i.variant.id !== id)
          return {
            items,
            count: items.reduce((sum, i) => sum + i.qty, 0),
            total: items.reduce((sum, i) => sum + i.variant.price * i.qty, 0),
          }
        })
      },
      updateQty(id, qty) {
        if (qty <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => {
          const items = state.items.map((i) => (i.variant.id === id ? { ...i, qty } : i))
          return {
            items,
            count: items.reduce((sum, i) => sum + i.qty, 0),
            total: items.reduce((sum, i) => sum + i.variant.price * i.qty, 0),
          }
        })
      },
    }),
    { name: 'novasense-cart' },
  ),
)
