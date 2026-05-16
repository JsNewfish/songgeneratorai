"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Music } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

const showcaseTracks = [
  {
    title: "You are my soul",
    artist: "AnitaDeli",
    tags: ["LO-FI", "soulful", "female vocals"],
    duration: "3:54",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80&fit=crop",
  },
  {
    title: "A Nobody",
    artist: "Echo Tide",
    tags: ["r&b", "dark pop", "alt rock"],
    duration: "3:32",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80&fit=crop",
  },
  {
    title: "Beta Parade",
    artist: "Big Bop",
    tags: ["psychedelic rock", "vaporwave", "dream pop"],
    duration: "2:36",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80&fit=crop",
  },
  {
    title: "tragic but valid",
    artist: "Kaizo94",
    tags: ["Lo-fi", "melancholic", "guitar-trap"],
    duration: "3:19",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80&fit=crop",
  },
  {
    title: "Downhill Phil",
    artist: "LKN",
    tags: ["Electro-swing", "cool jazz", "dramatic"],
    duration: "3:58",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80&fit=crop",
  },
  {
    title: "Goodbye",
    artist: "Mr Villain",
    tags: ["rock", "romantic", "pop rock"],
    duration: "3:09",
    cover: "https://images.unsplash.com/photo-1468164016595-a38e4d434f18?w=600&q=80&fit=crop",
  },
]

export function MusicShowcase() {
  const { t } = useLanguage()
  
  return (
    <section id="showcase" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.showcase.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.showcase.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseTracks.map((track) => (
            <div key={track.title} className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
              {/* Cover Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-900 to-indigo-900">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {/* Play overlay - links to generator */}
                <Link
                  href="/tools/lyrics-to-song"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
                  title={`Create a song like "${track.title}"`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
                    <Play className="h-7 w-7 text-foreground ml-1" />
                  </div>
                </Link>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">{track.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <span className="ml-2 shrink-0 text-sm text-muted-foreground">{track.duration}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {track.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/tools/lyrics-to-song">
              {t.showcase.viewMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


