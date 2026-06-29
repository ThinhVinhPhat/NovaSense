'use client'

import { productVariants } from '@/content/products'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { RecentlyViewed } from '@/components/ecommerce/RecentlyViewed'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'

export function Shop() {
  return (
    <Section id="shop" className="bg-(--color-bg-subtle)">
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-10">
          <Badge className="mb-4">Pre-order</Badge>
          <h2 className="font-heading text-3xl font-bold text-(--color-text-primary) sm:text-4xl">
            Choose your NovaSense
          </h2>
          <p className="mt-4 text-(--color-text-secondary)">
            Available in three finishes. Ships Q2 2025.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {productVariants.map((v) => (
            <ProductCard key={v.id} variant={v} />
          ))}
        </div>
        <RecentlyViewed />
      </Container>
    </Section>
  )
}
