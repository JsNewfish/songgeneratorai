"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Heart, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MusicPlayerProps {
  title: string
  artist: string
  tags: string[]
  duration: string
  coverColor?: string
}

export function MusicPlayer({ title, artist, tags, duration, coverColor = "from-primary to-accent" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [liked, setLiked] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.5
        })
      }, 100)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying])

  const formatTime = (percentage: number) => {
    const [mins, secs] = duration.split(":").map(Number)
    const totalSeconds = mins * 60 + secs
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds)
    const currentMins = Math.floor(currentSeconds / 60)
    const currentSecs = currentSeconds % 60
    return `${currentMins}:${currentSecs.toString().padStart(2, "0")}`
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex gap-4">
        {/* Cover Art */}
        <div className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${coverColor}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-card/20 backdrop-blur-sm" />
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors hover:bg-foreground/10"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-primary-foreground drop-shadow-md" fill="currentColor" />
            ) : (
              <Play className="h-8 w-8 text-primary-foreground drop-shadow-md" fill="currentColor" />
            )}
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          <div>
            <h3 className="truncate font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{artist}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Duration & Actions */}
        <div className="flex flex-col items-end justify-between">
          <span className="text-sm text-muted-foreground">{duration}</span>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{duration}</span>
        </div>
      </div>
    </div>
  )
}
