"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { ExternalLink, Minus, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function MySubscriptionPage() {
  const { locale } = useLanguage()
  const { data: session } = useSession()
  const [creditPacks, setCreditPacks] = useState(2)
  const [credits, setCredits] = useState<number | null>(null)
  const [plan, setPlan] = useState<string>("free")
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const creditsPerPack = 200
  const pricePerPack = 3

  useEffect(() => {
    if (!session?.user) return
    setLoadingCredits(true)
    fetch("/api/credits")
      .then((r) => r.json())
      .then((data) => {
        setCredits(data.credits ?? 0)
        setPlan(data.plan ?? "free")
      })
      .catch(() => setCredits(0))
      .finally(() => setLoadingCredits(false))
  }, [session])

  async function handleBuyCredits() {
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "topup", quantity: creditPacks }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setCheckoutLoading(false)
    }
  }

  const planLabels: Record<string, string> = {
    free: "Free Plan",
    basic: "Basic",
    standard: "Standard",
    pro: "Pro",
  }

  const t = {
    en: {
      title: "My Subscription",
      subtitle: "Manage your subscription and payment information.",
      currentPlan: "Current Plan",
      currentPlanDesc: "Manage your current plan and payment information.",
      plan: "Plan",
      freePlan: "Free Plan",
      paymentDetails: "Payment Details",
      managePayment: "Manage your payment details",
      usage: "Usage",
      usageDesc: "Manage your usage.",
      credits: "Credits",
      buyCredits: "Buy Credit Packs",
      creditsFor: "Credits For",
      upgradePlan: "Upgrade Plan",
      buyNow: "Buy Now",
    },
    zh: {
      title: "我的订阅",
      subtitle: "管理您的订阅和付款信息。",
      currentPlan: "当前套餐",
      currentPlanDesc: "管理您的当前套餐和付款信息。",
      plan: "套餐",
      freePlan: "Free Plan",
      paymentDetails: "付款详情",
      managePayment: "管理您的付款详情",
      usage: "使用情况",
      usageDesc: "管理您的使用情况。",
      credits: "点数",
      buyCredits: "购买点数包充值",
      creditsFor: "Credits For",
      upgradePlan: "升级套餐",
      buyNow: "立即购买",
    },
  }

  const text = t[locale as keyof typeof t] || t.en

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{text.title}</h1>
            <p className="mt-2 text-muted-foreground">{text.subtitle}</p>
          </div>

          <div className="border-t border-border pt-8">
            {/* Current Plan Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground">{text.currentPlan}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text.currentPlanDesc}</p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Plan Card */}
                <Card className="border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{text.plan}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {planLabels[plan] ?? plan}
                  </p>
                </Card>

                {/* Payment Details Card */}
                <Card className="border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{text.paymentDetails}</p>
                  <Button variant="outline" className="mt-3 gap-2" asChild>
                    <Link href="/pricing">
                      {text.managePayment}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>

            {/* Usage Section */}
            <div>
              <h2 className="text-xl font-semibold text-foreground">{text.usage}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text.usageDesc}</p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Credits Card */}
                <Card className="border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{text.credits}</p>
                  {loadingCredits ? (
                    <Loader2 className="mt-2 h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <p className="mt-2 text-xl font-semibold text-foreground">
                      {credits ?? 0} Credits
                    </p>
                  )}
                </Card>

                {/* Buy Credits Card */}
                <Card className="border-border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{text.buyCredits}</p>
                  
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCreditPacks(Math.max(1, creditPacks - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={creditPacks}
                      onChange={(e) => setCreditPacks(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 rounded-md border border-border bg-background px-3 py-1.5 text-center text-foreground"
                      min="1"
                    />
                    <button
                      onClick={() => setCreditPacks(creditPacks + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    {creditPacks * creditsPerPack} {text.creditsFor} ~${(creditPacks * pricePerPack).toFixed(2)}
                  </p>

                  <Button
                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                    onClick={handleBuyCredits}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : text.buyNow}
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
