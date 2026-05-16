"use client"

import { useState, useRef } from "react"
import { Music, Wand2, Loader2, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signIn } from "next-auth/react"
import Link from "next/link"

const voicePresets = [
  { id: "michael-jackson", name: "Michael Jackson", avatar: "https://ui-avatars.com/api/?name=MJ&background=4a4a4a&color=fff&bold=true&size=64" },
  { id: "taylor-swift", name: "Taylor Swift", avatar: "https://ui-avatars.com/api/?name=TS&background=6b4fa0&color=fff&bold=true&size=64" },
  { id: "ed-sheeran", name: "Ed Sheeran", avatar: "https://ui-avatars.com/api/?name=ES&background=c8602a&color=fff&bold=true&size=64" },
  { id: "adele", name: "Adele", avatar: "https://ui-avatars.com/api/?name=AD&background=2a5c8c&color=fff&bold=true&size=64" },
  { id: "beyonce", name: "Beyoncé", avatar: "https://ui-avatars.com/api/?name=BY&background=8c6c2a&color=fff&bold=true&size=64" },
]

interface Props {
  locale: string
  session: { user?: { email?: string | null } } | null
  creditsRemaining: number | null
  onCreditsUpdate: (c: number) => void
  onResult: (tracks: Array<{ id: string; title: string; audio_url: string; image_url?: string; duration?: number; style?: string }>, subtitle: string) => void
}

export function AICoverPanel({ locale, session, creditsRemaining, onCreditsUpdate, onResult }: Props) {
  const [voiceModel, setVoiceModel] = useState("michael-jackson")
  const [useUrl, setUseUrl] = useState(false)
  const [songUrl, setSongUrl] = useState("")
  const [songFile, setSongFile] = useState<File | null>(null)
  const [songTitle, setSongTitle] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = async () => {
    if (!session) { signIn("google"); return }

    if (!useUrl && !songFile) {
      setError(locale === "zh" ? "请上传一个音频文件" : "Please upload an audio file")
      return
    }
    if (useUrl && !songUrl.trim()) {
      setError(locale === "zh" ? "请输入歌曲URL" : "Please enter a song URL")
      return
    }

    setGenerating(true)
    setError(null)

    try {
      let audioId: string | undefined

      if (!useUrl && songFile) {
        const fd = new FormData()
        fd.append("file", songFile)
        const uploadRes = await fetch("/api/upload-audio", { method: "POST", body: fd })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) { setError(uploadData.error ?? "Upload failed"); setGenerating(false); return }
        audioId = uploadData.audio_id
      }

      const voiceName = voicePresets.find(v => v.id === voiceModel)?.name ?? voiceModel
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cover",
          audio_id: audioId,
          song_url: useUrl ? songUrl : undefined,
          style: `${voiceName} voice style`,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Generation failed"); return }
      if (data.credits_remaining !== undefined) onCreditsUpdate(data.credits_remaining)
      onResult(data.tracks ?? [], `${voiceName} cover`)
    } catch {
      setError(locale === "zh" ? "网络错误，请重试" : "Network error, please try again")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Voice Model */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {locale === "zh" ? "声音模型" : "Voice Model"}
            </label>
            <div className="flex items-center gap-1">
              {voicePresets.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVoiceModel(v.id)}
                  title={v.name}
                  className={`h-8 w-8 overflow-hidden rounded-full ring-2 transition-all ${
                    voiceModel === v.id ? "ring-primary" : "ring-transparent hover:ring-primary/50"
                  }`}
                >
                  <img src={v.avatar} alt={v.name} className="h-full w-full object-cover" />
                </button>
              ))}
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary">
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Select value={voiceModel} onValueChange={setVoiceModel}>
            <SelectTrigger className="mt-2">
              <SelectValue>{voicePresets.find(v => v.id === voiceModel)?.name}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {voicePresets.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  <div className="flex items-center gap-2">
                    <img src={v.avatar} alt={v.name} className="h-5 w-5 rounded-full" />
                    <span>{v.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Song Upload */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {locale === "zh" ? "歌曲" : "Song"}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              {locale === "zh" ? "添加URL链接" : "Add URL Link"}
              <Switch checked={useUrl} onCheckedChange={setUseUrl} />
            </label>
          </div>
          {useUrl ? (
            <input
              type="url"
              value={songUrl}
              onChange={e => setSongUrl(e.target.value)}
              placeholder="Enter URL link"
              className="mt-2 w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => {
                e.preventDefault(); setIsDragging(false)
                const f = e.dataTransfer.files[0]
                if (f?.type.startsWith("audio/")) setSongFile(f)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-2 flex min-h-[150px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border/50 bg-muted/20 hover:border-primary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setSongFile(f) }}
              />
              <div className="text-center">
                <Music className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {songFile ? songFile.name : (locale === "zh" ? "上传歌曲" : "Upload Song")}
                </p>
                {!songFile && <p className="mt-1 text-xs text-muted-foreground/60">MP3, WAV · max 20MB</p>}
              </div>
            </div>
          )}
        </div>

        {/* Song Title */}
        <div className="mt-6">
          <label className="text-sm font-medium text-foreground">
            {locale === "zh" ? "歌曲标题" : "Song Title"}
          </label>
          <input
            type="text"
            value={songTitle}
            onChange={e => setSongTitle(e.target.value)}
            placeholder={locale === "zh" ? "输入您的歌曲标题" : "Enter your song title"}
            className="mt-2 w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Upgrade Card */}
        <div className="mt-6 rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {locale === "zh" ? "升级您的账户" : "Upgrade Your Account"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {locale === "zh"
                  ? "购买更高级套餐，创建更多内容，获得更好的质量并访问更多功能！"
                  : "Get premium plan for more creations, better quality, and more features!"}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-background px-4 pb-4 pt-3 lg:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music className="h-4 w-4" />
          <span>
            {creditsRemaining !== null ? creditsRemaining : "..."}{" "}
            {locale === "zh" ? "积分剩余" : "credits remaining"}
          </span>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={generating || (!useUrl && !songFile) || (useUrl && !songUrl.trim())}
          className="mt-3 w-full gap-2 bg-gradient-to-r from-[#b5838d] via-[#9b8fa8] to-[#7a9e9f] text-white hover:opacity-90"
          size="lg"
        >
          {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
          {locale === "zh" ? "生成" : "Generate"}
        </Button>
        {error && (
          <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-500">{error}</p>
        )}
        <p className="mt-2 text-center text-xs text-orange-500">
          {locale === "zh"
            ? "当请求开始时请稍候，这可能需要几分钟时间。"
            : "Please wait when request starts, this may take a few minutes."}
        </p>
      </div>
    </>
  )
}
