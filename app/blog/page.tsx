import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Blog - AI Music Tips & Guides | SongGeneratorAI',
  description: 'Learn how to create AI music, generate song lyrics, make AI covers and more. Tips, guides and tutorials for AI music generation.',
  alternates: { canonical: '/blog' },
}

export const posts = [
  {
    slug: 'how-to-make-ai-music-free',
    title: 'How to Make AI Music for Free in 2026 (Step-by-Step Guide)',
    description: 'A complete beginner\'s guide to creating original AI-generated music online for free. No music experience needed.',
    date: '2026-06-15',
    readTime: '5 min read',
    tag: 'Guide',
  },
  {
    slug: 'lyrics-to-song-generator',
    title: 'How to Turn Your Lyrics Into a Song with AI (2026)',
    description: 'Step-by-step guide on converting your written lyrics into a full AI song with vocals, instruments, and style.',
    date: '2026-06-14',
    readTime: '4 min read',
    tag: 'Tutorial',
  },
  {
    slug: 'best-ai-music-generator',
    title: 'Best AI Music Generators in 2026: Full Comparison',
    description: 'We tested the top AI music generators so you don\'t have to. See which one produces the best results for free.',
    date: '2026-06-13',
    readTime: '7 min read',
    tag: 'Comparison',
  },
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">Tips, guides and tutorials for AI music generation</p>
        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{post.tag}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                <p className="text-muted-foreground text-sm">{post.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
