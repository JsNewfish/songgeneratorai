import type { Metadata } from 'next'
import LyricsToSongPage from "@/app/tools/lyrics-to-song/page"

export const metadata: Metadata = {
  title: 'AI Cover Tool - Create AI Song Covers Online',
  description: 'Generate AI song covers with different voices and styles from uploaded audio. Fast online AI cover creation with high-quality output.',
  alternates: {
    canonical: '/ai-song-cover-generator',
    languages: {
      en: '/ai-song-cover-generator',
      'x-default': '/ai-song-cover-generator',
    },
  },
  openGraph: { url: '/tools/ai-cover' },
}

export default function AiCoverPage() {
  return <LyricsToSongPage initialTool="ai-cover" />
}
