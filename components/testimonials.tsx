"use client"

import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const testimonials = [
  {
    text: "SongGeneratorAI has revolutionized my music creation process. With its AI Music Generator, I can easily transform my ideas into beautiful melodies that resonate with my audience.",
    name: "jah fire",
    handle: "@jah_fire",
    avatar: "https://storage.aisongmaker.io/home/aisongmaker-people-1.webp",
  },
  {
    text: "SongGeneratorAI is a game-changer for music creators. Its AI Music Generator allows me to effortlessly convert text to song and lyrics to song, creating captivating melodies that elevate my music.",
    name: "hudson orgill",
    handle: "@hudson_orgill",
    avatar: "https://storage.aisongmaker.io/home/aisongmaker-people-2.webp",
  },
  {
    text: "SongGeneratorAI is a must-have tool for any music creator. Its AI Music Generator is incredibly intuitive and easy to use, allowing me to generate high-quality music compositions with just a few clicks.",
    name: "keldric ard",
    handle: "@keldric_ard",
    avatar: "https://storage.aisongmaker.io/home/aisongmaker-people-3.png",
  },
  {
    text: "As an indie filmmaker, finding the right background music was always a challenge. SongGeneratorAI changed everything — I can generate custom royalty-free tracks in minutes.",
    name: "Sarah M.",
    handle: "@sarah_creates",
    avatar: "",
  },
  {
    text: "I use SongGeneratorAI for my podcast intros and it saves me hours every week. The quality is surprisingly professional and the styles are incredibly varied.",
    name: "Mike T.",
    handle: "@mike_podcast",
    avatar: "",
  },
  {
    text: "As a songwriter, I use it to quickly demo melody ideas. It's become an essential part of my creative process — fast, intuitive, and the results are genuinely impressive.",
    name: "Luna R.",
    handle: "@lunamusic",
    avatar: "",
  },
]

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

function Avatar({ name, src }: { name: string; src: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function Testimonials() {
  const { locale } = useLanguage()

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {locale === 'zh' ? '用户评价' : 'What Our Users Say'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {locale === 'zh'
              ? '数千名音乐创作者正在使用 SongGeneratorAI 释放他们的创造力'
              : 'Thousands of music creators are using SongGeneratorAI to unleash their creativity'}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.handle} className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
              <StarRating />
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <Avatar name={t.name} src={t.avatar} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
