"use client"

import { useEffect } from "react"
import { initializeData } from "@/lib/api-service"

export function DataInitializer() {
  useEffect(() => {
    console.log("Initializing data from localStorage")
    initializeData()
  }, [])

  return null
}

