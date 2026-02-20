"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, GripVertical, Instagram, Facebook, Linkedin, Music, Youtube, Mail, MapPin, MessageCircle, Phone, Globe, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "x" | "pinterest" | "whatsapp" | "telegram" | "site" | "google_business"

export interface SocialLink {
  id: string
  platform: SocialPlatform
  url: string
  order: number
}

interface CompanySocialLinksManagerProps {
  socialLinks: SocialLink[]
  onChange: (links: SocialLink[]) => void
  isEditMode?: boolean
}

const SOCIAL_PLATFORMS: { id: SocialPlatform; name: string; icon: React.ReactNode; color: string; placeholder: string }[] = [
  { id: "instagram", name: "Instagram", icon: <Instagram className="h-5 w-5" />, color: "bg-pink-50 border-pink-200 text-pink-600", placeholder: "https://instagram.com/empresa" },
  { id: "facebook", name: "Facebook", icon: <Facebook className="h-5 w-5" />, color: "bg-blue-50 border-blue-200 text-blue-600", placeholder: "https://facebook.com/empresa" },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, color: "bg-blue-50 border-blue-200 text-blue-700", placeholder: "https://linkedin.com/company/empresa" },
  { id: "tiktok", name: "TikTok", icon: <Music className="h-5 w-5" />, color: "bg-black/5 border-black/10 text-black", placeholder: "https://tiktok.com/@empresa" },
  { id: "youtube", name: "YouTube", icon: <Youtube className="h-5 w-5" />, color: "bg-red-50 border-red-200 text-red-600", placeholder: "https://youtube.com/@empresa" },
  { id: "x", name: "X (Twitter)", icon: <X className="h-5 w-5" />, color: "bg-black/5 border-black/10 text-black", placeholder: "https://x.com/empresa" },
  { id: "pinterest", name: "Pinterest", icon: <Mail className="h-5 w-5" />, color: "bg-red-50 border-red-200 text-red-500", placeholder: "https://pinterest.com/empresa" },
  { id: "whatsapp", name: "WhatsApp", icon: <MessageCircle className="h-5 w-5" />, color: "bg-green-50 border-green-200 text-green-600", placeholder: "https://wa.me/55xxxxxxxxxxxx" },
  { id: "telegram", name: "Telegram", icon: <MessageCircle className="h-5 w-5" />, color: "bg-blue-50 border-blue-200 text-blue-500", placeholder: "https://t.me/empresa" },
  { id: "site", name: "Site", icon: <Globe className="h-5 w-5" />, color: "bg-purple-50 border-purple-200 text-purple-600", placeholder: "https://empresa.com.br" },
  { id: "google_business", name: "Google Meu Negócio", icon: <MapPin className="h-5 w-5" />, color: "bg-yellow-50 border-yellow-200 text-yellow-600", placeholder: "https://google.com/business/empresa" },
]

const getPlatformConfig = (platform: SocialPlatform) => SOCIAL_PLATFORMS.find(p => p.id === platform) || SOCIAL_PLATFORMS[0]

export function CompanySocialLinksManager({ socialLinks, onChange, isEditMode = false }: CompanySocialLinksManagerProps) {
  const [showSelector, setShowSelector] = useState(false)
  const usedPlatforms = new Set(socialLinks.map(l => l.platform))

  const handleAddPlatform = (platform: SocialPlatform) => {
    // If platform already exists, just close the selector
    if (usedPlatforms.has(platform)) {
      setShowSelector(false)
      return
    }

    const newLink: SocialLink = {
      id: `${platform}-${Date.now()}`,
      platform,
      url: "",
      order: socialLinks.length,
    }

    onChange([...socialLinks, newLink])
    setShowSelector(false)
  }

  const handleUpdateLink = (id: string, url: string) => {
    onChange(
      socialLinks.map(link =>
        link.id === id ? { ...link, url } : link
      )
    )
  }

  const handleRemoveLink = (id: string) => {
    onChange(socialLinks.filter(link => link.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Platform Selector */}
      {showSelector && (
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-3">Selecione uma rede social:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleAddPlatform(platform.id)}
                disabled={usedPlatforms.has(platform.id)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border transition-all text-sm font-medium",
                  usedPlatforms.has(platform.id)
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 cursor-pointer"
                )}
              >
                {platform.icon}
                <span className="truncate">{platform.name}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Add Button */}
      {!showSelector && (
        <Button
          type="button"
          onClick={() => setShowSelector(true)}
          variant="outline"
          className="w-full border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar rede social
        </Button>
      )}

      {/* Social Links Cards */}
      <div className="space-y-2">
        {socialLinks.map((link) => {
          const config = getPlatformConfig(link.platform)
          return (
            <Card key={link.id} className="p-4 border-slate-200">
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div className="text-slate-400 pt-1">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Icon and Name */}
                <div className={cn("p-2 rounded-lg flex-shrink-0", config.color)}>
                  {config.icon}
                </div>

                {/* Input and Remove Button */}
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{config.name}</p>
                  <Input
                    type="url"
                    placeholder={config.placeholder}
                    value={link.url}
                    onChange={(e) => handleUpdateLink(link.id, e.target.value)}
                    className="text-sm h-8 border-slate-200"
                  />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveLink(link.id)}
                  className="text-slate-400 hover:text-red-500 flex-shrink-0 pt-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {socialLinks.length === 0 && !showSelector && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">Nenhuma rede social adicionada ainda</p>
        </div>
      )}
    </div>
  )
}
