import { describe, it, expect, beforeEach } from 'vitest'
import { useCart } from '@/store/cart'
import type { ProductVariant } from '@/content/products'

const hub: ProductVariant = {
  id: 'ns-midnight', name: 'NovaSense Hub', color: 'midnight',
  colorLabel: 'Midnight Black', price: 199, badge: 'Most Popular',
}
const pro: ProductVariant = {
  id: 'ns-pro-midnight', name: 'NovaSense Pro', color: 'midnight',
  colorLabel: 'Midnight Black', price: 299, badge: 'Pro',
}

beforeEach(() => {
  useCart.setState({ items: [], count: 0, total: 0 })
})

describe('addItem', () => {
  it('adds a new item with qty 1', () => {
    useCart.getState().addItem(hub)
    const { items, count, total } = useCart.getState()
    expect(items).toHaveLength(1)
    expect(items[0]?.qty).toBe(1)
    expect(count).toBe(1)
    expect(total).toBe(199)
  })

  it('increments qty when same variant added twice', () => {
    useCart.getState().addItem(hub)
    useCart.getState().addItem(hub)
    const { items, count, total } = useCart.getState()
    expect(items).toHaveLength(1)
    expect(items[0]?.qty).toBe(2)
    expect(count).toBe(2)
    expect(total).toBe(398)
  })

  it('tracks multiple distinct variants separately', () => {
    useCart.getState().addItem(hub)
    useCart.getState().addItem(pro)
    const { items, count, total } = useCart.getState()
    expect(items).toHaveLength(2)
    expect(count).toBe(2)
    expect(total).toBe(498)
  })
})

describe('removeItem', () => {
  it('removes the item entirely', () => {
    useCart.getState().addItem(hub)
    useCart.getState().removeItem(hub.id)
    const { items, count, total } = useCart.getState()
    expect(items).toHaveLength(0)
    expect(count).toBe(0)
    expect(total).toBe(0)
  })

  it('leaves other items intact', () => {
    useCart.getState().addItem(hub)
    useCart.getState().addItem(pro)
    useCart.getState().removeItem(hub.id)
    const { items, count } = useCart.getState()
    expect(items).toHaveLength(1)
    expect(items[0]?.variant.id).toBe(pro.id)
    expect(count).toBe(1)
  })
})

describe('updateQty', () => {
  it('updates qty and recalculates total', () => {
    useCart.getState().addItem(hub)
    useCart.getState().updateQty(hub.id, 3)
    const { items, count, total } = useCart.getState()
    expect(items[0]?.qty).toBe(3)
    expect(count).toBe(3)
    expect(total).toBe(597)
  })

  it('removes item when qty set to 0', () => {
    useCart.getState().addItem(hub)
    useCart.getState().updateQty(hub.id, 0)
    expect(useCart.getState().items).toHaveLength(0)
  })

  it('removes item when qty set to negative', () => {
    useCart.getState().addItem(hub)
    useCart.getState().updateQty(hub.id, -1)
    expect(useCart.getState().items).toHaveLength(0)
  })
})
