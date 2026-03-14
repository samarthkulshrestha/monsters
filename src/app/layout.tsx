import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
