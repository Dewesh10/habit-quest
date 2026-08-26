import { useEffect, useState, useCallback } from "react"
import type { Habit, Completion, Achievement } from "../types"
import { storageService } from "../services/storageService"
import { achievementDefs } from "../data/achievementDefs"
import {
  calculateCurrentStreak,
  calculateTotalCompleted,
  calculateXP,
} from "../utils/stats"

function checkCriteria(
  def: (typeof achievementDefs)[number],
  habits: Habit[],
  completions: Completion[]
): boolean {
  switch (def.criteria.type) {
    case "firstCompletion":
      return calculateTotalCompleted(completions) >= def.criteria.target
    case "streak":
      return calculateCurrentStreak(habits, completions) >= def.criteria.target
    case "totalCompletions":
      return calculateTotalCompleted(completions) >= def.criteria.target
    case "totalXP":
      return calculateXP(habits, completions) >= def.criteria.target
    default:
      // perfectWeek, perfectMonth, habitCompletions: not wired up yet
      return false
  }
}

export function useAchievements(habits: Habit[], completions: Completion[]) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loaded, setLoaded] = useState(false)
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null)

  useEffect(() => {
    const stored = storageService.getAchievements()
    // Seed any achievement defs that don't exist in storage yet.
    const seeded: Achievement[] = achievementDefs.map((def) => {
      const existing = stored.find((a) => a.id === def.id)
      return { ...def, unlockedAt: existing?.unlockedAt ?? null }
    })
    setAchievements(seeded)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded || habits.length === 0) return

    let changed = false
    const next = achievements.map((a) => {
      if (a.unlockedAt) return a
      const def = achievementDefs.find((d) => d.id === a.id)
      if (!def) return a
      if (checkCriteria(def, habits, completions)) {
        changed = true
        const unlocked = { ...a, unlockedAt: new Date().toISOString() }
        setNewlyUnlocked(unlocked)
        return unlocked
      }
      return a
    })

    if (changed) {
      setAchievements(next)
      storageService.saveAchievements(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completions, habits, loaded])

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked(null), [])

  return { achievements, loaded, newlyUnlocked, clearNewlyUnlocked }
}
