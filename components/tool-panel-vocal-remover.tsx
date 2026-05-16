"use client"

import { useState, useRef } from "react"
import { Music, Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signIn } from "next-auth/react"
import Link from "next/link"

const removerTypes = [
  { id: "stems", label: "Karaoke Track", labelZh: "卡拉OK音轨" },
  { id: "vocals", label: "Vocals Only", labelZh: "仅人声" },
  { id: "instrumental", label: "Instrumental", labelZh: "纯音乐" },
]

interface Props {
  locale: string
  session: { user?: { email?: string | null } } | null
  creditsRemaining: number | null
  onCreditsUpdate: (c: number) => void
  onResult: (tracks: Array<{ id: string; title: string; audio_url: string; image_url?: string; duration?: number; style?: string }>, subtitle: string) => void
}

export function VocalRemoverPanel({ locale, session, creditsRemaining, onCreditsUpdate, onResult }: Props) {
  const [songUrl, setSongUrl] = useState("")
  const [useUrlMode, setUseUrlMode] = useState(true)
  const [songFile, setSongFile] = useState<File | null>(null)
  const [removerType, setRemoverType] = useState("stems")
  const [isDragging, setIsDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSetUrl = () => {
    // URL mode is always visible; this just confirms entry
    if (!songUrl.trim()) setError(locale === "zh" ? "请输入歌曲URL" : "Please enter a song URL")
    else setError(null)
  }

  const handleGenerate = async () => {
    if (!session) { signIn("google"); return }

    if (useUrlMode && !songUrl.trim()) {
      setError(locale === "zh" ? "请输入歌曲URL" : "Please enter a song URL")
      return
    }
    if (!useUrlMode && !songFile) {
      setError(locale === "zh" ? "请上传一个音频文件" : "Please upload an audio file")
      return
    }

    setGenerating(true)
    setError(null)

    try {
      let audioId: string | undefined

      if (!useUrlMode && songFile) {
        const fd = new FormData()
        fd.append("file", songFile)
        const uploadRes = await fetch("/api/upload-audio", { method: "POST", body: fd })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) { setError(uploadData.error ?? "Upload failed"); setGenerating(false); return }
        audioId = uploadData.audio_id
      }

      const typeLabel = removerTypes.find(t => t.id === removerType)
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stems",
          audio_id: audioId,
          song_url: useUrlMode ? songUrl : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Processing failed"); return }
      if (data.credits_remaining !== undefined) onCreditsUpdate(data.credits_remaining)
      const subtitle = locale === "zh" ? (typeLabel?.labelZh ?? "人声去除") : (typeLabel?.label ?? "Vocal Remover")
      onResult(data.tracks ?? [], subtitle)
    } catch {
      setError(locale === "zh" ? "网络错误，请重试" : "Network error, please try again")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Song Input */}
        <div>
          <label className="text-sm font-medium text-foreground">
            {locale === "zh" ? "歌曲" : "Song"}
          </label>

          {/* URL row */}
          <div className="mt-2 flex gap-2">
            <input
              type="url"
              value={songUrl}
              onChange={e => { setSongUrl(e.target.value); setUseUrlMode(true); setSongFile(null) }}
              placeholder={locale === "zh" ? "输入歌曲URL" : "Enter Song URL"}
              className="flex-1 rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button size="sm" onClick={handleSetUrl} className="bg-primary text-primary-foreground hover:opacity-90">
              {locale === "zh" ? "确认" : "Set URL"}
            </Button>
          </div>

          {/* Or Upload */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault(); setIsDragging(false)
              const f = e.dataTransfer.files[0]
              if (f?.type.startsWith("audio/")) { setSongFile(f); setUseUrlMode(false); setSongUrl("") }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-3 flex min-h-[140px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border/50 bg-muted/20 hover:border-primary/50"
            } ${songFile ? "border-primary/50 bg-primary/5" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) { setSongFile(f); setUseUrlMode(false); setSongUrl("") } }}
            />
            <div className="text-center">
              <Music className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {songFile ? songFile.name : (locale === "zh" ? "上传歌曲" : "Upload Song")}
              </p>
              {!songFile && <p className="mt-1 text-xs text-muted-foreground/60">MP3, WAV · max 20MB</p>}
            </div>
          </div>
        </div>

        {/* Type Selector */}
        <div className="mt-6">
          <label className="text-sm font-medium text-foreground">
            {locale === "zh" ? "类型" : "Type"}
          </label>
          <Select value={removerType} onValueChange={setRemoverType}>
            <SelectTrigger className="mt-2">
              <SelectValue>
                {locale === "zh"
                  ? removerTypes.find(t => t.id === removerType)?.labelZh
                  : removerTypes.find(t => t.id === removerType)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {removerTypes.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {locale === "zh" ? t.labelZh : t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  ? "购买更高级计划，创作更多作品，获得更好的质量，访问更多功能！"
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
          disabled={generating || (useUrlMode && !songUrl.trim()) || (!useUrlMode && !songFile)}
          className="mt-3 w-full gap-2 bg-gradient-to-r from-[#b5838d] via-[#9b8fa8] to-[#7a9e9f] text-white hover:opacity-90"
          size="lg"
        >
          {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
          {locale === "zh" ? "移除人声" : "Remove Vocal"}
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
