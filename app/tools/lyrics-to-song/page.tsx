import type { Metadata } from 'next'
import Link from 'next/link'
import LyricsToSongPageWrapper from './lyrics-to-song-client'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisonggen.io'

export const metadata: Metadata = {
  title: 'Lyrics to Song Generator - Turn Lyrics into AI Songs',
  description: 'Convert your lyrics into complete AI songs with vocals and instrumentals in seconds. Choose genre, voice, and style, then download royalty-free results.',
  alternates: {
    canonical: '/tools/lyrics-to-song',
    languages: {
      en: '/tools/lyrics-to-song',
      'x-default': '/tools/lyrics-to-song',
    },
  },
  openGraph: { url: '/tools/lyrics-to-song' },
}

export default function LyricsToSongPage(props: { initialTool?: string }) {
  const toolKey = props.initialTool || 'lyrics-to-song'

  const toolConfig: Record<string, { name: string; path: string; description: string; faqs: Array<{ question: string; answer: string }> }> = {
    'lyrics-to-song': {
      name: 'AI Lyrics to Song Generator',
      path: '/tools/lyrics-to-song',
      description: 'Convert your lyrics into complete AI songs with vocals and instruments in seconds.',
      faqs: [
        {
          question: 'Can I turn my own lyrics into a song with AI?',
          answer: 'Yes. Paste your lyrics, choose a style and voice, then generate a complete song in seconds.',
        },
        {
          question: 'Can I use generated songs commercially?',
          answer: 'Generated songs are royalty-free and can be used in personal and commercial projects according to plan terms.',
        },
        {
          question: 'What formats can I download?',
          answer: 'You can download generated results in supported audio formats from your creation panel.',
        },
      ],
    },
    'vocal-remover': {
      name: 'AI Vocal Remover',
      path: '/tools/vocal-remover',
      description: 'Remove vocals from songs online and create clean instrumental tracks instantly.',
      faqs: [
        {
          question: 'Can this tool remove vocals from any song?',
          answer: 'It supports most common songs and separates vocals and instrumental stems using AI.',
        },
        {
          question: 'Is the vocal remover free to try?',
          answer: 'Yes. You can try the tool with available credits on your account.',
        },
        {
          question: 'Can I export instrumental tracks?',
          answer: 'Yes. After processing, you can download the instrumental result from your output list.',
        },
      ],
    },
    'ai-cover': {
      name: 'AI Song Cover Generator',
      path: '/tools/ai-cover',
      description: 'Generate AI song covers in different voices and styles from your uploaded audio.',
      faqs: [
        {
          question: 'How do I create an AI song cover?',
          answer: 'Upload audio, choose a target voice or style, and let the model generate the converted cover.',
        },
        {
          question: 'Can I pick different voice styles?',
          answer: 'Yes. You can choose available voice and style options before generation.',
        },
        {
          question: 'How long does generation take?',
          answer: 'Most cover generations finish within seconds to a few minutes depending on queue and input length.',
        },
      ],
    },
    'singing-photo': {
      name: 'AI Singing Photo',
      path: '/tools/ai-singing-photo',
      description: 'Animate portraits into realistic singing videos with AI lip-sync and audio matching.',
      faqs: [
        {
          question: 'Can I make any portrait photo sing?',
          answer: 'Yes. Upload a clear portrait image and audio to generate a singing animation video.',
        },
        {
          question: 'What image works best?',
          answer: 'Front-facing portraits with good lighting and clear facial features usually produce the best results.',
        },
        {
          question: 'Can I use my own audio?',
          answer: 'Yes. You can upload supported audio to drive the singing animation output.',
        },
      ],
    },
  }

  const currentTool = toolConfig[toolKey] || toolConfig['lyrics-to-song']
  const pageUrl = `${BASE_URL}${currentTool.path}`
  const relatedTools = [
    { href: '/tools/lyrics-to-song', title: 'Lyrics to Song', description: 'Turn your lyrics into complete AI songs.' },
    { href: '/tools/text-to-song', title: 'Text to Song', description: 'Generate songs from prompts and descriptions.' },
    { href: '/tools/vocal-remover', title: 'Vocal Remover', description: 'Extract vocals or instrumentals from tracks.' },
    { href: '/tools/ai-cover', title: 'AI Cover Generator', description: 'Create AI-powered cover versions in new voices.' },
    { href: '/tools/ai-singing-photo', title: 'AI Singing Photo', description: 'Animate portraits into singing videos.' },
  ].filter((tool) => tool.href !== currentTool.path)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${BASE_URL}/tools/lyrics-to-song` },
          { '@type': 'ListItem', position: 3, name: currentTool.name, item: pageUrl },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: currentTool.name,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: pageUrl,
        description: currentTool.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: currentTool.faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LyricsToSongPageWrapper {...props} />
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
