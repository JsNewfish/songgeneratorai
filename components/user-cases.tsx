"use client"

import { Video, Radio, Gamepad2, GraduationCap, Music2, Megaphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

export function UserCases() {
  const { t } = useLanguage()
  
  const userCases = [
    {
      icon: Video,
      title: t.userCases.contentCreators,
      description: t.userCases.contentDesc
    },
    {
      icon: Radio,
      title: t.userCases.podcasters,
      description: t.userCases.podcastDesc
    },
    {
      icon: Music2,
      title: t.userCases.musicians,
      description: t.userCases.musicianDesc
    },
    {
      icon: Gamepad2,
      title: t.userCases.gameDev,
      description: t.userCases.gameDesc
    },
    {
      icon: GraduationCap,
      title: t.userCases.educators,
      description: t.userCases.eduDesc
    },
    {
      icon: Megaphone,
      title: t.userCases.marketers,
      description: t.userCases.marketDesc
    }
  ]

  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.userCases.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.userCases.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userCases.map((item) => (
            <Card key={item.title} className="border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
