"use client"

import { useState } from "react"
import { Sparkles, Upload, Link2, Loader2, Play, Heart, Download, Share2 } from "lucide-react"
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

const voiceModels = [
  "Michael Jackson",
  "Taylor Swift",
  "Ed Sheeran",
  "Adele",
  "Bruno Mars",
  "Beyoncé",
  "Drake",
  "Ariana Grande",
  "The Weeknd",
  "Billie Eilish",
  "Custom Voice 1",
  "Custom Voice 2",
]

const showcaseTracks = [
  { title: "You are my soul", artist: "AnitaDeli", duration: "3:54", tags: ["monotone", "LO-FI", "soulful", "female vocals"] },
  { title: "A Nobody", artist: "Echo Tide", duration: "3:32", tags: ["r&b", "dark pop", "alt rock"] },
  { title: "Beta Parade", artist: "Big Bop", duration: "2:36", tags: ["psychedelic rock", "vaporwave", "glitch pop"] },
  { title: "tragic but valid", artist: "Kaizo94", duration: "3:19", tags: ["Soundcloud rap", "Lo-fi", "guitar-trap"] },
  { title: "Downhill Phil", artist: "LKN", duration: "3:58", tags: ["Pop", "Electro-swing", "melodic"] },
  { title: "Goodbye", artist: "Mr Villain", duration: "3:09", tags: ["rock romantic", "pop rock"] },
]

export default function AISongCoverPage() {
  const { t } = useLanguage()
  const [voiceModel, setVoiceModel] = useState("Michael Jackson")
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url")
  const [songUrl, setSongUrl] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsGenerating(false)
    alert("AI Cover generated successfully! (Demo mode)")
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
                {t.songCover.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.songCover.subtitle}
              </p>
              <p className="mt-4 text-sm font-medium text-primary">
                {t.songCover.tryNow}
              </p>
            </div>

            {/* Generator Form */}
            <Card className="mx-auto mt-10 max-w-2xl border-border/50 shadow-xl shadow-primary/5">
              <CardContent className="p-6 lg:p-8">
                {/* Voice Model Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground">{t.songCover.voiceModel}</label>
                  <Select value={voiceModel} onValueChange={setVoiceModel}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceModels.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Explore 10,000+ voice models or train your own custom AI voice
                  </p>
                </div>

                {/* Song Input */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-foreground">{t.songCover.song}</label>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setUploadMethod("url")}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        uploadMethod === "url"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Link2 className="h-4 w-4" />
                      {t.songCover.addUrl}
                    </button>
                    <button
                      onClick={() => setUploadMethod("file")}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        uploadMethod === "file"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      {t.songCover.uploadSong}
                    </button>
                  </div>

                  {uploadMethod === "url" ? (
                    <input
                      type="text"
                      value={songUrl}
                      onChange={(e) => setSongUrl(e.target.value)}
                      placeholder="Paste YouTube or audio URL here..."
                      className="mt-3 w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <div className="mt-3 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drop MP3, WAV, or M4A files here or click to upload
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>

                {/* Song Title */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-foreground">{t.songCover.songTitle}</label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Enter song title (optional)"
                    className="mt-2 w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="mt-6 w-full gap-2"
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
                      {t.songCover.generate}
                    </>
                  )}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  {t.songCover.wait}
                </p>
              </CardContent>
            </Card>

            {/* Showcase */}
            <div className="mx-auto mt-20 max-w-5xl">
              <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
                {t.songCover.discoverTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                {t.songCover.discoverDesc}
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {showcaseTracks.map((track) => (
                  <Card key={track.title} className="border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-foreground">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{track.duration}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {track.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mx-auto mt-20 max-w-5xl">
              <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
                How to Use AI Song Cover Generator
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
                Follow our 3-step guide to create amazing AI Song Covers
              </p>

              <div className="mt-12 grid gap-8 sm:grid-cols-3">
                {[
                  { step: "01", title: "Choose AI Voice Model", desc: "Explore over 10,000 voice models inside the AI Song Cover Generator or upload your own recordings to train a custom AI voice." },
                  { step: "02", title: "Upload Your Song", desc: "Upload MP3, WAV, or M4A files directly, or simply paste a YouTube link to the track you want to cover." },
                  { step: "03", title: "Preview & Download", desc: "Listen to the AI Song Cover instantly after generation. Fine-tune the vocals, adjust volume or mix." },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {item.step}
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="mx-auto mt-20 max-w-5xl">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "10,000+ Voice Models", desc: "Access over 10,000 voice models to create your AI Song Cover with any style or tone." },
                  { title: "Custom AI Voice Training", desc: "Train your own AI voice model with your recordings to create unique AI Song Covers." },
                  { title: "Duets and Harmonies", desc: "Combine multiple voices to create stunning duets or choir-style harmonies." },
                  { title: "Upload Audio or YouTube Links", desc: "Easily generate your AI Song Cover by uploading files or pasting YouTube links." },
                  { title: "Studio-Quality Output", desc: "Every AI Song Cover is automatically enhanced for clarity and noise reduction." },
                  { title: "Flexible Export Options", desc: "Export your AI Song Cover in multiple formats: full mix, instrumental, or vocal-only tracks." },
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
