import type { Metadata } from 'next'
import AILyricsClient from './ai-lyrics-client'

export const metadata: Metadata = {
  title: 'Free AI Lyrics Generator - Write Song Lyrics Online',
  description: 'Write original song lyrics in seconds with a free AI lyrics generator. Create verses, hooks, and choruses in pop, rock, hip hop, R&B, and more.',
  alternates: {
    canonical: '/ai-lyrics-generator',
    languages: {
      en: '/ai-lyrics-generator',
      'x-default': '/ai-lyrics-generator',
    },
  },
  openGraph: { url: '/ai-lyrics-generator' },
}

export default function Page() {
  return <AILyricsClient />
}
