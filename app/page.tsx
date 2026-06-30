import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { Features } from '@/components/sections/Features'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { RecentlyViewed } from '@/components/sections/RecentlyViewed'
import { TechSpecs } from '@/components/sections/TechSpecs'
import { WhyTimeline } from '@/components/sections/WhyTimeline'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { FaqContact } from '@/components/sections/FaqContact'

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
