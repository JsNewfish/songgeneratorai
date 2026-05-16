"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { X, ImagePlus, Music } from "lucide-react"

interface Song {
  id: string
  title: string
  subtitle?: string
  image?: string
  duration?: string
  createdAt?: string
}

interface SongDetailModalProps {
  isOpen: boolean
  onClose: () => void
  song: Song | null
  onSave: (data: { id: string; title: string; image?: string }) => void
}

export function SongDetailModal({ isOpen, onClose, song, onSave }: SongDetailModalProps) {
  const { locale } = useLanguage()
  const [title, setTitle] = useState(song?.title || "")
  const [imagePreview, setImagePreview] = useState(song?.image)

  const t = {
    en: {
      title: "Edit Song Detail",
      songTitle: "Song Title",
      songImage: "Song Image",
      addNewImage: "Add New Image",
      cancel: "Cancel",
      submit: "Submit",
    },
    zh: {
      title: "编辑歌曲详情",
      songTitle: "歌曲标题",
      songImage: "歌曲图片",
      addNewImage: "Add New Image",
      cancel: "Cancel",
      submit: "Submit",
    },
  }

  const text = t[locale as keyof typeof t] || t.en

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (song) {
      onSave({ id: song.id, title, image: imagePreview })
    }
    onClose()
  }

  if (!isOpen || !song) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground">{text.title}</h2>

        {/* Song Title */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground">{text.songTitle}</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 border-border bg-muted/50"
            placeholder="Enter song title..."
          />
        </div>

        {/* Song Image */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground">{text.songImage}</label>
          <div className="mt-3 flex items-center gap-4">
            {/* Image Preview */}
            <div className="relative h-28 w-28 overflow-hidden rounded-lg border-2 border-border bg-gradient-to-br from-purple-900 to-indigo-900">
              {imagePreview ? (
                <img src={imagePreview} alt="Song cover" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-white/60">
                  <div className="flex items-center gap-1">
                    <Music className="h-6 w-6" />
                    <Music className="h-4 w-4" />
                  </div>
                  <p className="mt-2 text-xs">{song.subtitle || song.title}</p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted">
              <ImagePlus className="h-4 w-4" />
              {text.addNewImage}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {text.cancel}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
          >
            {text.submit}
          </Button>
        </div>
      </div>
    </div>
  )
}
