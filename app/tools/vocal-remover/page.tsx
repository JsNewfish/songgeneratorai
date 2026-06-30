import type { Metadata } from 'next'
import LyricsToSongPage from "@/app/tools/lyrics-to-song/page"

export const metadata: Metadata = {
  title: 'Vocal Remover - Remove Vocals and Get Instrumentals',
  description: 'Remove vocals from songs online with AI and export clean instrumental tracks for karaoke, remixing, or practice.',
  alternates: {
    canonical: '/tools/vocal-remover',
    languages: {
      en: '/tools/vocal-remover',
      'x-default': '/tools/vocal-remover',
    },
  },
  openGraph: { url: '/tools/vocal-remover' },
}

export default function VocalRemoverPage() {
  return <LyricsToSongPage initialTool="vocal-remover" />
}
