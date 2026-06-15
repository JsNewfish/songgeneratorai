"use client"

import { useState, useEffect, useCallback } from "react"
import { MoreVertical, Play, Pause, Download, Share2, Trash2, Edit2, ChevronLeft, ChevronRight, Check, Music, FileText, Loader2, RefreshCw } from "lucide-react"
import { SongDetailModal } from "@/components/song-detail-modal"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ToolHeader } from "@/components/tool-header"
import { AudioPlayer } from "@/components/audio-player"
import { useLanguage } from "@/contexts/language-context"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

type Song = {
  id: string
  title: string
  cover: string
  audio_url: string
  duration: string
  createdAt: string
  tool: string
  style?: string
}

const tools = [
  { id: "all", label: "All Creations", labelZh: "全部创作" },
  { id: "ai-music", label: "AI Music Generator", labelZh: "AI 歌曲生成器" },
  { id: "ai-cover", label: "AI Song Cover", labelZh: "AI 歌曲翻唱" },
  { id: "ai-lyrics", label: "AI Lyrics Generator", labelZh: "AI 歌词生成器" },
]

export default function MyCreationsPage() {
  const { locale } = useLanguage()
  const { data: session } = useSession()
  const [selectedTool, setSelectedTool] = useState("all")
  const [activeTab, setActiveTab] = useState<"songs" | "deleted">("songs")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [playingSong, setPlayingSong] = useState<string | null>(null)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [creations, setCreations] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const itemsPerPage = 20

  const fetchSongs = useCallback(async (page = 1) => {
    if (!session?.user) return
    setLoading(true)
    try {
      const res = await fetch(`/api/songs?page=${page}&limit=${itemsPerPage}`)
      const data = await res.json()
      const songs: Song[] = (data.songs ?? []).map((s: {
        id: string; title?: string; image_url?: string; audio_url?: string;
        duration?: number; created_at?: string; style?: string
      }) => ({
        id: s.id,
        title: s.title || 'Untitled Track',
        cover: s.image_url || '',
        audio_url: s.audio_url || '',
        duration: s.duration ? `${Math.floor(s.duration / 60)}:${String(s.duration % 60).padStart(2, '0')}` : '3:00',
        createdAt: s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
        tool: 'ai-music',
        style: s.style || '',
      }))
      setCreations(songs)
      setTotal(data.total ?? songs.length)
    } catch {
      toast.error('Failed to load songs')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchSongs(currentPage)
  }, [fetchSongs, currentPage])

  const totalItems = total
  const totalPages = Math.ceil(total / itemsPerPage)

  const toggleSelectAll = () => {
    if (selectedItems.length === creations.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(creations.map(c => c.id))
    }
  }

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handlePlaySong = (song: Song) => {
    if (playingSong === song.id) {
      setPlayingSong(null)
      setCurrentSong(null)
    } else {
      setPlayingSong(song.id)
      setCurrentSong(song)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/songs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setCreations(prev => prev.filter(c => c.id !== id))
      setTotal(t => t - 1)
      if (playingSong === id) { setPlayingSong(null); setCurrentSong(null) }
      toast.success(locale === 'zh' ? '已删除' : 'Deleted')
    } catch {
      toast.error(locale === 'zh' ? '删除失败' : 'Delete failed')
    }
  }

  const filteredCreations = selectedTool === "all"
    ? creations
    : creations.filter(c => c.tool === selectedTool)

  const handleUpdateSong = (data: { id: string; title: string; image?: string }) => {
    setCreations(prev => prev.map(c =>
      c.id === data.id ? { ...c, title: data.title, cover: data.image || c.cover } : c
    ))
  }

  const currentToolLabel = tools.find(t => t.id === selectedTool)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ToolHeader currentTool="lyrics-to-song" />
      
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              {locale === 'zh' ? '我的创作' : 'My Creations'}
            </h1>
            <Button variant="ghost" size="sm" onClick={() => fetchSongs(currentPage)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Tool Filter */}
          <div className="mt-6">
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-[280px]">
                <SelectValue>
                  {locale === 'zh' ? currentToolLabel?.labelZh : currentToolLabel?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tools.map(tool => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {locale === 'zh' ? tool.labelZh : tool.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex items-center gap-6 border-b border-border">
            <button
              onClick={() => setActiveTab("songs")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "songs"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === 'zh' ? '我的歌曲' : 'My Songs'}
            </button>
          </div>

          {/* Actions Bar */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  selectedItems.length === creations.length && creations.length > 0
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border'
                }`}>
                  {selectedItems.length === creations.length && creations.length > 0 && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                {locale === 'zh' ? '全选' : 'Select All'}
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {locale === 'zh' ? `共 ${totalItems} 首歌曲` : `${totalItems} songs total`}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-2">{currentPage} / {totalPages}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Songs List */}
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCreations.length > 0 ? (
              filteredCreations.map((creation) => (
                <div
                  key={creation.id}
                  className="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-3 transition-all hover:border-border hover:bg-muted/30"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelectItem(creation.id)}
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selectedItems.includes(creation.id)
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border'
                    }`}
                  >
                    {selectedItems.includes(creation.id) && (
                      <Check className="h-3 w-3" />
                    )}
                  </button>

                  {/* Cover with Play Overlay */}
                  <div
                    className="relative h-14 w-14 cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 to-indigo-900 flex-shrink-0"
                    onClick={() => handlePlaySong(creation)}
                  >
                    {creation.cover ? (
                      <img src={creation.cover} alt={creation.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Music className="h-5 w-5 text-white/50" />
                      </div>
                    )}
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                      playingSong === creation.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {playingSong === creation.id ? (
                        <Pause className="h-5 w-5 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      )}
                    </div>
                    <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                      {creation.duration}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-medium text-foreground">{creation.title}</h3>
                    <p className="text-sm text-muted-foreground">{creation.style || creation.createdAt}</p>
                    <p className="text-xs text-muted-foreground/60">{creation.createdAt}</p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => setEditingSong(creation)}
                      >
                        <FileText className="h-4 w-4" />
                        {locale === 'zh' ? '歌曲详情' : 'Song Details'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => window.open(creation.audio_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                        {locale === 'zh' ? '下载' : 'Download'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-red-600"
                        onClick={() => handleDelete(creation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {locale === 'zh' ? '删除' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Music className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {locale === 'zh' ? '暂无创作' : 'No creations yet'}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {locale === 'zh'
                    ? '开始创作您的第一首歌曲吧！'
                    : 'Start creating your first song!'}
                </p>
                <Button className="mt-4" asChild>
                  <a href="/tools/lyrics-to-song">
                    {locale === 'zh' ? '开始创作' : 'Start Creating'}
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Audio Player */}
      <AudioPlayer
        song={currentSong}
        isPlaying={playingSong !== null}
        onPlayPause={() => {
          if (playingSong) {
            setPlayingSong(null)
          }
        }}
      />

      {/* Song Detail Modal */}
      <SongDetailModal
        isOpen={editingSong !== null}
        onClose={() => setEditingSong(null)}
        song={editingSong}
        onSave={handleUpdateSong}
      />
    </div>
  )
}
