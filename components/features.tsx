"use client"

import { 
  Music, 
  Mic, 
  Wand2, 
  Download, 
  Globe, 
  Zap,
  Headphones,
  FileMusic,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

const featureBlocks = [
  {
    titleKey: "aiMusic" as const,
    descKey: "aiMusicDesc" as const,
    icon: Music,
    image: "https://storage.aisongmaker.io/home/feature1.webp",
    href: "/tools/lyrics-to-song",
    ctaKey: "aiMusicCta" as const,
    reverse: false,
  },
  {
    titleKey: "aiLyrics" as const,
    descKey: "aiLyricsDesc" as const,
    icon: Wand2,
    image: "https://storage.aisongmaker.io/home/feature21.webp",
    href: "/ai-lyrics-generator",
    ctaKey: "aiLyricsCta" as const,
    reverse: true,
  },
  {
    titleKey: "voices" as const,
    descKey: "voicesDesc" as const,
    icon: Mic,
    image: "https://storage.aisongmaker.io/cover-song/ai-song-cover-feature-cover.webp",
    href: "/ai-song-cover-generator",
    ctaKey: "voicesCta" as const,
    reverse: false,
  },
  {
    titleKey: "freeDownload" as const,
    descKey: "downloadDesc" as const,
    icon: Download,
    image: "https://storage.aisongmaker.io/home/feature3.webp",
    href: "/tools/vocal-remover",
    ctaKey: "downloadCta" as const,
    reverse: true,
  },
]

const smallFeatures = [
  { icon: Headphones, titleKey: "styles" as const, descKey: "stylesDesc" as const },
  { icon: FileMusic, titleKey: "instrumentalMode" as const, descKey: "instrumentalDesc" as const },
  { icon: Globe, titleKey: "royaltyFree" as const, descKey: "royaltyDesc" as const },
  { icon: Zap, titleKey: "fastGen" as const, descKey: "fastDesc" as const },
  { icon: RefreshCw, titleKey: "unlimited" as const, descKey: "unlimitedDesc" as const },
]

export function Features() {
  const { t } = useLanguage()

  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.features.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.features.subtitle}
          </p>
        </div>

        {/* Large feature blocks with screenshots */}
        <div className="mt-16 space-y-24">
          {featureBlocks.map((f) => (
            <div key={f.titleKey} className={`flex flex-col gap-10 lg:flex-row lg:items-center ${f.reverse ? 'lg:flex-row-reverse' : ''}` }>
              <div className="flex-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-foreground">{t.features[f.titleKey]}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{t.features[f.descKey]}</p>
                <Button asChild className="mt-6 gap-2" variant="outline">
                  <Link href={f.href}>Try Now →</Link>
                </Button>
              </div>
              <div className="flex-1 overflow-hidden rounded-2xl border border-border/50 shadow-xl shadow-primary/5">
                <img
                  src={f.image}
                  alt={t.features[f.titleKey]}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display='none' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Small feature grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {smallFeatures.map((f) => (
            <div key={f.titleKey} className="rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{t.features[f.titleKey]}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{t.features[f.descKey]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
