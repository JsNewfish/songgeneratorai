"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, defaultLocale, getTranslation, translations } from "@/lib/i18n"

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations.en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with defaultLocale for hydration consistency (server = client on first render)
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // After hydration, load from localStorage or browser preference
    try {
      const saved = localStorage.getItem('locale') as Locale | null
      if (saved && translations[saved]) {
        setLocaleState(saved)
        return
      }
      const browserLang = navigator.language.split('-')[0] as Locale
      if (translations[browserLang]) {
        setLocaleState(browserLang)
      }
    } catch {}
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try { localStorage.setItem('locale', newLocale) } catch {}
  }

  const t = getTranslation(locale)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
