"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Heart, Share2, Volume2, Repeat, RotateCcw, X, Music } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface Song {
  id: string
  title: string
  cover: string
  duration: string
  audio_url?: string
}

interface AudioPlayerProps {
  song: Song | null
  isPlaying?: boolean
  onPlayPause?: () => void
  onClose?: () => void
}

export function AudioPlayer({ song, isPlaying: isPlayingProp, onPlayPause, onClose }: AudioPlayerProps) {
  const [isPlayingInternal, setIsPlayingInternal] = useState(false)
  const isPlaying = isPlayingProp !== undefined ? isPlayingProp : isPlayingInternal
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState([80])
  const [currentTime, setCurrentTime] = useState("0:00")
  const [isLiked, setIsLiked] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const prevSongIdRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Re-show player and (re)load audio when a new song is selected
  useEffect(() => {
    if (song && song.id !== prevSongIdRef.current) {
      setIsVisible(true)
      setProgress(0)
      setCurrentTime("0:00")
      setIsPlayingInternal(false)
      prevSongIdRef.current = song.id

      if (audioRef.current && song.audio_url) {
        audioRef.current.src = song.audio_url
        audioRef.current.load()
        audioRef.current.play().then(() => setIsPlayingInternal(true)).catch(() => null)
      }
    }
  }, [song])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
    }
  }, [volume])

  const togglePlay = onPlayPause || (() => {
    if (!audioRef.current) return
    if (isPlayingInternal) {
      audioRef.current.pause()
      setIsPlayingInternal(false)
    } else {
      audioRef.current.play().then(() => setIsPlayingInternal(true)).catch(() => null)
    }
  })

  const handleTimeUpdate = () => {
    const el = audioRef.current
    if (!el || !el.duration) return
    const pct = (el.currentTime / el.duration) * 100
    setProgress(pct)
    const m = Math.floor(el.currentTime / 60)
    const s = Math.floor(el.currentTime % 60)
    setCurrentTime(`${m}:${s.toString().padStart(2, '0')}`)
  }

  const handleSeek = (value: number[]) => {
    const el = audioRef.current
    if (!el || !el.duration) return
    el.currentTime = (value[0] / 100) * el.duration
    setProgress(value[0])
  }

  if (!song || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg">
      {/* Close button — top-right corner */}
      <button
        onClick={() => setIsVisible(false)}
        title="Close player"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {/* Hidden HTML5 audio element */}
      <audio
        ref={audioRef}
        src={song.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlayingInternal(false)}
      />
      <div className="container mx-auto flex h-20 items-center gap-4 px-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-indigo-900 flex-shrink-0">
            {song.cover ? (
              <img
                src={song.cover}
                alt={song.title}
                className="h-full w-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="h-5 w-5 text-white/50" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{song.title}</p>
            <p className="text-xs text-muted-foreground">{currentTime} / {song.duration}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} onClick={() => setIsLiked(!isLiked)} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex w-full max-w-md items-center gap-2">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="flex-1"
            />
          </div>
        </div>

        {/* Volume & Actions */}
        <div className="flex items-center gap-2 min-w-[150px] justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
