import type { Habit, Completion, Settings, Achievement } from "../types"

const PREFIX = "habitQuest:v1:"

const KEYS = {
  habits: PREFIX + "habits",
  completions: PREFIX + "completions",
  settings: PREFIX + "settings",
  achievements: PREFIX + "achievements",
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    console.warn(`Failed to read ${key} from localStorage, using fallback.`)
    return fallback
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`Failed to write ${key} to localStorage.`)
  }
}

export const storageService = {
  getHabits(): Habit[] {
    return safeGet<Habit[]>(KEYS.habits, [])
  },
  saveHabits(habits: Habit[]): void {
    safeSet(KEYS.habits, habits)
  },

  getCompletions(): Completion[] {
    return safeGet<Completion[]>(KEYS.completions, [])
  },
  saveCompletions(completions: Completion[]): void {
    safeSet(KEYS.completions, completions)
  },

  getSettings(): Settings {
    return safeGet<Settings>(KEYS.settings, {
      theme: "dark",
      weekStartsOn: 1,
      defaultXP: 10,
      soundEnabled: false,
      monthlyGoal: 300,
      equippedTitle: null,
    })
  },
  saveSettings(settings: Settings): void {
    safeSet(KEYS.settings, settings)
  },

  getAchievements(): Achievement[] {
    return safeGet<Achievement[]>(KEYS.achievements, [])
  },
  saveAchievements(achievements: Achievement[]): void {
    safeSet(KEYS.achievements, achievements)
  },
}
