import type { Metadata } from 'next'
import LyricsToSongPage from "@/app/tools/lyrics-to-song/page"

export const metadata: Metadata = {
  title: 'AI Song Cover Generator - Create AI Covers of Any Song',
  description: 'Generate AI-powered song covers in any voice or style. Upload audio and transform it with AI. Create unique covers for any genre in seconds.',
  alternates: { canonical: '/tools/ai-cover' },
  openGraph: { url: '/tools/ai-cover' },
}

export default function AiCoverPage() {
  return <LyricsToSongPage initialTool="ai-cover" />
}
