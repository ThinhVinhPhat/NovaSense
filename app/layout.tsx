import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Sora } from 'next/font/google'
import { THEME_SCRIPT } from '@/lib/theme'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'NovaSense — The Future of Smart Living',
  description: 'AI-powered smart hub that connects and controls your entire home ecosystem by voice or app.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${geist.variable} ${sora.variable} font-sans antialiased bg-(--color-bg) text-(--color-text-primary)`}>
        {children}
      </body>
    </html>
  )
}
