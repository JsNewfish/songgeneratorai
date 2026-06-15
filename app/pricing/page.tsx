import type { Metadata } from 'next'
import PricingClient from './pricing-client'

export const metadata: Metadata = {
  title: 'Pricing - AI Music Generator Plans | SongGeneratorAI',
  description: 'Choose your SongGeneratorAI plan. Free tier with 20 credits/day. Paid plans for unlimited music generation. Cancel anytime.',
  alternates: { canonical: '/pricing' },
  openGraph: { url: '/pricing' },
}

export default function Page() {
  return <PricingClient />
}
