export type ColorVariant = 'midnight' | 'pearl' | 'slate'

export interface ProductVariant {
  id: string
  name: string
  color: ColorVariant
  colorLabel: string
  price: number
  badge?: string
}

export const productVariants: ProductVariant[] = [
  { id: 'ns-midnight', name: 'NovaSense Hub', color: 'midnight', colorLabel: 'Midnight Black', price: 199, badge: 'Most Popular' },
  { id: 'ns-pearl', name: 'NovaSense Hub', color: 'pearl', colorLabel: 'Pearl White', price: 199 },
  { id: 'ns-slate', name: 'NovaSense Hub', color: 'slate', colorLabel: 'Slate Gray', price: 199 },
  { id: 'ns-pro-midnight', name: 'NovaSense Pro', color: 'midnight', colorLabel: 'Midnight Black', price: 299, badge: 'Pro' },
  { id: 'ns-pro-pearl', name: 'NovaSense Pro', color: 'pearl', colorLabel: 'Pearl White', price: 299, badge: 'Pro' },
]
