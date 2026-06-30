import type { Metadata } from 'next'
import AISongCoverClient from './ai-cover-client'

export const metadata: Metadata = {
  title: 'Free AI Song Cover Generator - Create Covers from Any Audio',
  description: 'Upload audio and generate AI song covers in seconds. Convert voice style, remake tracks in new genres, and download high-quality AI covers online.',
  alternates: {
    canonical: '/ai-song-cover-generator',
    languages: {
      en: '/ai-song-cover-generator',
      'x-default': '/ai-song-cover-generator',
    },
  },
  openGraph: { url: '/ai-song-cover-generator' },
}

export default function Page() {
  return <AISongCoverClient />
}
