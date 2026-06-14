"use client"

import { useState, useRef, useEffect } from "react"
import { Image, Music, Loader2, X, Upload, Video, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

type SingingStyle = "natural" | "lively" | "soft"
type PoseScale = "small" | "medium" | "large"
type LipScale = "small" | "medium" | "large"

interface VideoResult {
  id: string
  title: string
  video_url: string
  thumbnail?: string
}

interface Props {
  locale: string
  session: { user?: { email?: string | null } } | null
  creditsRemaining: number | null
  onCreditsUpdate: (c: number) => void
}

const MAX_PHOTO_SIZE = 10 * 1024 * 1024   // 10MB
const MAX_AUDIO_DURATION_FREE = 10        // 10 seconds for free users

export function SingingPhotoPanel({ locale, session, creditsRemaining, onCreditsUpdate }: Props) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null)
  const [singingStyle, setSingingStyle] = useState<SingingStyle>("natural")
  const [poseScale, setPoseScale] = useState<PoseScale>("medium")
  const [lipScale, setLipScale] = useState<LipScale>("medium")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<VideoResult[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [isDraggingAudio, setIsDraggingAudio] = useState(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  const t = (en: string, zh: string) => locale === "zh" ? zh : en

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePhotoSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t("Please upload a JPG, PNG or WEBP image", "请上传 JPG、PNG 或 WEBP 图片"))
      return
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError(t("Image must be under 10MB", "图片大小不能超过 10MB"))
      return
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleAudioSelect = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      setError(t("Please upload an MP3, WAV or M4A audio file", "请上传 MP3、WAV 或 M4A 音频文件"))
      return
    }
    if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl)
    setAudioFile(file)
    setAudioObjectUrl(URL.createObjectURL(file))
    setError(null)
  }

  const handleGenerate = async () => {
    if (!session) { signIn("google"); return }
    if (!photoFile) {
      setError(t("Please upload a photo", "请上传一张照片"))
      return
    }
    if (!audioFile) {
      setError(t("Please upload an audio file", "请上传一个音频文件"))
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const fd = new FormData()
      fd.append("photo", photoFile)
      fd.append("audio", audioFile)
      fd.append("style", singingStyle)
      fd.append("pose_scale", poseScale)
      fd.append("lip_scale", lipScale)

      const res = await fetch("/api/singing-photo", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t("Generation failed", "生成失败"))
        return
      }
      if (data.credits_remaining !== undefined) onCreditsUpdate(data.credits_remaining)

      const newResult: VideoResult = {
        id: data.id ?? `sp-${Date.now()}`,
        title: t("Singing Photo", "唱歌照片") + ` ${results.length + 1}`,
        video_url: data.video_url,
        thumbnail: photoPreview ?? undefined,
      }
      setResults(prev => [newResult, ...prev])
    } catch {
      setError(t("Network error, please try again", "网络错误，请重试"))
    } finally {
      setGenerating(false)
    }
  }

  const photoDragHandlers = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setIsDraggingPhoto(true) },
    onDragLeave: () => setIsDraggingPhoto(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault(); setIsDraggingPhoto(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handlePhotoSelect(file)
    },
  }

  const audioDragHandlers = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setIsDraggingAudio(true) },
    onDragLeave: () => setIsDraggingAudio(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault(); setIsDraggingAudio(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleAudioSelect(file)
    },
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
      {/* Photo Upload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          {t("Upload Photo", "上传照片")}
        </label>
        <div
          {...photoDragHandlers}
          onClick={() => photoInputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
            isDraggingPhoto
              ? "border-primary bg-primary/10"
              : "border-border/60 hover:border-primary/60 hover:bg-muted/50"
          } ${photoPreview ? "h-48" : "h-36"}`}
        >
          {photoPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="preview" className="h-full w-full object-cover" />
              <button
                onClick={e => { e.stopPropagation(); setPhotoFile(null); if (photoPreview) { URL.revokeObjectURL(photoPreview); setPhotoPreview(null) } }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Image className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {t("Click or drag to upload a face photo (JPG/PNG/WEBP)", "点击或拖入人脸照片（JPG/PNG/WEBP）")}
              </p>
            </div>
          )}
        </div>
        <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoSelect(f); e.target.value = "" }} />
      </div>

      {/* Audio Upload */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {t("Upload Song", "上传歌曲")}
          </label>
          <span className="text-xs text-muted-foreground">
            {t(`Free: trim to ${MAX_AUDIO_DURATION_FREE}s`, `免费版最长 ${MAX_AUDIO_DURATION_FREE}s`)}
          </span>
        </div>
        <div
          {...audioDragHandlers}
          onClick={() => audioInputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            isDraggingAudio
              ? "border-primary bg-primary/10"
              : "border-border/60 hover:border-primary/60 hover:bg-muted/50"
          } h-24`}
        >
          {audioFile ? (
            <div className="flex w-full items-center gap-3 px-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{audioFile.name}</p>
                <p className="text-xs text-muted-foreground">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setAudioFile(null); if (audioObjectUrl) { URL.revokeObjectURL(audioObjectUrl); setAudioObjectUrl(null) } }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 p-4 text-center">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("Click or drag to upload MP3 / WAV / M4A", "点击或拖入 MP3 / WAV / M4A")}
              </p>
            </div>
          )}
        </div>
        <input ref={audioInputRef} type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/wave,audio/mp4,audio/m4a" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleAudioSelect(f); e.target.value = "" }} />
      </div>

      {/* Style Options */}
      <div className="grid grid-cols-3 gap-3">
        {/* Singing Style */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t("Singing Style", "演唱风格")}
          </label>
          <select
            value={singingStyle}
            onChange={e => setSingingStyle(e.target.value as SingingStyle)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="natural">{t("Natural", "自然")}</option>
            <option value="lively">{t("Lively", "活泼")}</option>
            <option value="soft">{t("Soft", "柔和")}</option>
          </select>
        </div>
        {/* Pose Scale */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t("Pose Scale", "姿态幅度")}
          </label>
          <select
            value={poseScale}
            onChange={e => setPoseScale(e.target.value as PoseScale)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="small">{t("Small", "小")}</option>
            <option value="medium">{t("Medium", "中")}</option>
            <option value="large">{t("Large", "大")}</option>
          </select>
        </div>
        {/* Lip Scale */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {t("Lip Scale", "嘴型幅度")}
          </label>
          <select
            value={lipScale}
            onChange={e => setLipScale(e.target.value as LipScale)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="small">{t("Small", "小")}</option>
            <option value="medium">{t("Medium", "中")}</option>
            <option value="large">{t("Large", "大")}</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      {/* Generate Button */}
      <div className="border-t border-border/50 pt-4">
        <Button
          className="w-full gap-2"
          disabled={generating || !photoFile || !audioFile}
          onClick={handleGenerate}
        >
          {generating ? (
            <><Loader2 className="h-4 w-4 animate-spin" />{t("Generating... (~2min)", "生成中...（约2分钟）")}</>
          ) : (
            <><Video className="h-4 w-4" />{t("Generate Singing Video", "生成唱歌视频")}</>
          )}
        </Button>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          {t("10 credits per generation", "每次消耗 10 积分")}
        </p>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">{t("Results", "生成结果")}</h3>
          {results.map(r => (
            <div key={r.id} className="overflow-hidden rounded-xl border border-border/50 bg-card">
              <video
                ref={el => { if (el) videoRefs.current.set(r.id, el) }}
                src={r.video_url}
                poster={r.thumbnail ?? undefined}
                controls
                className="w-full"
                onPlay={() => setPlayingId(r.id)}
                onPause={() => { if (playingId === r.id) setPlayingId(null) }}
              />
              <div className="flex items-center justify-between p-3">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <a
                  href={r.video_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
