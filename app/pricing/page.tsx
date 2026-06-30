import type { Metadata } from 'next'
import PricingClient from './pricing-client'

export const metadata: Metadata = {
  title: 'AI Music Generator Pricing - Plans and Credits',
  description: 'Compare SongGeneratorAI pricing plans, credits, and features. Start free and upgrade for higher generation limits and commercial usage.',
  alternates: {
    canonical: '/pricing',
    languages: {
      en: '/pricing',
      'x-default': '/pricing',
    },
  },
  openGraph: { url: '/pricing' },
}

export default function Page() {
  return <PricingClient />
}
