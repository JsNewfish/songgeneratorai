"use client"

import { useState } from "react"
import { Sparkles, Upload, Shuffle, Wand2, Loader2, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LyricsGeneratorDialog } from "@/components/lyrics-generator-dialog"

export function MusicGenerator() {
  const { t, locale } = useLanguage()
  const { data: session } = useSession()
  const router = useRouter()
  const [mode, setMode] = useState<"lyrics" | "text">("lyrics")
  const [lyrics, setLyrics] = useState("")
  const [title, setTitle] = useState("")
  const [isInstrumental, setIsInstrumental] = useState(false)
  const [excludeStyles, setExcludeStyles] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  const [selectedTempos, setSelectedTempos] = useState<string[]>([])
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [voice, setVoice] = useState<"male" | "female" | "random">("random")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showLyricsDialog, setShowLyricsDialog] = useState(false)

  const handleGenerate = async () => {
    if (!session) {
      signIn('google')
      return
    }
    const prompt = mode === 'lyrics' ? lyrics.trim() : title.trim()
    if (!prompt) return

    setIsGenerating(true)

    const allStyles = [
      ...selectedGenres,
      ...selectedVibes,
      ...selectedTempos,
      ...selectedInstruments,
      ...(!isInstrumental && voice !== 'random' ? [`${voice} voice`] : []),
    ].join(', ')

    // Store generation params in sessionStorage, tool page will pick them up
    try {
      sessionStorage.setItem('sg_autostart', JSON.stringify({
        prompt,
        style: allStyles || '',
        instrumental: isInstrumental,
        excludeStyle: excludeStyles.trim(),
      }))
    } catch {}

    router.push('/tools/lyrics-to-song?autostart=1')
  }

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item))
    } else {
      setSelected([...selected, item])
    }
  }

  const generateRandomLyrics = () => {
    const sampleLyrics = locale === 'zh'
      ? `[Verse 1]
走在这空旷的街道
灯火映照着我的影子
每一个转角都藏着故事
关于我们曾经的记忆

[Verse 2]
星光落在我的肩头
微风轻轻地吹过
这美好的瞬间
我想永远铭记

[Chorus]
无论未来如何变化
我会在这里等待
那属于我们的时刻
终将会到来

[Bridge]
穿越风雨和风暴
你是守护我的港湾
每一次心跳都呼唤你的名字
一切都因你而改变

[Chorus]
无论未来如何变化
我会在这里等待
那属于我们的时刻
终将会到来`
      : `[Verse 1]
In the glow of city lights
I search for your silhouette
Every corner I turn
I hope to find you there

[Verse 2]
Starlight falls upon my shoulders
A gentle breeze passes by
This beautiful moment
I want to remember forever

[Chorus]
No matter what the future holds
I will be here waiting
For that special moment
That belongs to us alone

[Bridge]
Through the rain and through the storm
You're the shelter keeping me warm
Every heartbeat calls your name
Nothing will ever be the same

[Chorus]
No matter what the future holds
I will be here waiting
For that special moment
That belongs to us alone`
    setLyrics(sampleLyrics)
  }

  return (
    <>
      <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Morandi background bokeh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#b5838d]/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#7a9e9f]/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#9b8fa8]/8 blur-[90px]" />
      </div>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.generator.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.generator.subtitle}
          </p>
        </div>

        {/* New user incentive banner */}
        {!session && (
          <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-foreground"><Gift className="h-4 w-4 text-primary" /> Sign in to get free credits daily</span>
              <span className="text-muted-foreground">⚡️ Generate songs within 1 minute</span>
              <span className="text-muted-foreground">🎸 Create 8-minute songs</span>
              <span className="text-muted-foreground">🏷️ Royalty-free for commercial use</span>
            </div>
          </div>
        )}

        <Card className="mx-auto mt-10 max-w-4xl border-border/50 shadow-xl shadow-primary/5">
          <CardContent className="p-6 lg:p-8">
            {/* Mode Tabs */}
            <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
              <button
                onClick={() => setMode("lyrics")}
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                  mode === "lyrics" 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.generator.lyricsToMusic}
              </button>
              <button
                onClick={() => setMode("text")}
                className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                  mode === "text" 
                    ? "bg-card text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.generator.textToMusic}
              </button>
            </div>

            {/* Upload & Instrumental Toggle */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                {t.generator.uploadAudio}
              </Button>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={isInstrumental}
                  onChange={(e) => setIsInstrumental(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">{t.generator.instrumental}</span>
              </label>
            </div>

            {/* Lyrics Input */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {mode === "lyrics" ? t.generator.lyrics : t.generator.description}
                </label>
                <span className="text-xs text-muted-foreground">{lyrics.length}/5000</span>
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder={mode === "lyrics" 
                  ? t.generator.lyricsPlaceholder 
                  : t.generator.descriptionPlaceholder
                }
                className="mt-2 h-40 w-full resize-none rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                maxLength={5000}
              />
              <div className="mt-2 flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={generateRandomLyrics}>
                  <Shuffle className="h-4 w-4" />
                  {t.generator.randomLyrics}
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowLyricsDialog(true)}>
                  <Wand2 className="h-4 w-4" />
                  {t.generator.aiLyrics}
                </Button>
              </div>
            </div>

            {/* Style Selection */}
            <div className="mt-8 space-y-6">
              {/* Genre */}
              <div>
                <label className="text-sm font-medium text-foreground">{t.generator.genre}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedGenres.includes(genre)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibes */}
              <div>
                <label className="text-sm font-medium text-foreground">{t.generator.vibes}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.vibes.map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => toggleSelection(vibe, selectedVibes, setSelectedVibes)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedVibes.includes(vibe)
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tempos */}
              <div>
                <label className="text-sm font-medium text-foreground">{t.generator.tempo}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.tempos.map((tempo) => (
                    <button
                      key={tempo}
                      onClick={() => toggleSelection(tempo, selectedTempos, setSelectedTempos)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedTempos.includes(tempo)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {tempo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instruments */}
              <div>
                <label className="text-sm font-medium text-foreground">{t.generator.instruments}</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.instruments.map((instrument) => (
                    <button
                      key={instrument}
                      onClick={() => toggleSelection(instrument, selectedInstruments, setSelectedInstruments)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedInstruments.includes(instrument)
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      {instrument}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice */}
              {!isInstrumental && (
                <div>
                  <label className="text-sm font-medium text-foreground">{t.generator.voice}</label>
                  <div className="mt-2 flex gap-2">
                    {[
                      { value: "male", label: t.generator.male },
                      { value: "female", label: t.generator.female },
                      { value: "random", label: t.generator.random },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setVoice(option.value as "male" | "female" | "random")}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                          voice === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exclude Styles */}
              <div>
                <label className="text-sm font-medium text-foreground">{t.generator.excludeStyles ?? 'Exclude Styles'}</label>
                <input
                  type="text"
                  value={excludeStyles}
                  onChange={(e) => setExcludeStyles(e.target.value)}
                  placeholder="e.g. heavy metal, aggressive, distorted"
                  className="mt-2 w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-foreground">{t.generator.songTitle}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.generator.titlePlaceholder}
                  className="mt-2 w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || (mode === 'lyrics' ? lyrics.length === 0 : title.length === 0)}
              className="mt-8 w-full gap-2 py-6 text-base bg-gradient-to-r from-[#b5838d] via-[#9b8fa8] to-[#7a9e9f] hover:opacity-90 text-white"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t.generator.generating}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  {session ? t.generator.generate : 'Sign in to Generate'}
                </>
              )}
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {t.generator.disclaimer}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

      <LyricsGeneratorDialog
        open={showLyricsDialog}
        onOpenChange={setShowLyricsDialog}
        onApply={(text) => setLyrics(text)}
      />
    </>
  )
}
