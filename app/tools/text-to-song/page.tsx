import type { Metadata } from 'next'
import Link from 'next/link'
import TextToSongPage from './text-to-song-client'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisonggen.io'

export const metadata: Metadata = {
  title: 'Text to Song Generator - Convert Text to AI Music Online Free',
  description: 'Type any text or description and instantly generate a full AI song. Create music from ideas, stories or prompts. Free text to song AI with multiple styles.',
  alternates: { canonical: '/tools/text-to-song' },
  openGraph: { url: '/tools/text-to-song' },
}

export default function Page() {
  const pageUrl = `${BASE_URL}/tools/text-to-song`
  const relatedTools = [
    { href: '/tools/lyrics-to-song', title: 'Lyrics to Song', description: 'Turn your lyrics into complete AI songs.' },
    { href: '/tools/vocal-remover', title: 'Vocal Remover', description: 'Extract vocals or instrumentals from tracks.' },
    { href: '/tools/ai-cover', title: 'AI Cover Generator', description: 'Create AI-powered cover versions in new voices.' },
    { href: '/tools/ai-singing-photo', title: 'AI Singing Photo', description: 'Animate portraits into singing videos.' },
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${BASE_URL}/tools/lyrics-to-song` },
          { '@type': 'ListItem', position: 3, name: 'Text to Song Generator', item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Text to Song Generator',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: pageUrl,
        description: 'Generate complete AI songs from prompts, ideas, and story text.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Can I generate music from plain text prompts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Enter a text prompt describing style, mood, and theme to generate a complete song.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need music production experience?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. The tool is designed for beginners and creators without technical music background.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I customize genre and vibe?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can set genre, mood, tempo, and other options before generating.',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TextToSongPage />
      <section className="border-t border-border/50 bg-muted/20">
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-xl font-semibold">Related Tools</h2>
          <p className="mt-2 text-sm text-muted-foreground">Explore more AI music tools to create, transform, and enhance your tracks.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-lg border border-border/60 bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80"
              >
                <h3 className="text-sm font-medium text-foreground">{tool.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
