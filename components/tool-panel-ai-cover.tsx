"use client"

import { useState, useRef, useEffect } from "react"
import { Music, Wand2, Loader2, LayoutGrid, Trash2, Play, Pause, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { signIn } from "next-auth/react"
import Link from "next/link"

type VoicePreset = {
  id: string
  name: string
  avatar: string
  category: string
  demo?: string
}

const voicePresets: VoicePreset[] = [
  // Celebrity
  { id: "michael-jackson", name: "Michael Jackson", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/michael-jackson.jpeg" },
  { id: "taylor-swift", name: "Taylor Swift", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/taylor-swift.jpeg" },
  { id: "ariana-grande", name: "Ariana Grande", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/ariana-grande.jpeg" },
  { id: "ariana-grande-butera", name: "Ariana Grande Butera", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/ariana-grande-butera.jpeg" },
  { id: "billie-eilish", name: "Billie Eilish", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/billie-eilish.jpeg" },
  { id: "beyonce", name: "Beyonce", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/beyonce.jpeg" },
  { id: "donald-trump", name: "Donald Trump", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/donald-trump.jpeg" },
  { id: "obama", name: "Obama", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/obama.jpeg" },
  { id: "joseph-james-rogan", name: "Joe Rogan", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/joseph-james-rogan.jpeg" },
  { id: "arnold-schwarzenegger", name: "Arnold Schwarzenegger", category: "Celebrity", avatar: "https://storage.aisongmaker.io/voicemodel/arnold-schwarzenegger.jpeg" },
  // Music
  { id: "drake", name: "Drake", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/drake.jpeg" },
  { id: "the-weeknd", name: "The Weeknd", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/the-weeknd.jpeg" },
  { id: "bruno-mars", name: "Bruno Mars", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/bruno-mars.jpeg" },
  { id: "lana-del-rey", name: "Lana Del Rey", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/lana-del-rey.jpeg" },
  { id: "dua-lipa", name: "Dua Lipa", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/dua-lipa.jpeg" },
  { id: "frank-sinatra", name: "Frank Sinatra", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/frank-sinatra.jpeg" },
  { id: "nicki-minaj", name: "Nicki Minaj", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/nicki-minaj.jpeg" },
  { id: "travis-scott", name: "Travis Scott", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/travis-scott.jpeg" },
  { id: "juice-wrl", name: "Juice WRLD", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/juice-wrl.jpeg" },
  { id: "paul-mccartney", name: "Paul McCartney", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/paul-mccartney.jpeg" },
  { id: "luciano-pavarotti", name: "Luciano Pavarotti", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/luciano-pavarotti.jpeg" },
  { id: "bad-bunny", name: "Bad Bunny", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/bad-bunny.jpeg" },
  { id: "burna-boy", name: "Burna Boy", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/burna-boy.jpeg" },
  { id: "joji", name: "Joji", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/joji.jpeg" },
  { id: "mf-doom", name: "MF Doom", category: "Music", avatar: "https://storage.aisongmaker.io/voicemodel/mf-doom.jpeg" },
  // K-pop
  { id: "rose", name: "Rose", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/rose.jpeg" },
  { id: "jungkook", name: "Jungkook", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/jungkook.jpeg" },
  { id: "blackpink-jennie", name: "Blackpink Jennie", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/blackpink-jennie.jpeg" },
  { id: "blackpinklisa", name: "Blackpink Lisa", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/blackpinklisa.jpeg" },
  { id: "jisoo", name: "Jisoo", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/jisoo.jpeg" },
  { id: "iu", name: "IU", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/iu.jpeg" },
  { id: "aespa", name: "Aespa", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/aespa.jpeg" },
  { id: "yujin", name: "Yujin", category: "K-pop", avatar: "https://storage.aisongmaker.io/voicemodel/yujin.jpeg" },
  // Anime
  { id: "hatsune-miku", name: "Hatsune Miku", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/hatsune-miku.jpeg" },
  { id: "naruto", name: "Naruto", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/naruto-uzumaki.jpeg" },
  { id: "tanjiro", name: "Tanjiro", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/tanjiro.jpeg" },
  { id: "satoru-gojo", name: "Satoru Gojo", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/satoru-gojo.jpeg" },
  { id: "goku", name: "Goku", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/goku.jpeg" },
  { id: "jinx", name: "Jinx", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/jinx.jpeg" },
  { id: "hu-tao", name: "Hu Tao", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/hu-tao.jpeg" },
  { id: "kamisato-ayaka", name: "Kamisato Ayaka", category: "Anime", avatar: "https://storage.aisongmaker.io/voicemodel/kamisato-ayaka.jpeg" },
  // Game
  { id: "minecraft-villager", name: "Minecraft Villager", category: "Game", avatar: "https://storage.aisongmaker.io/voicemodel/minecraft-villager.jpeg" },
  { id: "sonic-the-hedgehog", name: "Sonic the Hedgehog", category: "Game", avatar: "https://storage.aisongmaker.io/voicemodel/sonic-the-hedgehog.jpeg" },
  { id: "arthur-morgan", name: "Arthur Morgan", category: "Game", avatar: "https://storage.aisongmaker.io/voicemodel/arthur-morgan.jpeg" },
  { id: "leon-scott-kennedy", name: "Leon Kennedy", category: "Game", avatar: "https://storage.aisongmaker.io/voicemodel/leon-scott-kennedy.jpeg" },
  // Cartoon
  { id: "spongebob-squarepants", name: "SpongeBob", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/spongebob-squarepants.jpeg" },
  { id: "peter-griffin", name: "Peter Griffin", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/peter-griffin.jpeg" },
  { id: "sheldon-j-plankton", name: "Plankton", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/sheldon-j-plankton.jpeg" },
  { id: "peppa-pig", name: "Peppa Pig", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/peppa-pig.jpeg" },
  { id: "bart-simpson-singing", name: "Bart Simpson", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/bart-simpson-singing.jpeg" },
  { id: "darth-vader", name: "Darth Vader", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/darth-vader.jpeg" },
  { id: "mickey-mouse", name: "Mickey Mouse", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/mickey-mouse.jpeg" },
  { id: "dora", name: "Dora", category: "Cartoon", avatar: "https://storage.aisongmaker.io/voicemodel/dora.jpeg" },
]

const categories = ["ALL", "Music", "Celebrity", "K-pop", "Anime", "Game", "Cartoon"]

interface Props {
  locale: string
  session: { user?: { email?: string | null } } | null
  creditsRemaining: number | null
  onCreditsUpdate: (c: number) => void
  onResult: (tracks: Array<{ id: string; title: string; audio_url: string; image_url?: string; duration?: number; style?: string }>, subtitle: string) => void
  onGeneratingChange?: (generating: boolean) => void
  loadExample?: boolean
  onLoadExampleDone?: () => void
}

export function AICoverPanel({ locale, session, creditsRemaining, onCreditsUpdate, onResult, onGeneratingChange, loadExample, onLoadExampleDone }: Props) {
  const [voiceModel, setVoiceModel] = useState("michael-jackson")
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [pickerCategory, setPickerCategory] = useState("ALL")
  const [playingDemo, setPlayingDemo] = useState<string | null>(null)
  const demoAudioRef = useRef<HTMLAudioElement | null>(null)
  const [useUrl, setUseUrl] = useState(false)
  const [songUrl, setSongUrl] = useState("")
  const [songFile, setSongFile] = useState<File | null>(null)
  const [audioObjectUrl, setAudioObjectUrl] = useState<string | null>(null)
  const [songTitle, setSongTitle] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create/revoke object URL when file changes
  useEffect(() => {
    if (songFile) {
      const url = URL.createObjectURL(songFile)
      setAudioObjectUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setAudioObjectUrl(null)
    }
  }, [songFile])

  // Load example demo song when triggered from parent
  useEffect(() => {
    if (!loadExample) return
    fetch("/demo-song.mp3")
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], "demo-song.mp3", { type: "audio/mpeg" })
        setSongFile(file)
        setSongTitle(locale === "zh" ? "示例歌曲" : "Demo Song")
        onLoadExampleDone?.()
      })
      .catch(() => { onLoadExampleDone?.() })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadExample])

  // Notify parent of generating state changes
  useEffect(() => {
    onGeneratingChange?.(generating)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating])

  const clearFile = () => {
    setSongFile(null)
    setSongTitle("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

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

      const selectedVoice = voicePresets.find(v => v.id === voiceModel)
      const voiceName = selectedVoice?.name ?? voiceModel
      const voiceAvatar = selectedVoice?.avatar ?? ""
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
      const tracksWithAvatar = (data.tracks ?? []).map((t: { id: string; title: string; audio_url: string; image_url?: string; duration?: number; style?: string }) => ({
        ...t,
        image_url: t.image_url || voiceAvatar,
      }))
      onResult(tracksWithAvatar, `${voiceName} cover`)
    } catch {
      setError(locale === "zh" ? "网络错误，请重试" : "Network error, please try again")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      {/* Voice Picker Modal */}
      {showVoicePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowVoicePicker(false)}>
          <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                {locale === "zh" ? "选择声音模型" : "Select Voice Model"}
              </h2>
              <button onClick={() => setShowVoicePicker(false)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 border-b border-border px-6 pt-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setPickerCategory(cat)}
                  className={`cursor-pointer rounded-t px-4 py-2 text-sm font-medium transition-colors ${
                    pickerCategory === cat
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {locale === "zh" ? { ALL: "全部", Music: "音乐", Celebrity: "名人", Anime: "动漫" }[cat] ?? cat : cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {voicePresets
                  .filter(v => pickerCategory === "ALL" || v.category === pickerCategory)
                  .map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setVoiceModel(v.id); setShowVoicePicker(false) }}
                      className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                        voiceModel === v.id ? "border-primary" : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <img src={v.avatar} alt={v.name} className="aspect-square w-full object-cover" />
                      {/* Demo play button overlay */}
                      {v.demo && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            if (playingDemo === v.id) {
                              demoAudioRef.current?.pause()
                              setPlayingDemo(null)
                            } else {
                              if (demoAudioRef.current) { demoAudioRef.current.pause() }
                              const audio = new Audio(v.demo)
                              demoAudioRef.current = audio
                              audio.play()
                              audio.onended = () => setPlayingDemo(null)
                              setPlayingDemo(v.id)
                            }
                          }}
                          className="absolute left-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                        >
                          {playingDemo === v.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </button>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                        <p className="truncate text-xs font-medium text-white">{v.name}</p>
                      </div>
                      {voiceModel === v.id && (
                        <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Voice Model */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {locale === "zh" ? "声音模型" : "Voice Model"}
            </label>
            <div className="flex items-center gap-1">
              {voicePresets.slice(0, 5).map(v => (
                <button
                  key={v.id}
                  onClick={() => setVoiceModel(v.id)}
                  title={v.name}
                  className={`h-8 w-8 cursor-pointer overflow-hidden rounded-full ring-2 transition-all ${
                    voiceModel === v.id ? "ring-primary" : "ring-transparent hover:ring-primary/50"
                  }`}
                >
                  <img src={v.avatar} alt={v.name} className="h-full w-full object-cover" />
                </button>
              ))}
              <button
                onClick={() => setShowVoicePicker(true)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Selected model display */}
          <button
            onClick={() => setShowVoicePicker(true)}
            className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left hover:border-primary/50"
          >
            <img
              src={voicePresets.find(v => v.id === voiceModel)?.avatar}
              alt={voicePresets.find(v => v.id === voiceModel)?.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="flex-1 text-sm text-foreground">{voicePresets.find(v => v.id === voiceModel)?.name}</span>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
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
          ) : audioObjectUrl ? (
            <div className="relative mt-2 overflow-hidden rounded-xl border border-border/50 bg-muted/20 p-3">
              <button
                onClick={clearFile}
                className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/70 transition-colors hover:bg-black/60 hover:text-white"
                title={locale === "zh" ? "移除" : "Remove"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <audio
                src={audioObjectUrl}
                controls
                className="w-full"
              />
              <p className="mt-2 truncate text-xs text-muted-foreground">{songFile?.name}</p>
            </div>
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
                  {locale === "zh" ? "上传歌曲" : "Upload Song"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">MP3, WAV · max 20MB</p>
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
