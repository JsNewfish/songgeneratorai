import type { Metadata } from 'next'
import TextToSongPage from './text-to-song-client'

export const metadata: Metadata = {
  title: 'Text to Song Generator - Convert Text to AI Music Online Free',
  description: 'Type any text or description and instantly generate a full AI song. Create music from ideas, stories or prompts. Free text to song AI with multiple styles.',
  alternates: { canonical: '/tools/text-to-song' },
  openGraph: { url: '/tools/text-to-song' },
}

export default function Page() {
  return <TextToSongPage />
}
