import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sheep It - Weekly Launchpad for Indie Startups',
  description: 'A weekly product launch and discovery platform for small indie startups, solo founders, and builders.',
  keywords: ['startup', 'product launch', 'indie hackers', 'product hunt', 'weekly launch'],
  authors: [{ name: 'Sheep It Team' }],
  creator: 'Sheep It',
  publisher: 'Sheep It',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/assets/images/logo.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    title: 'Sheep It - Weekly Launchpad for Indie Startups',
    description: 'A weekly product launch and discovery platform for small indie startups, solo founders, and builders.',
    siteName: 'Sheep It',
    images: [
      {
        url: '/assets/images/logo.png',
        width: 512,
        height: 512,
        alt: 'Sheep It Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sheep It - Weekly Launchpad for Indie Startups',
    description: 'A weekly product launch and discovery platform for small indie startups, solo founders, and builders.',
    creator: '@sheep_it',
    images: ['/assets/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
} 