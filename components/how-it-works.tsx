"use client"

import { FileText, Sliders, Sparkles, Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function HowItWorks() {
  const { t } = useLanguage()
  
  const steps = [
    {
      icon: FileText,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Sliders,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      color: "bg-accent/10 text-accent"
    },
    {
      icon: Sparkles,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      color: "bg-chart-3/10 text-chart-3"
    },
    {
      icon: Download,
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Desc,
      color: "bg-chart-5/10 text-chart-5"
    }
  ]

  return (
    <section id="how-it-works" className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-border lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-2 text-xs font-bold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                
                {/* Icon */}
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${step.color}`}>
                  <step.icon className="h-9 w-9" />
                </div>
                
                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
