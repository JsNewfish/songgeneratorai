import type { Metadata } from 'next'
import LyricsToSongPage from "@/app/tools/lyrics-to-song/page"

export const metadata: Metadata = {
  title: 'AI Singing Photo - Make Your Photo Sing with AI',
  description: 'Animate any photo to sing your favorite song with AI. Upload a portrait and audio to create a realistic singing video. Fun and easy AI singing photo maker.',
  alternates: { canonical: '/tools/ai-singing-photo' },
  openGraph: { url: '/tools/ai-singing-photo' },
}

export default function AiSingingPhotoPage() {
  return <LyricsToSongPage initialTool="singing-photo" />
}
