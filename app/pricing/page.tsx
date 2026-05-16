"use client"

import { useState } from "react"
import { Check, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyCredits: "20 credits /day",
    yearlyCredits: "20 credits /day",
    monthlyCreditsDesc: "equals 4 musics",
    yearlyCreditsDesc: "equals 4 musics",
    features: [
      { name: "Text/Lyrics to Music", included: true },
      { name: "AI Lyrics Generator", included: true },
      { name: "AI Song Cover", included: true },
      { name: "AI Vocal Removal", included: true },
      { name: "AI Singing Photo (10s)", included: true },
      { name: "Train Custom Voice Model", included: false },
      { name: "Upload Custom Music (1 min)", included: true },
      { name: "1 concurrent generations", included: true },
      { name: "30 days cloud storage", included: true },
      { name: "Private Generation", included: true },
      { name: "Download MP3/WAV/MIDI", included: false },
      { name: "Commercial License", included: false },
      { name: "Priority email support", included: false },
    ],
    popular: false,
  },
  {
    name: "Basic",
    monthlyPrice: 14.99,
    yearlyPrice: 10.49,
    monthlyCredits: "1,000 credits /month",
    yearlyCredits: "12,000 credits /year",
    monthlyCreditsDesc: "equals 200 musics",
    yearlyCreditsDesc: "equals 2,400 musics",
    features: [
      { name: "Text/Lyrics to Music", included: true },
      { name: "AI Lyrics Generator", included: true },
      { name: "AI Song Cover", included: true },
      { name: "AI Vocal Removal", included: true },
      { name: "AI Singing Photo (2 min)", included: true },
      { name: "Custom Voice Model (Max 100)", included: true },
      { name: "Upload Custom Music (2 min)", included: true },
      { name: "1 concurrent generations", included: true },
      { name: "365 days cloud storage", included: true },
      { name: "Private Generation", included: true },
      { name: "Download MP3", included: true },
      { name: "Download WAV/MIDI", included: false },
      { name: "Commercial License", included: true },
      { name: "Priority email support", included: false },
    ],
    popular: false,
  },
  {
    name: "Standard",
    monthlyPrice: 29.99,
    yearlyPrice: 20.99,
    monthlyCredits: "2,500 credits /month",
    yearlyCredits: "30,000 credits /year",
    monthlyCreditsDesc: "equals 500 musics",
    yearlyCreditsDesc: "equals 6,000 musics",
    features: [
      { name: "Text/Lyrics to Music", included: true },
      { name: "AI Lyrics Generator", included: true },
      { name: "AI Song Cover", included: true },
      { name: "AI Vocal Removal", included: true },
      { name: "AI Singing Photo (10 min)", included: true },
      { name: "Custom Voice Model (Unlimited)", included: true },
      { name: "Upload Custom Music (8 min)", included: true },
      { name: "10 concurrent generations", included: true },
      { name: "Unlimited cloud storage", included: true },
      { name: "Private Generation", included: true },
      { name: "Download MP3", included: true },
      { name: "Download WAV/MIDI", included: true },
      { name: "Commercial License", included: true },
      { name: "Priority email support", included: false },
    ],
    popular: true,
  },
  {
    name: "Pro",
    monthlyPrice: 59.99,
    yearlyPrice: 41.99,
    monthlyCredits: "6,000 credits /month",
    yearlyCredits: "72,000 credits /year",
    monthlyCreditsDesc: "equals 1,200 musics",
    yearlyCreditsDesc: "equals 14,400 musics",
    features: [
      { name: "Text/Lyrics to Music", included: true },
      { name: "AI Lyrics Generator", included: true },
      { name: "AI Song Cover", included: true },
      { name: "AI Vocal Removal", included: true },
      { name: "AI Singing Photo (10 min)", included: true },
      { name: "Custom Voice Model (Unlimited)", included: true },
      { name: "Upload Custom Music (8 min)", included: true },
      { name: "Unlimited concurrent generations", included: true },
      { name: "Unlimited cloud storage", included: true },
      { name: "Private Generation", included: true },
      { name: "Download MP3", included: true },
      { name: "Download WAV/MIDI", included: true },
      { name: "Commercial License", included: true },
      { name: "Priority email support", included: true },
    ],
    popular: false,
  },
]
      { name: "AI Vocal Removal", included: true },
      { name: "AI Singing Photo (10 min)", included: true },
      { name: "Custom Voice Model (Unlimited)", included: true },
      { name: "Upload Custom Music (8 min)", included: true },
      { name: "Unlimited concurrent generations", included: true },
      { name: "Unlimited cloud storage", included: true },
      { name: "Private Generation", included: true },
      { name: "Download MP3", included: true },
      { name: "Download WAV/MIDI", included: true },
      { name: "Commercial License", included: true },
      { name: "Priority email support", included: true },
    ],
    popular: false,
  },
]

const faqs = [
  { q: "Is it safe to purchase a plan on SongGeneratorAI?", a: "Yes, it is safe to purchase a plan on SongGeneratorAI. We use secure payment gateways to process transactions and ensure that your payment information is protected. Your privacy and security are our top priorities." },
  { q: "How do music credits work?", a: "Music credits are used to generate songs and use features in SongGeneratorAI. Annual subscribers receive all yearly credits upfront, while monthly subscribers receive credits every month. If you run out of credits, you can either re-subscribe or buy one-time credit packs." },
  { q: "Personal and Commercial Use", a: "Free users can publish their songs on platforms like YouTube or Spotify, but must credit SongGeneratorAI. Subscribers enjoy full commercial rights for all songs they create. Songs generated in the 7 days before subscribing will automatically receive commercial rights once you subscribe." },
  { q: "Can I get commercial rights for past free songs after subscribing?", a: "Yes. Songs generated within the 7 days before your subscription starts will automatically receive commercial rights." },
  { q: "Do my songs keep commercial rights after I cancel?", a: "Yes. Songs generated during your active subscription period will continue to have commercial rights even after you cancel your subscription." },
  { q: "Do unused credits roll over?", a: "Yes. Any unused credits will be carried over and added to your balance when your subscription renews." },
  { q: "Will my credits remain after cancellation?", a: "Yes. Your credits will remain in your account after cancellation, and any new credits from a future subscription will be added to your existing balance." },
  { q: "How do I cancel my subscription?", a: "You can cancel your subscription by going to your account settings to manage your billing details. After cancellation, all songs you previously generated will still retain commercial rights." },
  { q: "Can I pay with PayPal?", a: "Yes. You can choose your preferred plan using PayPal subscription links available on the payment page." },
]

export default function PricingPage() {
  const { t } = useLanguage()
  const [isYearly, setIsYearly] = useState(true)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            {/* Hero */}
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t.pricing.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.pricing.subtitle}
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                {t.pricing.monthly}
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                {t.pricing.yearly}
              </span>
              {isYearly && (
                <span className="rounded-full bg-gradient-to-r from-orange-400 to-pink-400 px-2.5 py-0.5 text-xs font-bold text-white">
                  30% OFF
                </span>
              )}
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t.pricing.cancelAnytime}
            </p>

            {/* Pricing Cards */}
            <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative border-border/50 ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {t.pricing.popular}
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <div className="mt-2">
                      {plan.monthlyPrice === 0 ? (
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-foreground">$0</span>
                          <span className="ml-1 text-muted-foreground">{t.pricing.perMonth}</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline">
                          {isYearly && (
                            <span className="mr-2 text-lg text-muted-foreground line-through">
                              ${plan.monthlyPrice}
                            </span>
                          )}
                          <span className="text-4xl font-bold text-foreground">
                            ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="ml-1 text-muted-foreground">{t.pricing.perMonth}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-primary">{isYearly ? plan.yearlyCredits : plan.monthlyCredits}</p>
                    <p className="text-xs text-muted-foreground">{isYearly ? plan.yearlyCreditsDesc : plan.monthlyCreditsDesc}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {plan.monthlyPrice === 0 ? (
                      <Button variant="outline" className="w-full">
                        Get Started
                      </Button>
                    ) : (
                      <Button className="w-full gap-2" variant={plan.popular ? "default" : "outline"}>
                        <Sparkles className="h-4 w-4" />
                        {t.pricing.subscribe}
                      </Button>
                    )}
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-start gap-2">
                          {feature.included ? (
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Credit Packs */}
            <div className="mx-auto mt-20 max-w-2xl">
              <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
                {t.pricing.creditPacks}
              </h2>
              <p className="mt-2 text-center text-muted-foreground">
                {t.pricing.creditPacksDesc}
              </p>

              <Card className="mt-8 border-border/50">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold text-foreground">400 Credits</h3>
                    <p className="text-sm text-muted-foreground">{t.pricing.purchase} - ~$6.00</p>
                  </div>
                  <Button variant="outline" disabled>
                    {t.pricing.subscribersOnly}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="mx-auto mt-20 max-w-3xl">
              <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
                SongGeneratorAI Pricing FAQs
              </h2>
              <p className="mt-2 text-center text-muted-foreground">
                Frequently Asked Questions About SongGeneratorAI Pricing Plans
              </p>

              <Accordion type="single" collapsible className="mt-8">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                    <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
