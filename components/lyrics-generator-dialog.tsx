"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"

const genres = ["Random", "Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Electronic", "Folk", "Classical"]
const emotions = ["Random", "Happy", "Sad", "Romantic", "Energetic", "Nostalgic", "Hopeful", "Angry", "Peaceful"]
const languages = [
  { value: "English", label: "English" },
  { value: "Chinese", label: "简体中文" },
  { value: "Spanish", label: "Español" },
  { value: "French", label: "Français" },
  { value: "German", label: "Deutsch" },
  { value: "Japanese", label: "日本語" },
  { value: "Korean", label: "한국어" },
  { value: "Portuguese", label: "Português" },
]
const structures = [
  "Verse Chorus",
  "Verse Chorus Verse Chorus Bridge Chorus",
  "Verse Chorus Bridge Chorus",
  "Verse Verse Chorus",
  "Verse Chorus Verse Chorus Outro",
  "Intro Verse Chorus Verse Chorus Bridge Outro",
  "Verse Verse Bridge Verse",
]

interface LyricsGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the generated lyrics text when user clicks "Use These Lyrics" */
  onApply: (lyrics: string) => void
}

export function LyricsGeneratorDialog({ open, onOpenChange, onApply }: LyricsGeneratorDialogProps) {
  const { locale } = useLanguage()
  const [theme, setTheme] = useState("")
  const [keywords, setKeywords] = useState("")
  const [genre, setGenre] = useState("Random")
  const [emotion, setEmotion] = useState("Random")
  const [language, setLanguage] = useState(locale === "zh" ? "Chinese" : "English")
  const [structure, setStructure] = useState("Verse Chorus")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLyrics, setGeneratedLyrics] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = {
    title: locale === "zh" ? "AI歌词生成器" : "AI Lyrics Generator",
    theme: locale === "zh" ? "主题" : "Theme",
    themePlaceholder: locale === "zh" ? "描述歌曲主题，如：分手后的释怀" : "Describe the song theme, e.g. moving on after a breakup",
    keywords: locale === "zh" ? "关键词" : "Keywords",
    keywordsPlaceholder: locale === "zh" ? "描述您想要的歌词关键词" : "Describe keywords for your lyrics",
    genre: locale === "zh" ? "流派" : "Genre",
    emotion: locale === "zh" ? "情感" : "Emotion",
    language: locale === "zh" ? "语言" : "Language",
    structure: locale === "zh" ? "结构" : "Structure",
    generate: locale === "zh" ? "生成" : "Generate",
    generating: locale === "zh" ? "生成中..." : "Generating...",
    useLyrics: locale === "zh" ? "使用这些歌词" : "Use These Lyrics",
    copy: locale === "zh" ? "复制" : "Copy",
    copied: locale === "zh" ? "已复制" : "Copied",
  }

  const buildPrompt = () => {
    const parts = [`A ${language} song about: ${theme}`]
    if (keywords) parts.push(`keywords: ${keywords}`)
    if (genre !== "Random") parts.push(`genre: ${genre}`)
    if (emotion !== "Random") parts.push(`mood: ${emotion}`)
    parts.push(`structure: ${structure}`)
    return parts.join(", ")
  }

  const handleGenerate = async () => {
    if (!theme.trim()) return
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Generation failed")
      } else {
        setGeneratedLyrics(data.lyrics ?? "")
      }
    } catch {
      setError(locale === "zh" ? "网络错误，请重试" : "Network error, please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLyrics)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApply = () => {
    onApply(generatedLyrics)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-foreground">{t.theme}</label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value.slice(0, 1000))}
              placeholder={t.themePlaceholder}
              className="mt-1.5 h-20 w-full resize-none rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">{theme.length}/1000</div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-sm font-medium text-foreground">{t.keywords}</label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value.slice(0, 300))}
              placeholder={t.keywordsPlaceholder}
              className="mt-1.5 h-14 w-full resize-none rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">{keywords.length}/300</div>
          </div>

          {/* Genre + Emotion */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">{t.genre}</label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.emotion}</label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language + Structure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground">{t.language}</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t.structure}</label>
              <Select value={structure} onValueChange={setStructure}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {structures.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !theme.trim()}
            className="w-full gap-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90"
            size="lg"
          >
            {isGenerating ? (
              <><Loader2 className="h-5 w-5 animate-spin" />{t.generating}</>
            ) : (
              <><Sparkles className="h-5 w-5" />{t.generate}</>
            )}
          </Button>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-500">{error}</p>
          )}

          {/* Generated Lyrics Output */}
          {generatedLyrics && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{generatedLyrics}</pre>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 flex-1" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? t.copied : t.copy}
                </Button>
                <Button size="sm" className="gap-1.5 flex-1" onClick={handleApply}>
                  <Sparkles className="h-4 w-4" />
                  {t.useLyrics}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
