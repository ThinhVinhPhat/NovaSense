import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Scrollytelling } from '@/components/sections/Scrollytelling'
import { Specs } from '@/components/sections/Specs'
import { Shop } from '@/components/sections/Shop'
import { Newsletter } from '@/components/sections/Newsletter'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Scrollytelling />
        <Specs />
        <Shop />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
