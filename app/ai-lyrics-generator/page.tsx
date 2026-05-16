"use client"

import { useState } from "react"
import { Sparkles, Loader2, Copy, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"

const genres = ["Random", "Pop", "Rock", "Hip Hop", "R&B", "Country", "Jazz", "Electronic", "Folk", "Classical"]
const emotions = ["Random", "Happy", "Sad", "Romantic", "Energetic", "Nostalgic", "Hopeful", "Angry", "Peaceful"]
const durations = ["Random", "Short (1-2 verses)", "Medium (2-3 verses)", "Long (3+ verses)"]
const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Portuguese"]
const structures = ["Verse Chorus", "AABA", "ABAB", "Free Form"]

export default function AILyricsGeneratorPage() {
  const { t } = useLanguage()
  const [theme, setTheme] = useState("")
  const [keywords, setKeywords] = useState("")
  const [genre, setGenre] = useState("Random")
  const [emotion, setEmotion] = useState("Random")
  const [duration, setDuration] = useState("Random")
  const [language, setLanguage] = useState("English")
  const [structure, setStructure] = useState("Verse Chorus")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLyrics, setGeneratedLyrics] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const sampleLyrics = `[Verse 1]
Walking through the city lights tonight
Every star above is shining bright
I feel the rhythm in my soul
This moment makes me feel so whole

[Chorus]
We're dancing in the moonlight
Everything feels so right
Together we can fly so high
Reaching for the endless sky

[Verse 2]
The music flows like a gentle stream
Living in this beautiful dream
Your smile lights up the darkest night
With you, everything feels right

[Chorus]
We're dancing in the moonlight
Everything feels so right
Together we can fly so high
Reaching for the endless sky

[Bridge]
No matter where we go
This feeling continues to grow
Side by side we'll find our way
Forever and a day

[Outro]
Dancing in the moonlight
Dancing in the moonlight...`
    
    setGeneratedLyrics(sampleLyrics)
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLyrics)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            {/* Hero */}
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {t.lyricsGen.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.lyricsGen.subtitle}
              </p>
            </div>

            {/* Generator Form */}
            <Card className="mx-auto mt-10 max-w-4xl border-border/50 shadow-xl shadow-primary/5">
              <CardContent className="p-6 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Left Column - Inputs */}
                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <label className="text-sm font-medium text-foreground">{t.lyricsGen.theme}</label>
                      <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{theme.length}/1000</span>
                      </div>
                      <textarea
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        placeholder={t.lyricsGen.themePlaceholder}
                        className="mt-1 h-24 w-full resize-none rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        maxLength={1000}
                      />
                    </div>

                    {/* Keywords */}
                    <div>
                      <label className="text-sm font-medium text-foreground">{t.lyricsGen.keywords}</label>
                      <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{keywords.length}/300</span>
                      </div>
                      <textarea
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder={t.lyricsGen.keywordsPlaceholder}
                        className="mt-1 h-20 w-full resize-none rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        maxLength={300}
                      />
                    </div>

                    {/* Selects Row 1 */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-foreground">{t.lyricsGen.genre}</label>
                        <Select value={genre} onValueChange={setGenre}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map(g => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">{t.lyricsGen.emotion}</label>
                        <Select value={emotion} onValueChange={setEmotion}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {emotions.map(e => (
                              <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Selects Row 2 */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-foreground">{t.lyricsGen.duration}</label>
                        <Select value={duration} onValueChange={setDuration}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {durations.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">{t.lyricsGen.language}</label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map(l => (
                              <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Structure */}
                    <div>
                      <label className="text-sm font-medium text-foreground">{t.lyricsGen.structure}</label>
                      <Select value={structure} onValueChange={setStructure}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {structures.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Generate Button */}
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          {t.lyricsGen.generate}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Right Column - Generated Lyrics */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Generated Lyrics</label>
                      {generatedLyrics && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleGenerate}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex-1 rounded-lg border border-border bg-muted/30 p-4">
                      {generatedLyrics ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">{generatedLyrics}</pre>
                      ) : (
                        <div className="flex h-full min-h-[300px] items-center justify-center text-muted-foreground">
                          <p className="text-center text-sm">Your generated lyrics will appear here...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="mx-auto mt-20 max-w-4xl">
              <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
                {t.lyricsGen.discoverTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                {t.lyricsGen.discoverDesc}
              </p>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Instant AI-Generated Lyrics", desc: "Create high-quality song lyrics tailored to your ideas in seconds." },
                  { title: "Multiple Genres Supported", desc: "From pop to hip-hop, classical to electronic, we cover it all." },
                  { title: "Customizable Themes", desc: "Personalize your lyrics by specifying themes, moods, and emotions." },
                  { title: "Smart Rhyme Suggestions", desc: "AI provides intelligent rhyme and rhythm suggestions." },
                  { title: "Keyword-Based Customization", desc: "Guide the AI with specific keywords for personalized results." },
                  { title: "No Sign-Up Required", desc: "Start generating lyrics immediately without creating an account." },
                ].map((feature, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
