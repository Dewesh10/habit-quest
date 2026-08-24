import { useState, useEffect, useCallback } from "react"
import type { Settings } from "../types"
import { storageService } from "../services/storageService"

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(storageService.getSettings())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSettings(storageService.getSettings())
    setLoaded(true)
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      storageService.saveSettings(next)
      return next
    })
  }, [])

  return { settings, loaded, updateSettings }
}
