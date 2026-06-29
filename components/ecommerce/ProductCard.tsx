'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { type ProductVariant } from '@/content/products'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useRecentlyViewed } from '@/store/recentlyViewed'
import { useToast } from '@/components/ui/Toast'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const colorMap: Record<string, string> = {
  midnight: 'bg-slate-900',
  pearl: 'bg-white border border-gray-200',
  slate: 'bg-slate-400',
}

interface ProductCardProps {
  variant: ProductVariant
}

export function ProductCard({ variant }: ProductCardProps) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { add: addRecent } = useRecentlyViewed()
  const { toast } = useToast()
  const wishlisted = has(variant.id)

  function handleAddToCart() {
    addItem(variant)
    addRecent(variant)
    toast({ title: 'Added to cart', description: `${variant.name} — ${variant.colorLabel}`, variant: 'success' })
  }

  function handleWishlist() {
    toggle(variant.id)
    toast({ title: wishlisted ? 'Removed from wishlist' : 'Saved to wishlist' })
  }

  return (
    <div
      className="group relative rounded-xl border border-(--color-border) bg-(--color-bg-card) p-5 shadow-sm transition-all hover:shadow-md"
      onClick={() => addRecent(variant)}
    >
      {variant.badge && (
        <div className="absolute right-4 top-4">
          <Badge>{variant.badge}</Badge>
        </div>
      )}
      <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-(--color-bg-subtle)">
        <div className={cn('h-16 w-16 rounded-full shadow-md', colorMap[variant.color])} />
      </div>
      <h3 className="font-heading text-sm font-semibold text-(--color-text-primary)">{variant.name}</h3>
      <p className="text-xs text-(--color-text-secondary)">{variant.colorLabel}</p>
      <p className="mt-1 text-lg font-bold text-(--color-text-primary)">${variant.price}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleAddToCart() }}
          aria-label={`Add ${variant.name} ${variant.colorLabel} to cart`}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-(--color-accent) px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-(--color-accent-hover)"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleWishlist() }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'rounded-md border border-(--color-border) p-2 transition-colors hover:bg-(--color-bg-subtle)',
            wishlisted ? 'text-red-400' : 'text-(--color-text-muted)',
          )}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}
