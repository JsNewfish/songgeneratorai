import type { Metadata } from 'next'
import LyricsToSongPageWrapper from './lyrics-to-song-client'

export const metadata: Metadata = {
  title: 'AI Lyrics to Song Generator - Turn Lyrics into Music Instantly',
  description: 'Convert your lyrics into a full AI-generated song in seconds. Choose genre, style, voice and tempo. Free online lyrics to song converter with royalty-free output.',
  alternates: { canonical: '/tools/lyrics-to-song' },
  openGraph: { url: '/tools/lyrics-to-song' },
}

export default function LyricsToSongPage(props: { initialTool?: string }) {
  return <LyricsToSongPageWrapper {...props} />
}
