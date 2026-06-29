import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-posts"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aisonggen.io"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const latestBlogDate = blogPosts.reduce((latest, post) => {
    const current = new Date(post.date)
    return current > latest ? current : latest
  }, new Date(0))

  const staticRoutes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority: number
    lastModified?: Date
  }> = [
    { path: "", changeFrequency: "daily", priority: 1, lastModified: latestBlogDate },
    { path: "/tools/lyrics-to-song", changeFrequency: "weekly", priority: 0.9 },
    { path: "/tools/text-to-song", changeFrequency: "weekly", priority: 0.9 },
    { path: "/tools/vocal-remover", changeFrequency: "weekly", priority: 0.8 },
    { path: "/ai-lyrics-generator", changeFrequency: "weekly", priority: 0.8 },
    { path: "/ai-song-cover-generator", changeFrequency: "weekly", priority: 0.8 },
    { path: "/tools/ai-singing-photo", changeFrequency: "weekly", priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7, lastModified: latestBlogDate },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: route.lastModified || now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticEntries, ...blogEntries]
}
