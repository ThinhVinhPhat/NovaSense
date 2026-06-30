'use client'

import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { createPortal } from 'react-dom'

export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, count, total, updateQty, removeItem } = useCart()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Open cart (${count} items)`}
        className="relative rounded-md p-2 text-(--color-text-secondary) hover:bg-(--color-bg-subtle) hover:text-(--color-text-primary) transition-colors"
      >
        <ShoppingCart size={20} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-accent) text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-60 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-full max-w-sm flex-col bg-(--color-bg-card) shadow-xl">
            <div className="flex items-center justify-between border-b border-(--color-border) px-5 py-4">
              <h2 className="font-heading text-lg font-semibold text-(--color-text-primary)">
                Cart ({count})
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="rounded-md p-1 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-accent)"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-(--color-text-muted)">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={item.variant.id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-(--color-text-primary) truncate">{item.variant.name}</p>
                        <p className="text-xs text-(--color-text-secondary)">{item.variant.colorLabel}</p>
                        <p className="text-sm font-semibold text-(--color-text-primary)">
                          ${(item.variant.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(item.variant.id, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="rounded p-1 text-(--color-text-muted) hover:text-(--color-text-primary)"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.variant.id, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="rounded p-1 text-(--color-text-muted) hover:text-(--color-text-primary)"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.variant.id)}
                          aria-label="Remove item"
                          className="ml-1 rounded p-1 text-(--color-text-muted) hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-(--color-border) px-5 py-4">
                <div className="mb-3 flex justify-between">
                  <span className="text-sm text-(--color-text-secondary)">Total</span>
                  <span className="font-heading text-lg font-bold text-(--color-text-primary)">${total.toFixed(2)}</span>
                </div>
                <Button className="w-full" size="md">Checkout</Button>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
