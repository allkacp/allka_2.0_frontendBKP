"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  sidebarWidth: number
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const sidebarWidth = isCollapsed ? 80 : 240

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, sidebarWidth }}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    // Return default values if used outside provider
    return { isCollapsed: false, toggleSidebar: () => {}, sidebarWidth: 240 }
  }
  return context
}
