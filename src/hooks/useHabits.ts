import { useState, useEffect, useCallback } from "react"
import type { Habit } from "../types"
import { storageService } from "../services/storageService"
import { sampleHabits } from "../data/sampleData"

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const existing = storageService.getHabits()
    if (existing.length === 0) {
      storageService.saveHabits(sampleHabits)
      setHabits(sampleHabits)
    } else {
      setHabits(existing)
    }
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Habit[]) => {
    setHabits(next)
    storageService.saveHabits(next)
  }, [])

  const addHabit = useCallback(
    (habit: Habit) => {
      persist([...habits, habit])
    },
    [habits, persist]
  )

  const updateHabit = useCallback(
    (id: string, updates: Partial<Habit>) => {
      persist(habits.map((h) => (h.id === id ? { ...h, ...updates } : h)))
    },
    [habits, persist]
  )

  const deleteHabit = useCallback(
    (id: string) => {
      persist(habits.filter((h) => h.id !== id))
    },
    [habits, persist]
  )

  const archiveHabit = useCallback(
    (id: string, archived: boolean) => {
      updateHabit(id, { archived })
    },
    [updateHabit]
  )

  return { habits, loaded, addHabit, updateHabit, deleteHabit, archiveHabit }
}
