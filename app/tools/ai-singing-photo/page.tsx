import type { Metadata } from 'next'
import LyricsToSongPage from "@/app/tools/lyrics-to-song/page"

export const metadata: Metadata = {
  title: 'AI Singing Photo - Animate Photos to Sing Online',
  description: 'Turn a portrait into a singing video with AI lip-sync. Upload a photo and audio to create expressive singing animations in minutes.',
  alternates: {
    canonical: '/tools/ai-singing-photo',
    languages: {
      en: '/tools/ai-singing-photo',
      'x-default': '/tools/ai-singing-photo',
    },
  },
  openGraph: { url: '/tools/ai-singing-photo' },
}

export default function AiSingingPhotoPage() {
  return <LyricsToSongPage initialTool="singing-photo" />
}
