import type { Metadata } from 'next'
import { Space_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header/Header'
import { Footer } from '@/components/Footer/Footer'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Monsters Calculator',
  description: 'An ethical scoring tool for artists with troubling legacies',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
