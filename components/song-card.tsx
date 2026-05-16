"use client"

import { useState } from "react"
import { 
  Music, 
  Play, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Mic,
  AudioWaveform,
  Scissors,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  Copy,
  Disc
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Song {
  id: string
  title: string
  subtitle?: string
  cover?: string
  duration?: string
}

interface SongCardProps {
  song: Song
  locale?: string
  isFavorite?: boolean
  onPlay?: () => void
  onToggleFavorite?: () => void
  onShare?: () => void
  onExtend?: () => void
  onCover?: () => void
  onReplace?: () => void
  onGenerateSimilar?: () => void
  onMakeAISinger?: () => void
  onMakeVibeSeed?: () => void
  onGetStems?: () => void
  onSongDetails?: () => void
  onDownload?: (format: string) => void
  onDelete?: () => void
}

export function SongCard({
  song,
  locale = "en",
  isFavorite = false,
  onPlay,
  onToggleFavorite,
  onShare,
  onExtend,
  onCover,
  onReplace,
  onGenerateSimilar,
  onMakeAISinger,
  onMakeVibeSeed,
  onGetStems,
  onSongDetails,
  onDownload,
  onDelete
}: SongCardProps) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="relative aspect-square bg-gradient-to-br from-purple-900 to-indigo-900">
        {song.cover ? (
          <img 
            src={song.cover} 
            alt={song.title}
            className="h-full w-full object-cover"
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
          onClick={onPlay}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 hover:scale-105 transition-transform">
            <Play className="h-6 w-6 text-foreground ml-1" />
          </div>
        </div>
        
        {/* Action Buttons - Top */}
        <div className="absolute left-2 right-2 top-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-1">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite?.()
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70 ${
                isFavorite ? 'text-red-500' : 'text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onShare?.()
              }}
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
            <DropdownMenuContent align="end" className="w-48">
              {/* Remix/Edit Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <Music className="h-4 w-4" />
                  <span>{locale === 'zh' ? '混音/编辑' : 'Remix/Edit'}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  <DropdownMenuItem className="gap-2" onClick={onExtend}>
                    <RefreshCw className="h-4 w-4" />
                    {locale === 'zh' ? '延长歌曲' : 'Extend Song'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={onCover}>
                    <Disc className="h-4 w-4" />
                    {locale === 'zh' ? '翻唱歌曲' : 'Cover Song'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={onReplace}>
                    <Scissors className="h-4 w-4" />
                    {locale === 'zh' ? '替换部分' : 'Replace Section'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={onGenerateSimilar}>
                    <Copy className="h-4 w-4" />
                    {locale === 'zh' ? '生成类似' : 'Generate Similar'}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuItem className="gap-2" onClick={onMakeAISinger}>
                <Mic className="h-4 w-4" />
                {locale === 'zh' ? '制作AI歌手' : 'Make AI Singer'}
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2" onClick={onMakeVibeSeed}>
                <AudioWaveform className="h-4 w-4" />
                {locale === 'zh' ? '制作VibeSeed' : 'Make VibeSeed'}
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2" onClick={onGetStems}>
                <Scissors className="h-4 w-4" />
                {locale === 'zh' ? '获取音轨/MIDI' : 'Get Stems / MIDI'}
              </DropdownMenuItem>
              
              <DropdownMenuItem className="gap-2" onClick={onSongDetails}>
                <FileText className="h-4 w-4" />
                {locale === 'zh' ? '歌曲详情' : 'Song Details'}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Download Submenu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <Download className="h-4 w-4" />
                  <span>{locale === 'zh' ? '下载' : 'Download'}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40">
                  <DropdownMenuItem onClick={() => onDownload?.('mp3')}>
                    MP3 (320kbps)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload?.('wav')}>
                    WAV (Lossless)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload?.('flac')}>
                    FLAC
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="gap-2 text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                {locale === 'zh' ? '删除' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {song.subtitle && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-xs text-white/70">{song.subtitle}</p>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-medium text-foreground">{song.title}</p>
      </div>
    </div>
  )
}
