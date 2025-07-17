import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { LoginModalProvider } from '@/contexts/LoginModalContext'
import { UserProfileProvider } from '@/contexts/UserProfileContext'
import StructuredData from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sheep It - Weekly Product Launch Platform for Indie Makers',
  description: 'Launch your product every Monday. Get community votes, real feedback, and win a spot in our weekly newsletter reaching thousands of potential customers.',
  keywords: ['startup launch', 'product launch platform', 'indie makers', 'indie hackers', 'weekly product launch', 'startup feedback', 'product discovery', 'monday launch', 'sheep it'],
  authors: [{ name: 'Sheep It' }],
  creator: 'Sheep It',
  publisher: 'Sheep It',
  applicationName: 'Sheep It',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/assets/images/logo.png',
  },
  manifest: '/manifest.json',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sheepit.io'),
  alternates: {
    canonical: 'https://sheepit.io',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sheepit.io',
    title: 'Sheep It - Weekly Product Launch Platform for Indie Makers',
    description: 'Launch your product every Monday. Get community votes, real feedback, and win a spot in our weekly newsletter reaching thousands of potential customers.',
    siteName: 'Sheep It',
    images: [
      {
        url: 'https://sheepit.io/api/og',
        width: 1200,
        height: 630,
        alt: 'Sheep It - Weekly Product Launch Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sheep_it',
    creator: '@sheep_it',
    title: 'Sheep It - Weekly Product Launch Platform for Indie Makers',
    description: 'Launch your product every Monday. Get community votes, real feedback, and win a spot in our weekly newsletter.',
    images: ['https://sheepit.io/api/og'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '06aba02cf399017f',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <UserProfileProvider>
          <LoginModalProvider>
            {children}
            <Toaster position="top-center" richColors />
          </LoginModalProvider>
        </UserProfileProvider>
      </body>
    </html>
  )
} 