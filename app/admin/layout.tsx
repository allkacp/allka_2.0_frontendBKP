import type React from "react"
import { SpecialtyProvider } from "@/lib/contexts/specialty-context"
import { ProductProvider } from "@/lib/contexts/product-context"
import { SidebarProvider } from "@/lib/contexts/sidebar-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SpecialtyProvider>
        <ProductProvider>{children}</ProductProvider>
      </SpecialtyProvider>
    </SidebarProvider>
  )
}
