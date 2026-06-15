import type { Metadata } from 'next'
import AILyricsClient from './ai-lyrics-client'

export const metadata: Metadata = {
  title: 'AI Lyrics Generator - Write Song Lyrics Instantly with AI',
  description: 'Generate professional song lyrics in any style with AI. Pop, rock, hip hop, R&B and more. Free AI lyrics writer that creates original, creative song lyrics in seconds.',
  alternates: { canonical: '/ai-lyrics-generator' },
  openGraph: { url: '/ai-lyrics-generator' },
}

export default function Page() {
  return <AILyricsClient />
}
