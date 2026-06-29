import type { Metadata } from 'next'
import { Header } from "@/components/header"
import { MusicGenerator } from "@/components/music-generator"
import { MusicShowcase } from "@/components/music-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { UserCases } from "@/components/user-cases"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisonggen.io'

export const metadata: Metadata = {
  title: 'SongGeneratorAI - Free AI Music Generator | Create Songs from Text or Lyrics',
  description: 'Generate original AI music free online. Turn your lyrics or text into full songs in seconds. Multiple genres, styles and voices. Royalty-free for commercial use.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'SongGeneratorAI',
      url: BASE_URL,
      description: 'AI-powered music generation platform. Create original songs from text or lyrics in seconds.',
      applicationCategory: 'MusicApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier with 20 credits per day',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is SongGeneratorAI?', acceptedAnswer: { '@type': 'Answer', text: 'SongGeneratorAI is an AI-powered music generation platform that allows users to create original music by entering text descriptions or lyrics.' } },
        { '@type': 'Question', name: 'Do I need music production experience to use SongGeneratorAI?', acceptedAnswer: { '@type': 'Answer', text: 'Not at all! SongGeneratorAI is designed for everyone. Our intuitive interface and intelligent AI system will help you easily create professional-quality music.' } },
        { '@type': 'Question', name: 'Can I use the generated music commercially?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, all music generated using SongGeneratorAI is royalty-free. You can use it for personal or commercial purposes including videos, podcasts, games, ads, and more.' } },
        { '@type': 'Question', name: 'How long does it take to generate music?', acceptedAnswer: { '@type': 'Answer', text: 'Typically, SongGeneratorAI can generate a complete music piece in seconds to a minute, depending on complexity and server load.' } },
        { '@type': 'Question', name: 'What music styles does SongGeneratorAI support?', acceptedAnswer: { '@type': 'Answer', text: 'SongGeneratorAI supports pop, rock, electronic, hip hop, R&B, jazz, classical, folk, country, metal, and many more styles.' } },
      ],
    },
  ],
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <MusicGenerator />
        <MusicShowcase />
        <HowItWorks />
        <Features />
        <UserCases />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
