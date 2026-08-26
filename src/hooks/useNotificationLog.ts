import { useState, useEffect, useCallback } from "react"
import type { NotificationEntry } from "../types"
import { storageService } from "../services/storageService"

export function useNotificationLog() {
  const [entries, setEntries] = useState<NotificationEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEntries(storageService.getNotifications())
    setLoaded(true)
  }, [])

  const logEvent = useCallback(
    (type: NotificationEntry["type"], message: string, subtext?: string) => {
      const entry: NotificationEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        message,
        subtext,
        timestamp: new Date().toISOString(),
      }
      setEntries((prev) => {
        const next = [...prev, entry]
        storageService.saveNotifications(next)
        return next.slice(-50)
      })
    },
    []
  )

  const clearLog = useCallback(() => {
    setEntries([])
    storageService.saveNotifications([])
  }, [])

  return { entries, loaded, logEvent, clearLog }
}
