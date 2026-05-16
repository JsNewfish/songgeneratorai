"use client"

import { useState } from "react"
import { Check, X, Sparkles, Loader2 } from "lucide-react"
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
import { useSession, signIn } from "next-auth/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

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
  const { t, locale } = useLanguage()
  const { data: session } = useSession()
  const [isYearly, setIsYearly] = useState(true)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<string>('free')
  const [topupQty, setTopupQty] = useState(1)
  const CREDITS_PER_PACK = 200
  const PRICE_PER_PACK = 3
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!session || fetchedRef.current) return
    fetchedRef.current = true
    fetch('/api/credits').then(r => r.json()).then(d => { if (d.plan) setUserPlan(d.plan) }).catch(() => null)
  }, [session])

  const handleTopup = async () => {
    if (!session) { signIn('google'); return }
    if (userPlan === 'free') {
      toast.error(locale === 'zh' ? '点数包仅对订阅用户开放' : 'Credit packs are available to subscribers only.')
      return
    }
    setLoadingPlan('topup')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'topup', quantity: topupQty }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? (locale === 'zh' ? '跳转支付失败，请重试' : 'Checkout failed, please try again.'))
      }
    } catch {
      toast.error(locale === 'zh' ? '网络错误，请重试' : 'Network error, please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleSubscribe = async (planName: string) => {
    if (!session) {
      signIn('google')
      return
    }
    const plan = `${planName.toLowerCase()}${isYearly ? '_yearly' : ''}`
    setLoadingPlan(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? (locale === 'zh' ? '跳转支付失败，请重试' : 'Checkout failed, please try again.'))
      }
    } catch {
      toast.error(locale === 'zh' ? '网络错误，请重试' : 'Network error, please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

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
                    {plan.monthlyPrice > 0 && (() => {
                        const planId = `${plan.name.toLowerCase()}${isYearly ? '_yearly' : ''}`
                        const isLoading = loadingPlan === planId
                        return (
                          <Button
                            className="w-full cursor-pointer gap-2"
                            variant={plan.popular ? "default" : "outline"}
                            disabled={!!loadingPlan}
                            onClick={() => handleSubscribe(plan.name)}
                          >
                            {isLoading
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Sparkles className="h-4 w-4" />}
                            {isLoading
                              ? (locale === 'zh' ? '跳转中…' : 'Redirecting…')
                              : t.pricing.subscribe}
                          </Button>
                        )
                      })()}
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
                {locale === 'zh' ? '点数包' : 'Credit Packs'}
              </h2>
              <p className="mt-2 text-center text-muted-foreground">
                {locale === 'zh'
                  ? '随时通过灵活的一次性点数包充值。点数永不过期，您可在需要时随时使用。'
                  : 'Top up anytime with flexible one-off credit packs. Credits never expire.'}
              </p>

              <div className="mx-auto mt-8 max-w-sm">
                <Card className="overflow-hidden border-border/50">
                  <CardContent className="p-8">
                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => setTopupQty(q => Math.max(1, q - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <span className="text-xl font-light">−</span>
                      </button>
                      <span className="w-8 text-center text-2xl font-bold text-foreground">{topupQty}</span>
                      <button
                        onClick={() => setTopupQty(q => q + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <span className="text-xl font-light">+</span>
                      </button>
                    </div>

                    {/* Credits display */}
                    <p className="mt-5 text-center text-4xl font-extrabold text-foreground">
                      {topupQty * CREDITS_PER_PACK} <span className="text-primary">Credits</span>
                    </p>

                    {/* Buy button */}
                    <Button
                      onClick={handleTopup}
                      disabled={!!loadingPlan}
                      className="mt-6 w-full cursor-pointer gap-2"
                    >
                      {loadingPlan === 'topup' && <Loader2 className="h-4 w-4 animate-spin" />}
                      {loadingPlan === 'topup'
                        ? (locale === 'zh' ? '跳转中…' : 'Redirecting…')
                        : `${locale === 'zh' ? '购买点数' : 'Buy Credits'} - ~$${(topupQty * PRICE_PER_PACK).toFixed(2)}`}
                    </Button>

                    {/* Subscriber-only hint */}
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      {locale === 'zh' ? '点数包仅对订阅用户开放。' : 'Credit packs are available to subscribers only.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
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
