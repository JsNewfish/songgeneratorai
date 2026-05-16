"use client"

import { useState } from "react"
import { Check, X, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

const plans = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 14.99,
    yearlyPrice: 10.49,
    yearlyTotal: 125.88,
    monthlyCredits: "1,000 credits /month",
    yearlyCredits: "12,000 credits /year",
    monthlyCreditsDesc: "equals 200 musics",
    yearlyCreditsDesc: "equals 2,400 musics",
    features: [
      "Text/Lyrics to Music",
      "AI Lyrics Generator",
      "AI Song Cover",
      "AI Vocal Removal",
      "AI Singing Photo (2 min)",
      "Custom Voice Model (Max 100)",
      "Upload Custom Music (2 min)",
      "1 concurrent generations",
      "365 days cloud storage",
      "Private Generation",
      "Download MP3",
      "Commercial License",
    ],
    unavailable: ["Download WAV/MIDI", "Priority email support"],
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    monthlyPrice: 29.99,
    yearlyPrice: 20.99,
    yearlyTotal: 251.88,
    monthlyCredits: "2,500 credits /month",
    yearlyCredits: "30,000 credits /year",
    monthlyCreditsDesc: "equals 500 musics",
    yearlyCreditsDesc: "equals 6,000 musics",
    features: [
      "Text/Lyrics to Music",
      "AI Lyrics Generator",
      "AI Song Cover",
      "AI Vocal Removal",
      "AI Singing Photo (10 min)",
      "Custom Voice Model (Unlimited)",
      "Upload Custom Music (8 min)",
      "10 concurrent generations",
      "Unlimited cloud storage",
      "Private Generation",
      "Download MP3",
      "Download WAV/MIDI",
      "Commercial License",
    ],
    unavailable: ["Priority email support"],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 59.99,
    yearlyPrice: 41.99,
    yearlyTotal: 503.88,
    monthlyCredits: "6,000 credits /month",
    yearlyCredits: "72,000 credits /year",
    monthlyCreditsDesc: "equals 1,200 musics",
    yearlyCreditsDesc: "equals 14,400 musics",
    features: [
      "Text/Lyrics to Music",
      "AI Lyrics Generator",
      "AI Song Cover",
      "AI Vocal Removal",
      "AI Singing Photo (10 min)",
      "Custom Voice Model (Unlimited)",
      "Upload Custom Music (8 min)",
      "Unlimited concurrent generations",
      "Unlimited cloud storage",
      "Private Generation",
      "Download MP3",
      "Download WAV/MIDI",
      "Commercial License",
      "Priority email support",
    ],
    unavailable: [],
    popular: false,
  },
]

const featureZh: Record<string, string> = {
  "Text/Lyrics to Music": "文字/歌词转音乐",
  "AI Lyrics Generator": "AI歌词生成器",
  "AI Song Cover": "AI翻唱歌曲",
  "AI Vocal Removal": "AI人声消除",
  "AI Singing Photo (2 min)": "AI动态歌手图片(2分钟)",
  "AI Singing Photo (10 min)": "AI动态歌手图片(10分钟)",
  "Custom Voice Model (Max 100)": "自定义声音模型(最多100个)",
  "Custom Voice Model (Unlimited)": "自定义声音模型(无限制)",
  "Upload Custom Music (2 min)": "上传自定义音乐(2分钟)",
  "Upload Custom Music (8 min)": "上传自定义音乐(8分钟)",
  "1 concurrent generations": "1个并发生成",
  "10 concurrent generations": "10个并发生成",
  "Unlimited concurrent generations": "无限并发生成",
  "365 days cloud storage": "365天云存储",
  "Unlimited cloud storage": "无限云存储",
  "Private Generation": "私密生成",
  "Download MP3": "下载MP3",
  "Download WAV/MIDI": "下载WAV/MIDI",
  "Commercial License": "商业授权",
  "Priority email support": "优先邮件支持",
}

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName?: string
  featureNameZh?: string
  locale?: string
}

export function UpgradeDialog({
  open,
  onOpenChange,
  featureName = "this feature",
  featureNameZh = "此功能",
  locale = "en",
}: UpgradeDialogProps) {
  const [isYearly, setIsYearly] = useState(true)
  const isZh = locale === "zh"

  const t = {
    title: isZh ? `升级以使用${featureNameZh}` : `Upgrade to use ${featureName}`,
    subtitle: isZh
      ? `订阅基础版或更高版本计划以使用此${featureNameZh}`
      : `Subscribe to Basic or a higher plan to use ${featureName}`,
    monthly: isZh ? "按月" : "Monthly",
    yearly: isZh ? "按年" : "Yearly",
    off: "30% OFF",
    cancelAnytime: isZh ? "随时可以取消，未使用点数将自动结转" : "Cancel anytime, unused credits roll over",
    popular: isZh ? "热门" : "Popular",
    perMonth: isZh ? "/月" : "/month",
    subscribe: isZh ? "立即订阅" : "Subscribe Now",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">{t.title}</DialogTitle>
          <DialogDescription className="mt-1">{t.subtitle}</DialogDescription>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              {t.monthly}
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              {t.yearly}
            </span>
            {isYearly && (
              <span className="rounded-full bg-gradient-to-r from-orange-400 to-pink-400 px-2.5 py-0.5 text-xs font-bold text-white">
                {t.off}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            {t.cancelAnytime}
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits
            const creditsDesc = isYearly ? plan.yearlyCreditsDesc : plan.monthlyCreditsDesc

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border p-5 ${
                  plan.popular
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {t.popular}
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    {isYearly && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${plan.monthlyPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-foreground">${price}</span>
                    <span className="text-sm text-muted-foreground">{t.perMonth}</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-primary">{credits}</p>
                  <p className="text-xs text-muted-foreground">{creditsDesc}</p>
                </div>

                <Button
                  className={`mt-4 w-full gap-1.5 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <a href="/pricing">
                    <Zap className="h-3.5 w-3.5" />
                    {t.subscribe}
                  </a>
                </Button>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span className="text-xs text-foreground">{isZh ? (featureZh[f] ?? f) : f}</span>
                    </li>
                  ))}
                  {plan.unavailable.map((f) => (
                    <li key={f} className="flex items-start gap-1.5">
                      <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
                      <span className="text-xs text-muted-foreground/40">{isZh ? (featureZh[f] ?? f) : f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
