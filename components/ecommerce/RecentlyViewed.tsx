'use client'

import { useRecentlyViewed } from '@/store/recentlyViewed'
import { useCart } from '@/store/cart'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'

const colorMap: Record<string, string> = {
  midnight: 'bg-slate-900',
  pearl: 'bg-white border border-gray-200',
  slate: 'bg-slate-400',
}

export function RecentlyViewed() {
  const { items } = useRecentlyViewed()
  const { addItem } = useCart()
  const { toast } = useToast()

  if (items.length === 0) return null

  return (
    <section className="py-10">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-semibold text-(--color-text-primary)">Recently Viewed</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((variant) => (
          <div
            key={variant.id}
            className="flex min-w-[140px] flex-col rounded-lg border border-(--color-border) bg-(--color-bg-card) p-3 shadow-sm"
          >
            <div className="mb-2 flex h-16 items-center justify-center rounded-md bg-(--color-bg-subtle)">
              <div className={cn('h-8 w-8 rounded-full shadow', colorMap[variant.color])} />
            </div>
            <p className="text-xs font-medium text-(--color-text-primary) truncate">{variant.name}</p>
            <p className="text-[11px] text-(--color-text-secondary)">{variant.colorLabel}</p>
            <p className="mt-0.5 text-sm font-bold text-(--color-text-primary)">${variant.price}</p>
            <button
              onClick={() => {
                addItem(variant)
                toast({ title: 'Added to cart', description: `${variant.name} — ${variant.colorLabel}`, variant: 'success' })
              }}
              aria-label={`Add ${variant.name} ${variant.colorLabel} to cart`}
              className="mt-2 flex items-center justify-center gap-1 rounded-md bg-(--color-accent) px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-(--color-accent-hover)"
            >
              <ShoppingCart size={11} />
              Add
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
