import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { blogPosts } from '@/lib/blog-posts'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisonggen.io'

const articles: Record<string, { title: string; content: string; description: string; date: string }> = {
  'how-to-make-ai-music-free': {
    title: 'How to Make AI Music for Free in 2026 (Step-by-Step Guide)',
    description: "A complete beginner's guide to creating original AI-generated music online for free. No music experience needed.",
    date: '2026-06-15',
    content: `
## What Is AI Music Generation?

AI music generation uses artificial intelligence to compose original songs based on your text prompts, lyrics, or style preferences. In 2026, the technology has become sophisticated enough to produce studio-quality tracks in seconds — completely free for casual use.

## Step 1: Choose Your AI Music Generator

The best free AI music generators in 2026 include:

- **SongGeneratorAI** — Free 20 credits/day, supports lyrics-to-song, text-to-song, and AI covers
- Suno — Popular but limited free tier
- Udio — Great for ambient and instrumental

For this guide, we'll use **SongGeneratorAI** (free, no credit card required).

## Step 2: Sign Up for Free

1. Go to [aisonggen.io](https://www.aisonggen.io)
2. Click **Sign In** in the top right
3. Continue with Google — no password needed
4. You'll automatically get **20 free credits per day**

Each song generation costs 10 credits, so you get 2 free songs every day.

## Step 3: Write Your Prompt or Lyrics

You have two options:

**Option A — Text to Song**: Describe the song you want
> "An upbeat pop song about summer vacation, female vocals, 120 BPM"

**Option B — Lyrics to Song**: Paste your actual song lyrics
> "[Verse 1]\nWalking down the sunny street..."

## Step 4: Choose Your Style

Select from:
- **Genre**: Pop, Rock, Hip Hop, Jazz, Electronic, and 30+ more
- **Vibe**: Happy, Sad, Energetic, Calm, Epic...
- **Voice**: Male, Female, or Instrumental (no vocals)

## Step 5: Generate and Download

Click **Generate** and wait 20–60 seconds. You'll get 2 versions to choose from.

To download, click the **⋮ menu** on any song → **Download**.

All songs are **royalty-free** — you can use them in YouTube videos, podcasts, ads, or sell them commercially.

## Tips for Better Results

1. **Be specific** — "melancholic piano ballad with cello" beats "sad song"
2. **Use structure tags** in lyrics: \`[Verse 1]\`, \`[Chorus]\`, \`[Bridge]\`
3. **Regenerate** if you don't like the first result — variations can be surprising
4. **Combine styles** — "jazz + hip hop + lo-fi" creates unique fusions

## Frequently Asked Questions

**Is AI-generated music royalty-free?**
Yes. All music created on SongGeneratorAI is royalty-free for personal and commercial use.

**Can I monetize YouTube videos with AI music?**
Yes, as long as you generated it yourself. SongGeneratorAI grants you full commercial rights.

**How many songs can I make per day for free?**
2 songs per day on the free plan (20 credits, 10 per generation). Paid plans offer unlimited generations.
    `,
  },
  'lyrics-to-song-generator': {
    title: 'How to Turn Your Lyrics Into a Song with AI (2026)',
    description: 'Step-by-step guide on converting your written lyrics into a full AI song with vocals, instruments, and style.',
    date: '2026-06-14',
    content: `
## Why Turn Lyrics Into a Song with AI?

Writing lyrics is the creative part. But recording a song traditionally requires a studio, instruments, and vocal talent. AI changes that — you can now convert written lyrics into a fully produced song in under a minute, for free.

## What Makes a Good AI Song From Lyrics?

The key is **structure**. AI music generators work best when your lyrics use standard song sections:

\`\`\`
[Verse 1]
Your verse lyrics here...

[Pre-Chorus]
Optional build-up...

[Chorus]
The main hook...

[Verse 2]
Second verse...

[Bridge]
Contrast section...

[Outro]
Closing lines...
\`\`\`

## Step-by-Step: Lyrics to Song on SongGeneratorAI

### 1. Prepare Your Lyrics

Format them with section tags. Example:

\`\`\`
[Verse 1]
I've been walking through the rain
Looking for a sign in vain
Every door I try is closed
Every path leads back to you

[Chorus]
But I keep on going
Even when the winds are blowing
Because somewhere at the end
There's a light I can't pretend
\`\`\`

### 2. Open the Lyrics-to-Song Tool

Go to [aisonggen.io/tools/lyrics-to-song](https://www.aisonggen.io/tools/lyrics-to-song) and select **Lyrics** mode.

### 3. Set Your Style

This is where the magic happens. Add style tags that match your vision:
- **Genre**: What genre fits the emotion?
- **Vibe**: Is it triumphant, melancholic, hopeful?
- **Voice**: Male or female vocals?

Example style: "indie pop, acoustic guitar, female vocals, emotional"

### 4. Generate

Click Generate. The AI will:
- Create a melody that fits your lyrics
- Add appropriate instrumentation
- Generate a vocal performance
- Mix and master the final track

You'll receive 2 variations to choose from.

### 5. Iterate

Not happy with the result? Try:
- Tweaking the style description
- Adding or removing style tags
- Regenerating (you get a different result each time)

## Tips for Best Results

| What to do | Why it helps |
|------------|-------------|
| Use short, rhythmic lines | Easier for AI to fit into a melody |
| Keep verse lines similar in length | Creates more consistent rhythm |
| Write a punchy, memorable chorus | AI will emphasize it |
| Add emotion tags ("heartbreaking", "triumphant") | Guides the musical mood |

## Common Mistakes to Avoid

❌ **Too long** — Lyrics over 1000 words can produce rushed, cramped songs  
❌ **No structure tags** — Without \`[Chorus]\` etc., the AI may treat it as one long verse  
❌ **Overly complex rhyme schemes** — Simple ABAB or AABB works best  

## Download and Use Your Song

Once satisfied, download the MP3. SongGeneratorAI grants you full commercial rights — use it in:
- YouTube videos
- Podcasts and livestreams  
- Social media content
- Commercial projects
    `,
  },
  'best-ai-music-generator': {
    title: 'Best AI Music Generators in 2026: Full Comparison',
    description: "We tested the top AI music generators so you don't have to. See which one produces the best results for free.",
    date: '2026-06-13',
    content: `
## The Best AI Music Generators in 2026

AI music generation has exploded in the past two years. There are now dozens of tools claiming to create "studio-quality" music in seconds. We tested the top options for **music quality, ease of use, free tier, and commercial rights**.

## Quick Comparison

| Tool | Free Tier | Lyrics Input | Commercial Rights | Best For |
|------|-----------|-------------|------------------|----------|
| **SongGeneratorAI** | 20 credits/day | ✅ Yes | ✅ Full rights | Lyrics to song, covers |
| Suno | 50 credits/day | ✅ Yes | ⚠️ Limited | Casual use |
| Udio | 10 songs/day | ❌ No | ⚠️ Limited | Instrumental, ambient |
| Soundraw | No free tier | ❌ No | ✅ Full rights | Background music |
| Mubert | Limited | ❌ No | ✅ With license | Streaming, content |

## Detailed Reviews

### 1. SongGeneratorAI — Best for Lyrics-to-Song

**Free tier**: 20 credits/day (2 songs free daily)  
**Strengths**: 
- Accepts actual lyrics with section tags (\`[Verse]\`, \`[Chorus]\`)
- Multiple AI models (V2 through V4)
- Vocal remover and AI cover tools included
- Royalty-free commercial use

**Best for**: Musicians, content creators, anyone with existing lyrics they want to produce

**Try it**: [aisonggen.io](https://www.aisonggen.io)

---

### 2. Suno — Most Popular

**Free tier**: ~50 credits/day  
**Strengths**: Large community, high-quality vocals, wide style range  
**Weaknesses**: Less control over exact lyrics, commercial rights require paid plan  
**Best for**: Exploring AI music casually

---

### 3. Udio — Best Quality Instrumental

**Free tier**: ~10 generations/day  
**Strengths**: Exceptional instrumental quality, good for ambient/cinematic  
**Weaknesses**: No lyrics input, less vocal control  
**Best for**: Background music, film scoring

---

### 4. Soundraw — Best for Content Creators

**Free tier**: None (paid only)  
**Strengths**: Customizable length, mood, and energy; royalty-free  
**Weaknesses**: No lyrics, no vocals, template-based  
**Best for**: YouTube, podcast background music (paid)

---

## Which One Should You Use?

**If you have lyrics** → SongGeneratorAI  
**If you want to experiment freely** → Suno  
**If you need instrumentals** → Udio  
**If you need background music** → Soundraw (paid) or SongGeneratorAI (free)

## Bottom Line

For most people who want to create **original songs from lyrics**, **SongGeneratorAI** offers the best combination of free usage, lyric support, and commercial rights in 2026. The free 20 credits per day (2 songs) is enough for casual creators, and paid plans are competitively priced for heavier use.

**[Start generating free →](https://www.aisonggen.io)**
    `,
  },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles[slug]
  if (!article) return {}
  const post = blogPosts.find((p) => p.slug === slug)
  const pageUrl = `/blog/${slug}`
  const published = new Date(article.date).toISOString()
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: pageUrl,
        'x-default': pageUrl,
      },
    },
    openGraph: {
      url: pageUrl,
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: published,
      modifiedTime: published,
      authors: ['SongGeneratorAI'],
      section: post?.tag || 'Guide',
      tags: post ? [post.tag, 'AI Music', 'SongGeneratorAI Blog'] : ['AI Music', 'SongGeneratorAI Blog'],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: ['/og-image.png'],
    },
  }
}

export function generateStaticParams() {
  return Object.keys(articles).map(slug => ({ slug }))
}

function renderMarkdown(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-bold mt-10 mb-4">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold mt-8 mb-3">{line.slice(4)}</h3>)
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="my-6 border-border" />)
    } else if (line.startsWith('| ')) {
      // table
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim())
      const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()))
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead><tr>{headers.map((h, hi) => <th key={hi} className="border border-border px-3 py-2 bg-muted text-left font-semibold">{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} className="border border-border px-3 py-2">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )
      continue
    } else if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(<pre key={i} className="my-4 rounded-lg bg-muted p-4 overflow-x-auto text-sm"><code>{codeLines.join('\n')}</code></pre>)
    } else if (line.startsWith('> ')) {
      elements.push(<blockquote key={i} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">{line.slice(2)}</blockquote>)
    } else if (line.startsWith('- ') || line.startsWith('❌ ') || line.startsWith('✅ ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('❌ ') || lines[i].startsWith('✅ '))) {
        items.push(lines[i].replace(/^[-❌✅] /, ''))
        i++
      }
      elements.push(<ul key={i} className="list-disc list-inside space-y-1 my-3 text-muted-foreground">{items.map((item, ii) => <li key={ii}>{item}</li>)}</ul>)
      continue
    } else if (line.startsWith('1. ')) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(<ol key={i} className="list-decimal list-inside space-y-1 my-3 text-muted-foreground">{items.map((item, ii) => <li key={ii}>{item}</li>)}</ol>)
      continue
    } else if (line.startsWith('**[')) {
      const match = line.match(/\*\*\[(.+?)\]\((.+?)\)\*\*/)
      if (match) {
        elements.push(<div key={i} className="mt-8 text-center"><a href={match[2]} className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">{match[1]}</a></div>)
      }
    } else if (line.trim() !== '') {
      // inline bold/link
      const parsed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      elements.push(<p key={i} className="my-3 text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />)
    }
    i++
  }
  return elements
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const article = articles[slug]
  if (!article) notFound()
  const post = blogPosts.find(p => p.slug === slug)
  const pageUrl = `${BASE_URL}/blog/${slug}`
  const published = new Date(article.date).toISOString()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
        ],
      },
      {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: published,
        dateModified: published,
        author: {
          '@type': 'Organization',
          name: 'SongGeneratorAI',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SongGeneratorAI',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/icon-light-32x32.png`,
          },
        },
        image: [`${BASE_URL}/og-image.png`],
        articleSection: post?.tag || 'Guide',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground mb-6 block">← Back to Blog</Link>
        <div className="flex items-center gap-3 mb-4">
          {post && <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{post.tag}</span>}
          <span className="text-xs text-muted-foreground">{article.date}</span>
          {post && <span className="text-xs text-muted-foreground">· {post.readTime}</span>}
        </div>
        <h1 className="text-4xl font-bold leading-tight mb-4">{article.title}</h1>
        <p className="text-lg text-muted-foreground mb-10 border-b border-border pb-8">{article.description}</p>
        <div className="prose-sm">{renderMarkdown(article.content)}</div>
        <div className="mt-16 rounded-xl bg-muted/50 p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to create your own AI music?</h3>
          <p className="text-muted-foreground mb-4">Free to start — 20 credits every day, no credit card needed.</p>
          <a href="/" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">Start Generating Free →</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
