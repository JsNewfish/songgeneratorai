export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  tag: string
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'how-to-make-ai-music-free',
    title: 'How to Make AI Music for Free in 2026 (Step-by-Step Guide)',
    description: "A complete beginner's guide to creating original AI-generated music online for free. No music experience needed.",
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
    description: "We tested the top AI music generators so you don't have to. See which one produces the best results for free.",
    date: '2026-06-13',
    readTime: '7 min read',
    tag: 'Comparison',
  },
]
