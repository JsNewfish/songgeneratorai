"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { X, Pencil } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    name: string
    email: string
    avatar?: string
  }
  onSave: (data: { name: string; avatar?: string }) => void
}

export function ProfileModal({ isOpen, onClose, user, onSave }: ProfileModalProps) {
  const { locale } = useLanguage()
  const [displayName, setDisplayName] = useState(user.name)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar)

  const t = {
    en: {
      title: "My Profile",
      displayName: "Display name",
      email: "Email",
      cancel: "Cancel",
      save: "Save",
    },
    zh: {
      title: "我的个人资料",
      displayName: "Display name",
      email: "邮箱",
      cancel: "Cancel",
      save: "Save",
    },
  }

  const text = t[locale as keyof typeof t] || t.en

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave({ name: displayName, avatar: avatarPreview })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-foreground">{text.title}</h2>

        {/* Avatar */}
        <div className="mt-6 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-3xl font-bold text-white">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toLowerCase()
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted">
              <Pencil className="h-3.5 w-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Display Name */}
        <div className="mt-6">
          <label className="block text-sm text-muted-foreground">{text.displayName}</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-2 border-border bg-muted/50"
          />
        </div>

        {/* Email (readonly) */}
        <div className="mt-4">
          <label className="block text-sm text-muted-foreground">{text.email}</label>
          <Input
            value={user.email}
            readOnly
            className="mt-2 border-border bg-muted/30 text-muted-foreground"
          />
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
            {text.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
