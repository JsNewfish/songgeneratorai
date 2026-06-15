import type { Metadata } from 'next'
import AISongCoverClient from './ai-cover-client'

export const metadata: Metadata = {
  title: 'AI Song Cover Generator - Create AI Covers of Any Song',
  description: 'Create stunning AI song covers by uploading any audio. Transform vocals, change style, and generate professional covers instantly. Free AI cover generator online.',
  alternates: { canonical: '/ai-song-cover-generator' },
  openGraph: { url: '/ai-song-cover-generator' },
}

export default function Page() {
  return <AISongCoverClient />
}
