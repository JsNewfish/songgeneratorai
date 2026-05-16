"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useSession, signIn, signOut } from "next-auth/react"
import { Music, Menu, X, ChevronDown, CreditCard, FileMusic, User, LogOut, Moon, Sun } from "lucide-react"
import { ProfileModal } from "./profile-modal"
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { t, locale } = useLanguage()
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"
  const [credits, setCredits] = useState(0)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Fetch real credits when logged in
  useEffect(() => {
    if (!isLoggedIn) return
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => setCredits(d.credits ?? 0))
      .catch(() => null)
  }, [isLoggedIn])

  // Sync credits with page-level updates (e.g., after generation)
  useEffect(() => {
    const handler = (e: Event) => {
      const credits = (e as CustomEvent<{ credits: number }>).detail?.credits
      if (typeof credits === "number") setCredits(credits)
    }
    window.addEventListener("credits-updated", handler)
    return () => window.removeEventListener("credits-updated", handler)
  }, [])

  const user = {
    name: session?.user?.name ?? "User",
    email: session?.user?.email ?? "",
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#b5838d] via-[#9b8fa8] to-[#7a9e9f]">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">SongGeneratorAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/tools/lyrics-to-song" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {locale === 'zh' ? '创建歌曲' : 'Create Song'}
          </Link>
          
          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t.nav.tools}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/tools/lyrics-to-song">{t.nav.lyricsToSong}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-lyrics-generator">{t.nav.lyricsGenerator}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/ai-song-cover-generator">{t.nav.songCover}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/ai-song-cover-generator" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {locale === 'zh' ? 'AI歌曲翻唱' : 'AI Song Cover'}
          </Link>

          {/* Free Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {locale === 'zh' ? '免费工具' : 'Free Tools'}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/ai-lyrics-generator">{t.nav.lyricsGenerator}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tools/vocal-remover">{locale === 'zh' ? '人声分离' : 'Vocal Remover'}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">{locale === 'zh' ? 'MP3转MIDI' : 'MP3 to MIDI'}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t.nav.pricing}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <LanguageSelector />
          
          {isLoggedIn ? (
            <>
              {/* Credits Display */}
              <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{credits}</span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-medium">U</span>
                    <ChevronDown className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-subscription" className="flex items-center gap-2">
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
                  <DropdownMenuItem 
                    onClick={() => setShowProfileModal(true)}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {locale === 'zh' ? '我的个人资料' : 'My Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex cursor-pointer items-center gap-2 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    {locale === 'zh' ? '退出登录' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => signIn('google')}>
                {t.nav.signIn}
              </Button>
              <Button size="sm" onClick={() => signIn('google')}>
                {t.nav.getStarted}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <LanguageSelector />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/tools/lyrics-to-song" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              {locale === 'zh' ? '创建歌曲' : 'Create Song'}
            </Link>
            <Link href="/tools/lyrics-to-song" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.lyricsToSong}
            </Link>
            <Link href="/ai-lyrics-generator" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.lyricsGenerator}
            </Link>
            <Link href="/ai-song-cover-generator" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.songCover}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.pricing}
            </Link>
            <Link href="/my-creations" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
              {locale === 'zh' ? '我的创作' : 'My Creations'}
            </Link>
            <div className="mt-3 flex flex-col gap-2">
              {isLoggedIn ? (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>{credits}</span>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => signIn('google')}>
                    {t.nav.signIn}
                  </Button>
                  <Button size="sm" className="w-full justify-center" onClick={() => signIn('google')}>
                    {t.nav.getStarted}
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onSave={(data) => setUser({ ...user, name: data.name })}
      />
    </header>
  )
}
