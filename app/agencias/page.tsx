"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AgenciasPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/agencias/dashboard")
  }, [router])

  return null
}
