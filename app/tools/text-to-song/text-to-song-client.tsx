"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { 
  Music, 
  Upload, 
  Sparkles, 
  Shuffle,
  ChevronDown,
  ChevronUp,
  Search,
  Play,
  Diamond,
  Info,
  Coins
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ToolHeader } from "@/components/tool-header"
import { AudioPlayer } from "@/components/audio-player"
import { UpgradeDialog } from "@/components/upgrade-dialog"

const models = [
  { id: "v4", name: "AISongMaker V4", description: "Real vocals, precise control", isNew: true },
  { id: "v3", name: "AISongMaker V3", description: "Top quality, full control" },
  { id: "v2.1", name: "AISongMaker V2.1", description: "Rich audio, advanced methods" },
  { id: "v2", name: "AISongMaker V2", description: "High quality, smart prompts" },
  { id: "v1", name: "AISongMaker V1", description: "Stable quality, basic features" },
]

const styleTags = [
  { id: "genre", label: "# Genre" },
  { id: "mood", label: "# Mood" },
  { id: "tempo", label: "# Tempo" },
  { id: "instruments", label: "# Instruments" },
]

const demoSongs = [
  {
    id: "1",
    title: "Midway of the Damned",
    subtitle: "A haunted Miezdlurlienn",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    duration: "4:02"
  },
  {
    id: "2", 
    title: "Midnight Dreams",
    subtitle: "Electronic Vibes",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    duration: "3:45"
  }
]

export default function TextToSongPage() {
  const [selectedModel, setSelectedModel] = useState("v4")
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [aiSinger, setAiSinger] = useState(false)
  const [vibeSeed, setVibeSeed] = useState(false)
  const [instrumental, setInstrumental] = useState(false)
  const [userPlan, setUserPlan] = useState<string>('free')
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<{ name: string; nameZh: string }>({ name: 'AI Singer', nameZh: 'AI歌手' })
  const [description, setDescription] = useState("")
  const [style, setStyle] = useState("")
  const [voice, setVoice] = useState<"male" | "female" | "random">("random")
  const [title, setTitle] = useState("")
  const [excludeStyle, setExcludeStyle] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [weirdness, setWeirdness] = useState([50])
  const [styleInfluence, setStyleInfluence] = useState([50])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState("ALL")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [currentSong, setCurrentSong] = useState<typeof demoSongs[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const modelRef = useRef<HTMLDivElement>(null)

  const currentModel = models.find(m => m.id === selectedModel)

  const handlePremiumToggle = (feature: { name: string; nameZh: string }, currentValue: boolean, setter: (v: boolean) => void) => {
    if (userPlan === 'free') {
      setUpgradeFeature(feature)
      setUpgradeDialogOpen(true)
    } else {
      setter(!currentValue)
    }
 }

  return (
    <div className="min-h-screen bg-background">
      <ToolHeader currentTool="text-to-song" />
      
      <div className="flex">
        {/* Left Panel - Form */}
        <div className="w-[520px] min-h-[calc(100vh-64px)] border-r border-border p-6 overflow-y-auto">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-6">
              <Link 
                href="/tools/lyrics-to-song"
                className="text-muted-foreground hover:text-foreground transition-colors pb-2"
              >
                Lyrics to Song
              </Link>
              <button className="text-primary font-medium pb-2 border-b-2 border-primary">
                Text to Song
              </button>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Song
            </Button>
          </div>

          {/* Model Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Model</span>
              {currentModel?.isNew && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  NEW · V4
                </span>
              )}
            </div>
            <div className="relative" ref={modelRef}>
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <span>{currentModel?.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              
              {showModelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id)
                        setShowModelDropdown(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedModel === model.id ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedModel === model.id && (
                          <span className="text-primary">✓</span>
                        )}
                        <span>{model.name}</span>
                        <span className="text-muted-foreground text-sm">({model.description})</span>
                      </div>
                      {model.isNew && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                          NEW
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Premium Features */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">AI Singer</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    Use an AI singer voice. Requires Basic plan or above.
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
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">VibeSeed</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    Generate music consistent with a seed audio. Requires Basic plan or above.
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

            <div className="flex items-center justify-between">
              <span className="text-sm">Instrumental</span>
              <Switch checked={instrumental} onCheckedChange={setInstrumental} className="cursor-pointer" />
            </div>
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Description</span>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the song you want to create..."
                className="w-full h-40 px-4 py-3 bg-muted rounded-lg border border-border resize-none focus:outline-none focus:border-primary/50 transition-colors"
                maxLength={1000}
              />
              <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {description.length}/1000
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Shuffle className="h-4 w-4" />
                Random
              </Button>
            </div>
          </div>

          {/* Style Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {styleTags.map((tag) => (
              <button
                key={tag.id}
                className="px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors border border-border"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <span className="text-sm font-medium mb-3 block">Voice</span>
            <div className="flex gap-4">
              {[
                { id: "male", label: "Male" },
                { id: "female", label: "Female" },
                { id: "random", label: "Random" }
              ].map((option) => (
                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    voice === option.id ? "border-primary" : "border-muted-foreground"
                  }`}>
                    {voice === option.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-6">
            <span className="text-sm font-medium mb-2 block">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your song title"
              className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Exclude Style */}
          <div className="mb-6">
            <span className="text-sm font-medium mb-2 block">Exclude Style</span>
            <input
              type="text"
              value={excludeStyle}
              onChange={(e) => setExcludeStyle(e.target.value)}
              placeholder="Enter styles you want to exclude"
              className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Advanced Options */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium"
            >
              Advanced Options
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {showAdvanced && (
              <div className="mt-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">Weirdness</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        Increase to make the AI generate more creative, wild, and surprising song effects.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Slider
                    value={weirdness}
                    onValueChange={setWeirdness}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">Style Influence</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        Increase to make the generated song better match your style description, genre, and musical mood.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Slider
                    value={styleInfluence}
                    onValueChange={setStyleInfluence}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Banner */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Upgrade Your Account</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Get more credits, better quality, and more features!
                </p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href="/pricing">Upgrade</a>
              </Button>
            </div>
          </div>

          {/* Credits & Generate */}
          <div className="sticky bottom-0 bg-background pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Coins className="h-4 w-4" />
              10 credits
            </div>
            <Button 
              className="w-full h-12 text-base gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Music className="h-5 w-5" />
              Generate
            </Button>
            <p className="text-xs text-orange-500 mt-2">
              Lyrics, title, and style must not contain celebrity names or sensitive words.
            </p>
          </div>
        </div>

        {/* Right Panel - Songs Display */}
        <div className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Album</span>
              <select
                value={selectedAlbum}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                className="px-3 py-2 bg-muted rounded-lg border border-border focus:outline-none"
              >
                <option value="ALL">ALL</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Favorites</span>
              <Switch checked={favoritesOnly} onCheckedChange={setFavoritesOnly} />
            </div>
          </div>

          {/* Songs Grid */}
          {demoSongs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {demoSongs.map((song) => (
                <div
                  key={song.id}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => {
                    setCurrentSong(song)
                    setIsPlaying(true)
                  }}
                >
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-medium truncate">{song.title}</p>
                    {song.subtitle && (
                      <p className="text-white/70 text-xs truncate">{song.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="text-6xl mb-4">
                <Sparkles className="h-16 w-16 text-primary mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-primary">✦</span> Text to Song <span className="text-primary">✦</span>
              </h3>
              <p className="text-muted-foreground max-w-md">
                Use our free AI text to song generator to create songs in seconds. 
                Describe your song and let our AI generate it for you.
              </p>
              <Button size="lg" className="mt-6 bg-accent hover:bg-accent/90">
                Try Example Description
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {currentSong && (
        <AudioPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onClose={() => {
            setCurrentSong(null)
            setIsPlaying(false)
          }}
        />
      )}

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        featureName={upgradeFeature.name}
        featureNameZh={upgradeFeature.nameZh}
        locale="en"
      />
    </div>
  )
}
