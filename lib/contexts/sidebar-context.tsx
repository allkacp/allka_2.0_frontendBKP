"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  sidebarWidth: number
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window === "undefined") return 256
    const saved = localStorage.getItem("sidebar-collapsed")
    return saved === "true" ? 64 : 256
  })
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("sidebar-collapsed") === "true"
  })

  useEffect(() => {
    // Observe the actual sidebar DOM element width with ResizeObserver
    const findAndObserveSidebar = () => {
      const sidebarEl = document.querySelector("[data-sidebar-root]") as HTMLElement | null
      if (!sidebarEl) return null

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.round(entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width)
          if (w > 0) {
            setSidebarWidth(w)
            setIsCollapsed(w < 100)
          }
        }
      })
      observer.observe(sidebarEl)
      // Read initial width
      const initW = sidebarEl.getBoundingClientRect().width
      if (initW > 0) {
        setSidebarWidth(Math.round(initW))
        setIsCollapsed(initW < 100)
      }
      return observer
    }

    // Sidebar may not be in DOM yet — retry a few times
    let observer = findAndObserveSidebar()
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    if (!observer) {
      let retries = 0
      const retry = () => {
        observer = findAndObserveSidebar()
        if (!observer && retries < 20) {
          retries++
          retryTimer = setTimeout(retry, 250)
        }
      }
      retryTimer = setTimeout(retry, 100)
    }

    // Also listen for the custom event as a fallback
    const handler = (e: Event) => {
      const collapsed = (e as CustomEvent<{ collapsed: boolean }>).detail.collapsed
      setIsCollapsed(collapsed)
      setSidebarWidth(collapsed ? 64 : 256)
    }
    window.addEventListener("sidebar-collapsed-change", handler)

    return () => {
      observer?.disconnect()
      if (retryTimer) clearTimeout(retryTimer)
      window.removeEventListener("sidebar-collapsed-change", handler)
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    const next = !isCollapsed
    setIsCollapsed(next)
    setSidebarWidth(next ? 64 : 256)
    localStorage.setItem("sidebar-collapsed", JSON.stringify(next))
    window.dispatchEvent(new CustomEvent("sidebar-collapsed-change", { detail: { collapsed: next } }))
  }, [isCollapsed])

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, sidebarWidth }}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    return { isCollapsed: false, toggleSidebar: () => {}, sidebarWidth: 256 }
  }
  return context
}
