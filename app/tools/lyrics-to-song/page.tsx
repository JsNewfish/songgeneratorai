"use client"

import { useState, useEffect, useRef } from "react"
import { useSession, signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Sparkles, Upload, Shuffle, Wand2, Loader2, Music, ChevronDown, ChevronUp, Play, Search, Heart, Info, Diamond, Share2, MoreHorizontal, Scissors, FileText, Download, Trash2, ChevronRight, RefreshCw, Copy, Disc } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ToolHeader } from "@/components/tool-header"
import { AudioPlayer } from "@/components/audio-player"
import { LyricsGeneratorDialog } from "@/components/lyrics-generator-dialog"
import { AICoverPanel } from "@/components/tool-panel-ai-cover"
import { VocalRemoverPanel } from "@/components/tool-panel-vocal-remover"
import { UpgradeDialog } from "@/components/upgrade-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"

const models = [
  { id: "v4", name: "SongGeneratorAI V4", desc: "Real vocals, precise control", descZh: "真实人声，精准控制", isNew: true },
  { id: "v3", name: "SongGeneratorAI V3", desc: "Top quality, full control", descZh: "顶级音质，完全掌控" },
  { id: "v2.1", name: "SongGeneratorAI V2.1", desc: "Rich sound, advanced methods", descZh: "更丰富音效，先进方法" },
  { id: "v2", name: "SongGeneratorAI V2", desc: "High quality, smart prompts", descZh: "高品质，智能提示" },
  { id: "v1", name: "SongGeneratorAI V1", desc: "Stable quality, basic features", descZh: "稳定品质，基础功能" },
]

const styleTags = {
  en: {
    genre: ["Pop", "Rock", "Electronic", "Hip Hop", "R&B", "Jazz", "Classical", "Folk", "Country", "Metal", "Punk", "Blues", "Soul", "Reggae", "K-pop", "Indie", "Alternative", "Funk", "Gospel", "Ambient", "Trap", "Drill", "Dancehall", "Bossa Nova", "Flamenco", "Celtic", "Cinematic", "Lo-fi", "House", "Techno", "Dubstep", "Drum and Bass", "Latin", "Bluegrass", "New Age", "Afrobeat"],
    vibes: ["Happy", "Sad", "Romantic", "Energetic", "Calm", "Epic", "Dark", "Melancholic", "Nostalgic", "Angry", "Mysterious", "Playful", "Chill", "Groovy", "Powerful", "Dreamy", "Intense", "Hopeful", "Bittersweet", "Triumphant", "Soulful", "Anxious", "Peaceful", "Uplifting", "Haunting"],
    tempo: ["Slow", "Ballad", "Mid-tempo", "Medium", "Uptempo", "Fast", "Variable"],
    instruments: ["Piano", "Guitar", "Synth", "Drums", "Bass", "Strings", "Violin", "Cello", "Trumpet", "Saxophone", "Flute", "Banjo", "Ukulele", "Harp", "Choir", "808", "Brass", "Organ", "Harmonica", "Electric Guitar", "Acoustic Guitar", "Pad", "Choir"],
  },
  zh: {
    genre: ["流行", "摇滚", "电子", "嘻哈", "R&B", "爵士", "古典", "民谣", "乡村", "金属", "朋克", "蓝调", "灵魂乐", "雷鬼", "韩流", "独立", "另类", "放克", "福音", "氛围", "陷阱", "钻孔", "舞厅", "波萨诺瓦", "弗拉门戈", "凯尔特", "影视配乐", "Lo-fi", "浩室", "科技舞曲", "电子鼓打节拍", "鼓打贝斯", "拉丁", "蓝草", "新世纪", "非洲节拍"],
    vibes: ["欢快", "忧郁", "浪漫", "激昂", "平静", "史诗", "黑暗", "伤感", "怀旧", "愤怒", "神秘", "俏皮", "慵懒", "律动", "震撼", "梦幻", "紧张", "充满希望", "苦乐参半", "凯旋", "深情", "焦虑", "宁静", "振奋", "幽灵"],
    tempo: ["慢速", "抒情ballad", "中慢速", "中速", "中快速", "快速", "变速"],
    instruments: ["钢琴", "吉他", "合成器", "鼓", "贝斯", "弦乐", "小提琴", "大提琴", "小号", "萨克斯", "长笛", "班卓琴", "尤克里里", "竖琴", "合唱团", "808鼓机", "铜管", "风琴", "口琴", "电吉他", "木吉他", "合成垫音", "人声和声"],
  }
}

type SongItem = {
  id: string
  title: string
  cover: string
  audio_url: string
  duration: string
  subtitle: string
  tool?: string
}

const demoSongs: SongItem[] = []

function localizeStyle(style: string, locale: string): string {
  if (locale !== 'zh') return style
  return style
    .replace(/\bfemale voice\b/gi, '女声')
    .replace(/\bmale voice\b/gi, '男声')
}

const albums = ["ALL", "Pop", "Rock", "Electronic", "Hip Hop", "Jazz"]

export default function LyricsToSongPage({ initialTool = "lyrics-to-song" }: { initialTool?: string } = {}) {
  const { t, locale } = useLanguage()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"lyrics" | "text">("lyrics")
  const [lyrics, setLyrics] = useState("")
  const [title, setTitle] = useState("")
  const [styles, setStyles] = useState("")
  const [excludeStyles, setExcludeStyles] = useState("")
  const [isInstrumental, setIsInstrumental] = useState(false)
  const [model, setModel] = useState("v4")
  const [aiSinger, setAiSinger] = useState(false)
  const [vibeSeed, setVibeSeed] = useState(false)
  const [userPlan, setUserPlan] = useState<string>('free')
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<{ name: string; nameZh: string }>({ name: 'AI Singer', nameZh: 'AI歌手' })
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [concurrentLimitOpen, setConcurrentLimitOpen] = useState(false)
  const [editSongDialogOpen, setEditSongDialogOpen] = useState(false)
  const [editTargetSong, setEditTargetSong] = useState<SongItem | null>(null)
  const [editSongTitle, setEditSongTitle] = useState('')
  const [voice, setVoice] = useState<"male" | "female" | "random">("random")
  const [weirdness, setWeirdness] = useState([50])
  const [styleInfluence, setStyleInfluence] = useState([50])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [generatingCount, setGeneratingCount] = useState(0)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [showLyricsDialog, setShowLyricsDialog] = useState(false)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)

  const updateCredits = (n: number) => {
    setCreditsRemaining(n)
    window.dispatchEvent(new CustomEvent("credits-updated", { detail: { credits: n } }))
  }
  const [uploadedAudioId, setUploadedAudioId] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const uploadRef = useRef<HTMLInputElement>(null)
  const [activeTool, setActiveTool] = useState<string>(initialTool)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState("ALL")
  const [showFavorites, setShowFavorites] = useState(false)
  const [currentSong, setCurrentSong] = useState<SongItem | null>(null)
  const [userSongs, setUserSongs] = useState<SongItem[]>(demoSongs)
  const [loadingSlots, setLoadingSlots] = useState(0)
  const [coverLoadingSlots, setCoverLoadingSlots] = useState(0)
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)
  const [loadExampleSong, setLoadExampleSong] = useState(false)

  const activeSongs = userSongs.filter(s => (s.tool ?? 'lyrics-to-song') === activeTool)
  const activeLoadingSlots = activeTool === 'ai-cover' ? coverLoadingSlots : activeTool === 'vocal-remover' ? 0 : loadingSlots

  // Load user's songs from DB on mount
  useEffect(() => {
    fetch('/api/songs')
      .then(r => r.json())
      .then(data => {
        if (data.songs?.length) {
          const dbSongs: SongItem[] = data.songs.map((s: { id: string; title: string; image_url?: string; audio_url: string; duration?: number; style?: string }) => ({
            id: s.id,
            title: s.title || 'Untitled Track',
            cover: s.image_url || '',
            audio_url: s.audio_url,
            duration: s.duration ? `${Math.floor(s.duration / 60)}:${String(s.duration % 60).padStart(2, '0')}` : '3:00',
            subtitle: s.style || 'AI Generated',
          }))
          setUserSongs(dbSongs)
        }
      })
      .catch(() => null)
      .finally(() => setIsLoadingSongs(false))
  }, [])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTagCategory, setActiveTagCategory] = useState<'genre' | 'vibes' | 'tempo' | 'instruments' | null>(null)
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([])

  // Load credits on session load
  useEffect(() => {
    if (!session?.user?.email) return
    fetch('/api/credits')
      .then(r => r.json())
      .then(data => {
        if (data.credits !== undefined) updateCredits(data.credits)
        if (data.plan) setUserPlan(data.plan)
      })
      .catch(() => null)
  }, [session])

  const handlePremiumToggle = (feature: { name: string; nameZh: string }, currentValue: boolean, setter: (v: boolean) => void) => {
    if (userPlan === 'free') {
      setUpgradeFeature(feature)
      setUpgradeDialogOpen(true)
    } else {
      setter(!currentValue)
    }
  }

  // Auto-generate if coming from homepage with autostart param
  useEffect(() => {
    if (searchParams.get('autostart') !== '1') return
    const raw = sessionStorage.getItem('sg_autostart')
    if (!raw) return
    try {
      const params = JSON.parse(raw) as {
        prompt: string; style: string; instrumental: boolean; excludeStyle: string
      }
      sessionStorage.removeItem('sg_autostart')
      if (params.prompt) {
        if (session) {
          handleGenerateWithParams(params)
        } else {
          signIn('google')
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const tags = locale === 'zh' ? styleTags.zh : styleTags.en
  const currentModel = models.find(m => m.id === model) || models[0]

  const generateRandomLyrics = () => {
    const sampleLyrics = locale === 'zh' 
      ? `[Verse 1]
走在这空旷的街道
脚下是回忆的足迹
每个角落都有故事
关于我们爱的痕迹

[Chorus]
但你已经离开
我独自站在这里
寻找那一道光
指引我穿过黑夜`
      : `[Verse 1]
Walking down this empty street
Memories beneath my feet
Every corner holds a story
Of our love in all its glory

[Chorus]
But now you're gone
And I'm standing here alone
Searching for the light
To guide me through the night`
    setLyrics(sampleLyrics)
  }

  const handleGenerateWithParams = async (params: {
    prompt: string
    style: string
    instrumental: boolean
    excludeStyle: string
    model?: string
  }) => {
    setGeneratingCount(c => c + 1)
    setLoadingSlots(prev => prev + 2)
    setGenerateError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: params.prompt,
          style: params.style || undefined,
          instrumental: params.instrumental,
          exclude_style: params.excludeStyle || undefined,
          model: params.model || 'v4',
          audio_id: uploadedAudioId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGenerateError(data.error ?? 'Generation failed')
      } else {
        const tracks = data.tracks ?? []
        if (data.credits_remaining !== undefined) updateCredits(data.credits_remaining)
        if (tracks.length > 0) {
          const newSongs: SongItem[] = tracks.map((t: { id: string; title: string; audio_url: string; image_url?: string; duration?: number }) => ({
            id: t.id,
            title: t.title,
            cover: t.image_url || '',
            audio_url: t.audio_url,
            duration: t.duration ? `${Math.floor(t.duration / 60)}:${String(Math.floor(t.duration % 60)).padStart(2, '0')}` : '3:00',
            subtitle: params.style || 'AI Generated',
            tool: 'lyrics-to-song',
          }))
          setUserSongs(prev => [...newSongs, ...prev])
        }
      }
    } catch {
      setGenerateError('Network error, please try again.')
    } finally {
      setGeneratingCount(c => Math.max(0, c - 1))
      setLoadingSlots(prev => Math.max(0, prev - 2))
    }
  }

  const handleGenerate = async () => {
    if (!session) {
      signIn('google')
      return
    }
    const prompt = mode === 'lyrics' ? lyrics.trim() : title.trim()
    if (!prompt) return

    // Check concurrent limit for free users
    if (userPlan === 'free' && generatingCount >= 1) {
      setConcurrentLimitOpen(true)
      return
    }

    const style = selectedTags.join(', ') || styles || ''
    handleGenerateWithParams({
      prompt,
      style,
      instrumental: isInstrumental,
      excludeStyle: excludeStyles.trim(),
      model,
    })
  }

  // Append tracks returned from /api/process into the song list
  const handleProcessResult = (tracks: Array<{ id: string; title: string; audio_url: string; image_url?: string; duration?: number; style?: string }>, subtitleFallback: string) => {
    const newSongs: SongItem[] = tracks.map(t => ({
      id: t.id,
      title: t.title,
      cover: t.image_url || '',
      audio_url: t.audio_url,
      duration: t.duration ? `${Math.floor(t.duration / 60)}:${String(Math.floor(t.duration % 60)).padStart(2, '0')}` : '3:00',
      subtitle: t.style || subtitleFallback,
      tool: 'lyrics-to-song',
    }))
    setUserSongs(prev => [...newSongs, ...prev])
  }

  const handleExtend = async (song: SongItem) => {
    if (!session) { signIn('google'); return }
    setGeneratingCount(c => c + 1)
    setLoadingSlots(prev => prev + 2)
    try {
      const res = await fetch('/api/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'extend', audio_id: song.id }) })
      const data = await res.json()
      if (!res.ok) setGenerateError(data.error ?? 'Extend failed')
      else { if (data.credits_remaining !== undefined) updateCredits(data.credits_remaining); handleProcessResult(data.tracks ?? [], song.subtitle) }
    } catch { setGenerateError('Network error.') }
    finally { setGeneratingCount(c => Math.max(0, c - 1)); setLoadingSlots(prev => Math.max(0, prev - 2)) }
  }

  const handleCover = async (song: SongItem) => {
    if (!session) { signIn('google'); return }
    setGeneratingCount(c => c + 1)
    setLoadingSlots(prev => prev + 2)
    try {
      const res = await fetch('/api/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'cover', audio_id: song.id }) })
      const data = await res.json()
      if (!res.ok) setGenerateError(data.error ?? 'Cover failed')
      else { if (data.credits_remaining !== undefined) updateCredits(data.credits_remaining); handleProcessResult(data.tracks ?? [], song.subtitle) }
    } catch { setGenerateError('Network error.') }
    finally { setGeneratingCount(c => Math.max(0, c - 1)); setLoadingSlots(prev => Math.max(0, prev - 2)) }
  }

  const handleStems = async (song: SongItem) => {
    if (!session) { signIn('google'); return }
    setGeneratingCount(c => c + 1)
    setLoadingSlots(prev => prev + 2)
    try {
      const res = await fetch('/api/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'stems', audio_id: song.id }) })
      const data = await res.json()
      if (!res.ok) setGenerateError(data.error ?? 'Stems failed')
      else { if (data.credits_remaining !== undefined) updateCredits(data.credits_remaining); handleProcessResult(data.tracks ?? [], song.subtitle) }
    } catch { setGenerateError('Network error.') }
    finally { setGeneratingCount(c => Math.max(0, c - 1)); setLoadingSlots(prev => Math.max(0, prev - 2)) }
  }

  const handleDelete = async (song: SongItem) => {
    setUserSongs(prev => prev.filter(s => s.id !== song.id))
    await fetch('/api/songs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: song.id }) }).catch(() => null)
  }

  const handleEditSong = (song: SongItem) => {
    setEditTargetSong(song)
    setEditSongTitle(song.title)
    setEditSongDialogOpen(true)
  }

  const handleEditSongSubmit = async () => {
    if (!editTargetSong) return
    setUserSongs(prev => prev.map(s => s.id === editTargetSong.id ? { ...s, title: editSongTitle } : s))
    setEditSongDialogOpen(false)
    await fetch('/api/songs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editTargetSong.id, title: editSongTitle }) }).catch(() => null)
  }

  const handleGenerateSimilar = (song: SongItem) => {
    handleGenerateWithParams({ prompt: song.title, style: song.subtitle, instrumental: false, excludeStyle: '' })
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleUploadSong = async (file: File) => {
    if (!session) { signIn('google'); return }
    setIsUploading(true)
    setGenerateError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-audio', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setGenerateError(data.error ?? 'Upload failed')
      } else {
        setUploadedAudioId(data.audio_id)
        setUploadedFileName(file.name)
      }
    } catch {
      setGenerateError('Upload failed, please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ToolHeader currentTool={activeTool} />
      
      <main className="flex flex-1">
        {/* Left Panel - Generator Form */}
        <div className="flex w-full flex-col border-r border-border/50 lg:w-[520px] xl:w-[560px]" style={{height: 'calc(100vh - 56px)'}}>
          {activeTool === 'ai-cover' ? (
            <AICoverPanel
              locale={locale}
              session={session}
              creditsRemaining={creditsRemaining}
              onCreditsUpdate={updateCredits}
              loadExample={loadExampleSong}
              onLoadExampleDone={() => setLoadExampleSong(false)}
              onGeneratingChange={(gen) => setCoverLoadingSlots(gen ? 1 : 0)}
              onResult={(tracks, subtitle) => {
                const newSongs: SongItem[] = tracks.map(t => ({
                  id: t.id,
                  title: t.title,
                  cover: t.image_url || '',
                  audio_url: t.audio_url,
                  duration: t.duration ? `${Math.floor(t.duration / 60)}:${String(Math.floor(t.duration % 60)).padStart(2, '0')}` : '3:00',
                  subtitle: t.style || subtitle,
                  tool: 'ai-cover',
                }))
                setUserSongs(prev => [...newSongs, ...prev])
              }}
            />
          ) : activeTool === 'vocal-remover' ? (
            <VocalRemoverPanel
              locale={locale}
              session={session}
              creditsRemaining={creditsRemaining}
              onCreditsUpdate={updateCredits}
              onResult={(tracks, subtitle) => {
                const newSongs: SongItem[] = tracks.map(t => ({
                  id: t.id,
                  title: t.title,
                  cover: t.image_url || '',
                  audio_url: t.audio_url,
                  duration: t.duration ? `${Math.floor(t.duration / 60)}:${String(Math.floor(t.duration % 60)).padStart(2, '0')}` : '3:00',
                  subtitle: t.style || subtitle,
                  tool: 'vocal-remover',
                }))
                setUserSongs(prev => [...newSongs, ...prev])
              }}
            />
          ) : (<>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {/* Mode Tabs */}
            <div className="flex items-center gap-4 border-b border-border/50 pb-4">
              <button
                onClick={() => setMode("lyrics")}
                className={`text-sm font-medium transition-colors ${
                  mode === "lyrics" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {locale === 'zh' ? '歌词转歌曲' : 'Lyrics to Song'}
              </button>
              <button
                onClick={() => setMode("text")}
                className={`text-sm font-medium transition-colors ${
                  mode === "text" 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {locale === 'zh' ? '文本转歌曲' : 'Text to Song'}
              </button>
              <div className="ml-auto flex items-center gap-2">
                {uploadedFileName && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">
                    <Music className="h-3.5 w-3.5" />
                    <span className="max-w-[100px] truncate">{uploadedFileName}</span>
                    <button onClick={() => { setUploadedAudioId(null); setUploadedFileName(null) }} className="ml-0.5 text-primary/70 hover:text-primary">
                      ×
                    </button>
                  </div>
                )}
                <input
                  ref={uploadRef}
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/wave"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUploadSong(f); e.target.value = '' }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isUploading}
                  onClick={() => setUploadDialogOpen(true)}
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? (locale === 'zh' ? '上传中...' : 'Uploading...') : (locale === 'zh' ? '上传歌曲' : 'Upload Song')}
                </Button>
              </div>
            </div>

            {/* Model Selection */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {locale === 'zh' ? '模型' : 'Model'}
                </label>
                {currentModel.isNew && (
                  <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                    NEW · V4
                  </span>
                )}
              </div>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="mt-2">
                  <SelectValue>{currentModel.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {models.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div className="flex items-center gap-2">
                        <span>{m.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({locale === 'zh' ? m.descZh : m.desc})
                        </span>
                        {m.isNew && (
                          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">NEW</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AI Singer Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">
                  {locale === 'zh' ? 'AI歌手' : 'AI Singer'}
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    {locale === 'zh' ? '使用AI歌手演唱，需要基础版或更高套餐。' : 'Use an AI singer voice. Requires Basic plan or above.'}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex cursor-pointer items-center gap-2">
                <Diamond className={`h-4 w-4 ${userPlan === 'free' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Switch
                  checked={aiSinger}
                  className="cursor-pointer"
                  onCheckedChange={() => handlePremiumToggle(
                    { name: 'AI Singer', nameZh: 'AI歌手' },
                    aiSinger,
                    setAiSinger,
                  )}
                />
              </div>
            </div>

            {/* VibeSeed Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">VibeSeed</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    {locale === 'zh' ? '根据种子音频生成风格一致的音乐，需要基础版或更高套餐。' : 'Generate music consistent with a seed audio. Requires Basic plan or above.'}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex cursor-pointer items-center gap-2">
                <Diamond className={`h-4 w-4 ${userPlan === 'free' ? 'text-primary' : 'text-muted-foreground'}`} />
                <Switch
                  checked={vibeSeed}
                  className="cursor-pointer"
                  onCheckedChange={() => handlePremiumToggle(
                    { name: 'VibeSeed', nameZh: 'VibeSeed' },
                    vibeSeed,
                    setVibeSeed,
                  )}
                />
              </div>
            </div>

            {/* Instrumental Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                {locale === 'zh' ? '纯音乐' : 'Instrumental'}
              </label>
              <Switch checked={isInstrumental} onCheckedChange={setIsInstrumental} />
            </div>

            {/* Lyrics Input */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {locale === 'zh' ? '歌词' : 'Lyrics'}
                </label>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder={locale === 'zh' ? '在此输入您的歌词' : 'Enter your lyrics here'}
                className="mt-2 h-48 w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                maxLength={5000}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">{lyrics.length}/5000</div>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={generateRandomLyrics}>
                  <Shuffle className="h-4 w-4" />
                  {locale === 'zh' ? '随机歌词' : 'Random Lyrics'}
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowLyricsDialog(true)}>
                  <Sparkles className="h-4 w-4" />
                  {locale === 'zh' ? 'AI歌词生成器' : 'AI Lyrics Generator'}
                </Button>
              </div>
            </div>

            {/* Style Input */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {locale === 'zh' ? '风格' : 'Style'}
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-primary transition-colors">
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    {locale === 'zh' ? '让风格描述更具创意性，如：dark pop, dreamy female vocals, 808 bass' : 'Makes your style more creative, e.g. dark pop, dreamy female vocals, 808 bass'}
                  </TooltipContent>
                </Tooltip>
              </div>
              <textarea
                value={styles}
                onChange={(e) => setStyles(e.target.value)}
                placeholder={locale === 'zh' ? '输入音乐风格' : 'Enter music style'}
                className="mt-2 h-20 w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                maxLength={1000}
              />
              <div className="mt-1 text-right text-xs text-muted-foreground">{styles.length}/1000</div>

              {/* Style Tags */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {(['genre', 'vibes', 'tempo', 'instruments'] as const).map(cat => {
                    const labels: Record<string, string> = locale === 'zh'
                      ? { genre: '流派', vibes: '氛围', tempo: '节奏', instruments: '乐器' }
                      : { genre: 'Genre', vibes: 'Mood', tempo: 'Tempo', instruments: 'Instruments' }
                    const isActive = activeTagCategory === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveTagCategory(isActive ? null : cat)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        # {labels[cat]}
                      </button>
                    )
                  })}
                </div>
                {activeTagCategory && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags[activeTagCategory].map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          selectedTags.includes(tag)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Voice Selection */}
            {!isInstrumental && (
              <div className="mt-6">
                <label className="text-sm font-medium text-foreground">
                  {locale === 'zh' ? '声音' : 'Voice'}
                </label>
                <div className="mt-2 flex gap-3">
                  {[
                    { value: "male", label: locale === 'zh' ? '男声' : 'Male' },
                    { value: "female", label: locale === 'zh' ? '女声' : 'Female' },
                    { value: "random", label: locale === 'zh' ? '随机' : 'Random' },
                  ].map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="voice"
                        checked={voice === option.value}
                        onChange={() => setVoice(option.value as "male" | "female" | "random")}
                        className="h-4 w-4 border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="mt-6">
              <label className="text-sm font-medium text-foreground">
                {locale === 'zh' ? '标题' : 'Title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={locale === 'zh' ? '输入您的歌曲标题' : 'Enter your song title'}
                className="mt-2 w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Exclude Styles */}
            <div className="mt-6">
              <label className="text-sm font-medium text-foreground">
                {locale === 'zh' ? '排除风格' : 'Exclude Styles'}
              </label>
              <input
                type="text"
                value={excludeStyles}
                onChange={(e) => setExcludeStyles(e.target.value)}
                placeholder={locale === 'zh' ? '输入您想要排除的风格' : 'Enter styles to exclude'}
                className="mt-2 w-full rounded-lg border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground"
            >
              {locale === 'zh' ? '高级选项' : 'Advanced Options'}
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="mt-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {locale === 'zh' ? '奇异度' : 'Weirdness'}
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        {locale === 'zh' ? '将滑块调高，可以让 AI 歌曲生成器创作出更加创意、疯狂且充满惊喜的歌曲效果。' : 'Increase to make the AI generate more creative, wild, and surprising song effects.'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Slider
                    value={weirdness}
                    onValueChange={setWeirdness}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      {locale === 'zh' ? '风格影响力' : 'Style Influence'}
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        {locale === 'zh' ? '将滑块调高，可以让生成的歌曲更贴合你填写的风格描述、曲风类型和音乐氛围。' : 'Increase to make the generated song better match your style description, genre, and musical mood.'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Slider
                    value={styleInfluence}
                    onValueChange={setStyleInfluence}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Upgrade Prompt */}
            <div className="mt-6 rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {locale === 'zh' ? '升级您的账户' : 'Upgrade Your Account'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {locale === 'zh' 
                      ? '购买更高级计划，创作更多作品，获得更好的质量，访问更多功能！'
                      : 'Get premium plan for more creations, better quality, and more features!'}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/pricing">Upgrade</a>
                </Button>
              </div>
            </div>

            {/* Credits & Generate — sticky footer */}
            </div>
            <div className="border-t border-border/50 bg-background px-4 pb-4 pt-3 lg:px-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Music className="h-4 w-4" />
                <span>{creditsRemaining !== null ? creditsRemaining : '...'} {locale === 'zh' ? '积分剩余' : 'credits remaining'}</span>
              </div>
              <Button 
                onClick={handleGenerate}
                disabled={mode === 'lyrics' ? lyrics.length === 0 : title.length === 0}
                className="mt-3 w-full gap-2 bg-gradient-to-r from-[#b5838d] via-[#9b8fa8] to-[#7a9e9f] hover:opacity-90 text-white"
                size="lg"
              >
                <Wand2 className="h-5 w-5" />
                {session ? (locale === 'zh' ? '生成' : 'Generate') : (locale === 'zh' ? '登录后生成' : 'Sign in to Generate')}
              </Button>
              {generatingCount > 0 && (
                <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {locale === 'zh' ? `${generatingCount} 个任务生成中，约需1-2分钟...` : `${generatingCount} task(s) generating, ~1-2 min...`}
                </p>
              )}
              {generateError && (
                <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-500">{generateError}</p>
              )}
              <p className="mt-2 text-center text-xs text-orange-500">
                {locale === 'zh' 
                  ? '歌词、标题和风格不得包含著名人物的姓名或敏感词语。'
                  : 'Lyrics, titles, and styles must not contain names of famous people or sensitive words.'}
              </p>
            </div>
          </>
          )}
        </div>

        {/* Right Panel - Song Display */}
        <div className="hidden flex-1 flex-col lg:flex">
          <div className="flex h-[calc(100vh-56px)] flex-col overflow-y-auto p-6">
            {/* Tool-specific intro panel when no songs yet for non-lyrics tools */}
            {activeTool !== 'lyrics-to-song' && activeSongs.length === 0 && activeLoadingSlots === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground">
                    <Sparkles className="h-7 w-7 text-primary" />
                    <span>{activeTool === 'ai-cover' ? (locale === 'zh' ? 'AI歌曲翻唱' : 'AI Song Cover') : (locale === 'zh' ? '人声消除器' : 'Vocal Remover')}</span>
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
                    {activeTool === 'ai-cover'
                      ? (locale === 'zh' ? '用任何声音免费创建AI歌曲翻唱。上传您的歌曲，让我们的AI为您创建AI歌曲翻唱。' : 'Create AI song covers with any voice for free. Upload your song and let our AI create an AI song cover for you.')
                      : (locale === 'zh' ? '使用我们的免费AI人声消除工具从歌曲中移除人声。上传您的歌曲，让我们的AI为您移除人声。' : 'Use our free AI vocal remover tool to remove vocals from songs. Upload your song and let our AI remove vocals for you.')}
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-6 border-primary bg-primary text-primary-foreground hover:opacity-90"
                    onClick={() => { if (activeTool === 'ai-cover') setLoadExampleSong(true) }}
                  >
                    {activeTool === 'ai-cover'
                      ? (locale === 'zh' ? '使用示例歌曲' : 'Use Example Song')
                      : (locale === 'zh' ? '使用示例提示' : 'Use Example Track')}
                  </Button>
                </div>
              </div>
            ) : (<>
            {/* Search & Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'zh' ? '搜索' : 'Search'}
                  className="w-full rounded-lg border border-border bg-muted/30 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{locale === 'zh' ? '专辑' : 'Album'}</span>
                <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map(album => (
                      <SelectItem key={album} value={album}>{album}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{locale === 'zh' ? '已收藏' : 'Favorites'}</span>
                <Switch checked={showFavorites} onCheckedChange={setShowFavorites} />
              </div>
            </div>

            {/* Songs Grid or Empty State */}
            {isLoadingSongs ? (
              <div className="mt-6 grid grid-cols-3 gap-3 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`init-${i}`} className="overflow-hidden rounded-xl border border-border/50 bg-card">
                    <div className="relative aspect-[4/3] animate-pulse bg-muted/60" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (activeSongs.length > 0 || activeLoadingSlots > 0) ? (
              <div className="mt-6 grid grid-cols-3 gap-3 xl:grid-cols-4">
                {/* Loading skeleton cards */}
                {activeLoadingSlots > 0 && Array.from({ length: activeLoadingSlots }).map((_, i) => (
                  <div key={`loading-${i}`} className="overflow-hidden rounded-xl border border-border/50 bg-card">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-700/60 to-neutral-800/60 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
                        <span className="text-xs text-white/50">{locale === 'zh' ? '生成中...' : 'Generating...'}</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
                {activeSongs
                  .filter(s => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(s => !showFavorites || favoriteSongs.includes(s.id))
                  .map((song) => (
                  <div
                    key={song.id}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-700 to-neutral-800">
                      {song.cover ? (
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white/50">
                            <Music className="h-8 w-8" />
                            <Music className="h-6 w-6" />
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay with Play Button */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setCurrentSong(song)}
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg hover:scale-105 transition-transform">
                          <Play className="h-6 w-6 fill-current text-gray-900 ml-1" />
                        </div>
                      </div>
                      
                      {/* Action Buttons - Top */}
                      <div className="absolute left-2 right-2 top-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex items-center gap-1">
                          {/* Like Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setFavoriteSongs(prev => 
                                prev.includes(song.id) 
                                  ? prev.filter(id => id !== song.id)
                                  : [...prev, song.id]
                              )
                            }}
                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70 ${
                              favoriteSongs.includes(song.id) ? 'text-red-500' : 'text-white'
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${favoriteSongs.includes(song.id) ? 'fill-current' : ''}`} />
                          </button>
                          
                          {/* Share Button */}
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* More Options Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem className="gap-2" onClick={() => handleExtend(song)}>
                              <RefreshCw className="h-4 w-4" />
                              {locale === 'zh' ? '延长歌曲' : 'Extend Song'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleCover(song)}>
                              <Disc className="h-4 w-4" />
                              {locale === 'zh' ? '翻唱歌曲' : 'Cover Song'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleGenerateSimilar(song)}>
                              <Copy className="h-4 w-4" />
                              {locale === 'zh' ? '生成类似' : 'Generate Similar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleStems(song)}>
                              <Scissors className="h-4 w-4" />
                              {locale === 'zh' ? '分离音轨' : 'Get Stems'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => handleEditSong(song)}>
                              <FileText className="h-4 w-4" />
                              {locale === 'zh' ? '编辑歌曲详情' : 'Edit Song Detail'}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="gap-2" asChild>
                              <a href={song.audio_url} download={`${song.title}.mp3`}>
                                <Download className="h-4 w-4" />
                                {locale === 'zh' ? '下载 MP3' : 'Download MP3'}
                              </a>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => handleDelete(song)}>
                              <Trash2 className="h-4 w-4" />
                              {locale === 'zh' ? '删除' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-xs text-white/70">{localizeStyle(song.subtitle, locale)}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="truncate font-medium text-foreground">{song.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-4xl text-primary">
                    <Sparkles className="h-8 w-8" />
                    <span className="font-bold">{locale === 'zh' ? '歌词转歌曲' : 'Lyrics to Song'}</span>
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <p className="mt-4 max-w-md text-muted-foreground">
                    {locale === 'zh'
                      ? '使用我们的免费AI歌词转歌曲生成器，在几秒钟内从歌词生成歌曲。输入您的歌词，让我们的AI为您生成一首歌。'
                      : 'Use our free AI lyrics to song generator to create songs from lyrics in seconds. Enter your lyrics and let our AI create a song for you.'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="mt-6 border-primary text-primary hover:bg-primary/10"
                    onClick={generateRandomLyrics}
                  >
                    {locale === 'zh' ? '使用示例歌词' : 'Use Example Lyrics'}
                  </Button>
                </div>
              </div>
            )}
          </>
          )}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Audio Player */}
      <AudioPlayer song={currentSong} />

      {/* AI Lyrics Generator Dialog */}
      <LyricsGeneratorDialog
        open={showLyricsDialog}
        onOpenChange={setShowLyricsDialog}
        onApply={(text) => setLyrics(text)}
      />

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        featureName={upgradeFeature.name}
        featureNameZh={upgradeFeature.nameZh}
        locale={locale}
      />

      {/* Upload Song Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '上传歌曲' : 'Upload Song'}</DialogTitle>
            <DialogDescription>
              {locale === 'zh'
                ? '免费用户最多剪辑 1 分钟音频。'
                : 'Free users can trim up to 1 minute of audio.'}
              {' '}
              <a href="/pricing" className="text-primary underline hover:no-underline">
                {locale === 'zh' ? '升级解锁更长时长。' : 'Upgrade to unlock longer uploads.'}
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <input
              ref={uploadRef}
              type="file"
              accept="audio/mp3,audio/mpeg,audio/wav,audio/wave"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) { handleUploadSong(f); setUploadDialogOpen(false) }
                e.target.value = ''
              }}
            />
            <Button
              onClick={() => uploadRef.current?.click()}
              disabled={isUploading}
              className="gap-2 w-full"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading
                ? (locale === 'zh' ? '上传中...' : 'Uploading...')
                : (locale === 'zh' ? '选择文件' : 'Choose File')}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              {locale === 'zh' ? '取消' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Concurrent Generation Limit Dialog */}
      <Dialog open={concurrentLimitOpen} onOpenChange={setConcurrentLimitOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '并发生成已达上限' : 'Concurrent Generation Limit Reached'}</DialogTitle>
            <DialogDescription>
              {locale === 'zh'
                ? '请升级到更高套餐以同时生成更多歌曲。'
                : 'Please upgrade to a higher plan to generate more songs concurrently.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConcurrentLimitOpen(false)}>
              {locale === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button asChild>
              <a href="/pricing">{locale === 'zh' ? '升级套餐' : 'Upgrade'}</a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Song Detail Dialog */}
      <Dialog open={editSongDialogOpen} onOpenChange={setEditSongDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{locale === 'zh' ? '编辑歌曲详情' : 'Edit Song Detail'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">{locale === 'zh' ? '歌曲标题' : 'Song Title'}</label>
              <input
                type="text"
                value={editSongTitle}
                onChange={e => setEditSongTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditSongDialogOpen(false)}>
              {locale === 'zh' ? '取消' : 'Cancel'}
            </Button>
            <Button onClick={handleEditSongSubmit} disabled={!editSongTitle.trim()}>
              {locale === 'zh' ? '保存' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
