"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function CTASection() {
  const { t } = useLanguage()
  
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
          </div>

          <div className="relative text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              {t.cta.subtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                <Sparkles className="h-5 w-5" />
                {t.cta.startFree}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                {t.cta.learnMore}
              </Button>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/60">
              {t.cta.noCard} · {t.cta.instant} · {t.cta.royaltyFree}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
