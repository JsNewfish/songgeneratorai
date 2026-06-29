import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { blogPosts } from '@/lib/blog-posts'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisonggen.io'

export const metadata: Metadata = {
  title: 'Blog - AI Music Tips & Guides | SongGeneratorAI',
  description: 'Learn how to create AI music, generate song lyrics, make AI covers and more. Tips, guides and tutorials for AI music generation.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
}

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">Tips, guides and tutorials for AI music generation</p>
        <div className="space-y-6">
          {blogPosts.map(post => (
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
