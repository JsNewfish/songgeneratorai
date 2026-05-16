"use client"

import { useState, useRef } from "react"
import { Upload, Scissors, Download, Play, Pause, Music2, Mic, Volume2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ToolHeader } from "@/components/tool-header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

const exampleTracks = [
  {
    id: "1",
    title: "Pop Song Example",
    artist: "Demo Artist",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop",
    duration: "3:42",
  },
  {
    id: "2",
    title: "Rock Anthem",
    artist: "Demo Band",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=80&h=80&fit=crop",
    duration: "4:15",
  },
  {
    id: "3",
    title: "Acoustic Ballad",
    artist: "Solo Artist",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=80&h=80&fit=crop",
    duration: "3:28",
  },
]

const stems = [
  { id: "vocals", label: "Vocals", labelZh: "人声", icon: Mic, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { id: "instrumental", label: "Instrumental", labelZh: "伴奏", icon: Music2, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { id: "drums", label: "Drums", labelZh: "鼓", icon: Volume2, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { id: "bass", label: "Bass", labelZh: "贝斯", icon: Volume2, color: "text-blue-500", bgColor: "bg-blue-500/10" },
]

export default function VocalRemoverPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("audio/")) {
      setUploadedFile(file)
      setIsComplete(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsComplete(false)
    }
  }

  const handleProcess = () => {
    if (!uploadedFile) return
    setIsProcessing(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          setIsComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-background">
      <ToolHeader currentTool="vocal-remover" />

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Scissors className="h-4 w-4" />
            Free Tool
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI Vocal Remover
          </h1>
          <p className="mt-3 text-muted-foreground">
            Separate vocals from instrumentals in seconds. Extract stems — drums, bass, vocals, and more — with AI precision.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {/* Upload Area */}
          <div
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : uploadedFile
                ? "border-green-500 bg-green-500/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                  <Music2 className="h-7 w-7 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setIsComplete(false) }}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Change File
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Drop your audio file here</p>
                  <p className="text-sm text-muted-foreground">
                    Supports MP3, WAV, FLAC, M4A · Max 50MB
                  </p>
                </div>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
            )}
          </div>

          {/* Processing Button */}
          {uploadedFile && !isComplete && (
            <Button
              className="w-full h-12 text-base"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing... {progress}%
                </>
              ) : (
                <>
                  <Scissors className="mr-2 h-4 w-4" />
                  Separate Stems
                </>
              )}
            </Button>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-center text-sm text-muted-foreground">
                Analyzing audio and separating stems with AI...
              </p>
            </div>
          )}

          {/* Results */}
          {isComplete && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Separated Stems</h2>
              {stems.map((stem) => (
                <div
                  key={stem.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${stem.bgColor}`}>
                      <stem.icon className={`h-5 w-5 ${stem.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{stem.label}</p>
                      <p className="text-xs text-muted-foreground">WAV · 44.1kHz · Stereo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => togglePlay(stem.id)}
                    >
                      {playingId === stem.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={() => { setUploadedFile(null); setIsComplete(false) }}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Process Another Song
              </Button>
            </div>
          )}

          {/* Features Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { title: "High Quality", desc: "44.1kHz lossless output for professional use" },
              { title: "4 Stems", desc: "Separate vocals, instrumentals, drums, and bass" },
              { title: "Fast Processing", desc: "AI-powered separation in under 60 seconds" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-muted/30 p-4 text-center">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Examples Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Example Separations</h2>
          <div className="space-y-4">
            {exampleTracks.map((track) => (
              <div key={track.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <img src={track.cover} alt={track.title} className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{track.title}</p>
                  <p className="text-sm text-muted-foreground">{track.artist} · {track.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Vocals</Button>
                  <Button variant="outline" size="sm">Instrumental</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "What audio formats are supported?",
                a: "MP3, WAV, FLAC, M4A, OGG, and most common audio formats. Maximum file size is 50MB.",
              },
              {
                q: "Is the vocal remover free to use?",
                a: "Yes! You get 3 free separations per day. Upgrade to Pro for unlimited processing and higher quality output.",
              },
              {
                q: "How accurate is the AI stem separation?",
                a: "Our AI model achieves state-of-the-art accuracy. Results may vary by genre; clean studio recordings produce the best results.",
              },
              {
                q: "Can I use the output commercially?",
                a: "Yes, the separated stems are royalty-free for personal and commercial use as long as you own the rights to the original audio.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <p className="font-medium text-foreground">{item.q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
