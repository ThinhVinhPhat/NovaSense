import type { Metadata } from 'next'
import { Geist, Sora } from 'next/font/google'
import { THEME_SCRIPT } from '@/lib/theme'
import { ToastProvider } from '@/components/ui/Toast'
import { AuroraBackground } from '@/components/sections/AuroraBackground'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import { LazyChatWidget } from '@/components/chatbot/LazyChatWidget'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '700', '800'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novasense.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NovaSense — The Future of Smart Living',
    template: '%s | NovaSense',
  },
  description:
    'NovaSense is an AI-powered smart hub that connects lights, cameras, AC, locks, and all IoT devices — controlled by voice or app.',
  keywords: ['smart home', 'AI hub', 'home automation', 'Matter', 'Zigbee', 'voice control'],
  authors: [{ name: 'NovaSense' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'NovaSense — The Future of Smart Living',
    description:
      'AI-powered smart hub that quietly orchestrates your entire home ecosystem.',
    siteName: 'NovaSense',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NovaSense — The Future of Smart Living',
    description: 'AI-powered smart hub that quietly orchestrates your entire home ecosystem.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: siteUrl,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'NovaSense Smart Hub',
  description:
    'AI-powered smart hub connecting lights, cameras, locks, and all IoT devices by voice or app.',
  brand: { '@type': 'Brand', name: 'NovaSense' },
  offers: {
    '@type': 'AggregateOffer',
    availability: 'https://schema.org/PreOrder',
    priceCurrency: 'USD',
    lowPrice: 199,
    highPrice: 299,
    offerCount: 5,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body className={`${geist.variable} ${sora.variable} font-sans antialiased bg-(--color-canvas) text-(--color-text-primary)`}>
        <AuroraBackground />
        
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <ToastProvider>
          <AnalyticsProvider />
          {children}
          <LazyChatWidget />
        </ToastProvider>
      </body>
    </html>
  )
}
