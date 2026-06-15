import type { Metadata } from 'next'
import LyricsToSongPage from "@/app/tools/lyrics-to-song/page"

export const metadata: Metadata = {
  title: 'AI Vocal Remover - Remove Vocals from Any Song Free Online',
  description: 'Remove vocals from any song instantly with AI. Create karaoke tracks, instrumental versions, or isolate background music. Free online vocal remover tool.',
  alternates: { canonical: '/tools/vocal-remover' },
  openGraph: { url: '/tools/vocal-remover' },
}

export default function VocalRemoverPage() {
  return <LyricsToSongPage initialTool="vocal-remover" />
}
