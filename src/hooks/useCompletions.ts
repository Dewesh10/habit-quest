import { useState, useEffect, useCallback } from "react"
import type { Completion } from "../types"
import { storageService } from "../services/storageService"

export function useCompletions() {
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCompletions(storageService.getCompletions())
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Completion[]) => {
    setCompletions(next)
    storageService.saveCompletions(next)
  }, [])

  const isCompleted = useCallback(
    (habitId: string, dateISO: string) => {
      return completions.some(
        (c) => c.habitId === habitId && c.date === dateISO && c.completed
      )
    },
    [completions]
  )

  const toggleCompletion = useCallback(
    (habitId: string, dateISO: string) => {
      const existingIndex = completions.findIndex(
        (c) => c.habitId === habitId && c.date === dateISO
      )

      if (existingIndex === -1) {
        // No record yet -> mark completed
        persist([...completions, { habitId, date: dateISO, completed: true }])
        return
      }

      const existing = completions[existingIndex]
      const next = [...completions]
      next[existingIndex] = { ...existing, completed: !existing.completed }
      persist(next)
    },
    [completions, persist]
  )

  return { completions, loaded, isCompleted, toggleCompletion }
}
