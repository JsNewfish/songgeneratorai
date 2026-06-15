import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'
import { PostHogProvider } from '@/components/posthog-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://songgeneratorai.io'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SongGeneratorAI - AI Music Generator | Create Original Royalty-Free Music',
    template: '%s | SongGeneratorAI',
  },
  description: 'Create original music effortlessly with SongGeneratorAI. Generate high-quality AI music from text or lyrics. Multiple styles, royalty-free for commercial use.',
  keywords: 'AI music generator, AI song maker, text to music, lyrics to music, royalty-free music, AI composer, vocal remover, AI lyrics generator',
  authors: [{ name: 'SongGeneratorAI' }],
  creator: 'SongGeneratorAI',
  publisher: 'SongGeneratorAI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SongGeneratorAI - AI Music Generator',
    description: 'Create original music effortlessly with AI. Generate high-quality songs from text or lyrics.',
    type: 'website',
    url: BASE_URL,
    siteName: 'SongGeneratorAI',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SongGeneratorAI - AI Music Generator',
    description: 'Create original music effortlessly with AI. Generate high-quality songs from text or lyrics.',
    creator: '@songgeneratorai',
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <LanguageProvider>
              <PostHogProvider>
                {children}
                <Toaster />
              </PostHogProvider>
            </LanguageProvider>
          </SessionProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
