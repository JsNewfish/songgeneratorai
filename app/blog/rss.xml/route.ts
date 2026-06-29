import { blogPosts } from '@/lib/blog-posts'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aisonggen.io'

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const latestPubDate = sortedPosts.length > 0 ? new Date(sortedPosts[0].date).toUTCString() : new Date().toUTCString()

  const items = sortedPosts
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}`
      return `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${url}</link>\n      <guid>${url}</guid>\n      <description>${escapeXml(post.description)}</description>\n      <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>SongGeneratorAI Blog</title>\n    <link>${BASE_URL}/blog</link>\n    <description>AI music tips, tutorials, and tool guides from SongGeneratorAI.</description>\n    <language>en-us</language>\n    <lastBuildDate>${latestPubDate}</lastBuildDate>${items}\n  </channel>\n</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
