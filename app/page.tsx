import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { TrustedBy } from '@/components/sections/TrustedBy'
import { Features } from '@/components/sections/Features'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { WhyTimeline } from '@/components/sections/WhyTimeline'
import { Statistics } from '@/components/sections/Statistics'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { Newsletter } from '@/components/sections/Newsletter'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <ProductShowcase />
        <WhyTimeline />
        <Statistics />
        <Testimonials />
        <Pricing />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
