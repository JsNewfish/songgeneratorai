"use client"

import { useState } from "react"
import { Music, ChevronDown, Globe, CreditCard, User, LogOut, FileMusic, Sparkles, Mic2, Scissors, Volume2, FileText, Piano, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "./language-selector"

const tools = [
  { id: "lyrics-to-song", icon: FileMusic, label: "Lyrics to Song", labelZh: "歌词转歌曲", href: "/tools/lyrics-to-song", badge: "HOT", inline: true },
  { id: "ai-cover", icon: Mic2, label: "AI Song Cover", labelZh: "AI歌曲翻唱", href: "/ai-song-cover-generator", badge: "NEW", inline: true },
  { id: "vocal-remover", icon: Scissors, label: "Vocal Remover", labelZh: "人声去除", href: "/tools/vocal-remover", inline: true },
  { id: "voice-trainer", icon: Volume2, label: "Voice Model Trainer", labelZh: "声音模型训练器", href: "#" },
  { id: "ai-lyrics", icon: FileText, label: "AI Lyrics Generator", labelZh: "AI歌词生成器", href: "/ai-lyrics-generator" },
  { id: "mp3-to-midi", icon: Piano, label: "MP3 to MIDI", labelZh: "MP3转MIDI", href: "#" },
  { id: "midi-editor", icon: Music, label: "MIDI Editor", labelZh: "MIDI编辑器", href: "#" },
  { id: "text-to-song", icon: Type, label: "Text to Song", labelZh: "文本转歌曲", href: "/tools/lyrics-to-song?mode=text" },
]

export function ToolHeader({ currentTool = "lyrics-to-song", onToolChange }: { currentTool?: string; onToolChange?: (toolId: string) => void }) {
  const { t, locale } = useLanguage()
  const [isLoggedIn] = useState(true) // Demo: assume logged in
  const credits = 20

  const currentToolData = tools.find(tool => tool.id === currentTool) || tools[0]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-lg">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
              <Music className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SongGeneratorAI</span>
          </Link>

          {/* Tool Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-border/50 bg-muted/50">
                {locale === 'zh' ? currentToolData.labelZh : currentToolData.label}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {tools.map((tool) => (
                tool.inline && onToolChange ? (
                  <DropdownMenuItem key={tool.id} onClick={() => onToolChange(tool.id)} className="flex items-center gap-3 cursor-pointer">
                    <tool.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{locale === 'zh' ? tool.labelZh : tool.label}</span>
                    {tool.badge && (
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        tool.badge === 'HOT' 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {tool.badge}
                      </span>
                    )}
                    {currentTool === tool.id && (
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem key={tool.id} asChild>
                    <Link href={tool.href} className="flex items-center gap-3">
                      <tool.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{locale === 'zh' ? tool.labelZh : tool.label}</span>
                      {tool.badge && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          tool.badge === 'HOT' 
                            ? 'bg-orange-100 text-orange-600' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {tool.badge}
                        </span>
                      )}
                      {currentTool === tool.id && (
                        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Link>
                  </DropdownMenuItem>
                )
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Link href="/pricing" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:block">
            {t.nav.pricing}
          </Link>
          <Link href="#" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:block">
            {locale === 'zh' ? '指南' : 'Guide'}
          </Link>
          <Link href="#" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:block">
            {locale === 'zh' ? '联系' : 'Contact'}
          </Link>

          <LanguageSelector />

          {/* Credits */}
          {isLoggedIn && (
            <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{credits}</span>
            </div>
          )}

          {/* User Menu */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-medium">U</span>
                  <ChevronDown className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-foreground">User Name</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/pricing" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {locale === 'zh' ? '我的订阅' : 'My Subscription'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-creations" className="flex items-center gap-2">
                    <FileMusic className="h-4 w-4" />
                    {locale === 'zh' ? '我的创作' : 'My Creations'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {locale === 'zh' ? '我的个人资料' : 'My Profile'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-4 w-4" />
                  {locale === 'zh' ? '退出登录' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm">{t.nav.signIn}</Button>
          )}
        </div>
      </div>
    </header>
  )
}
