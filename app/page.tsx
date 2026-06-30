import dynamic from 'next/dynamic'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { RecentlyViewed } from '@/components/sections/RecentlyViewed'
import { TechSpecs } from '@/components/sections/TechSpecs'
import { Pricing } from '@/components/sections/Pricing'
import { FaqContact } from '@/components/sections/FaqContact'

const Features = dynamic(() => import('@/components/sections/Features').then(m => ({ default: m.Features })))
const ProductShowcase = dynamic(() => import('@/components/sections/ProductShowcase').then(m => ({ default: m.ProductShowcase })))
const WhyTimeline = dynamic(() => import('@/components/sections/WhyTimeline').then(m => ({ default: m.WhyTimeline })))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials').then(m => ({ default: m.Testimonials })))

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <ProductShowcase />
        <RecentlyViewed />
        <TechSpecs />
        <WhyTimeline />
        <Testimonials />
        <Pricing />
        <FaqContact />
      </main>
      <Footer />
    </>
  )
}
