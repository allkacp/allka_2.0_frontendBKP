"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InHousePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/in-house/dashboard")
  }, [router])

  return null
}
