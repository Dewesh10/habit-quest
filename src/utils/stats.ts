import type { Habit, Completion } from "../types"
import { isScheduledOn, toISODate } from "./date"

// ---------- helpers ----------

function scheduledCompletionsInRange(
  habits: Habit[],
  completions: Completion[],
  datesISO: string[]
): { scheduled: number; completed: number } {
  let scheduled = 0
  let completed = 0

  for (const habit of habits) {
    if (habit.archived) continue
    for (const dateISO of datesISO) {
      if (!isScheduledOn(habit.frequency, dateISO)) continue
      scheduled++
      const record = completions.find(
        (c) => c.habitId === habit.id && c.date === dateISO
      )
      if (record?.completed) completed++
    }
  }

  return { scheduled, completed }
}

function percent(completed: number, scheduled: number): number {
  if (scheduled === 0) return 0
  return Math.round((completed / scheduled) * 100)
}

function getWeekDates(dateISO: string): string[] {
  // Returns the 7 ISO dates (Sun-Sat) for the week containing dateISO
  const d = new Date(dateISO + "T00:00:00")
  const weekday = d.getDay()
  const sunday = new Date(d)
  sunday.setDate(d.getDate() - weekday)

  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday)
    day.setDate(sunday.getDate() + i)
    dates.push(toISODate(day))
  }
  return dates
}

// ---------- completion percentages ----------

export function calculateDailyCompletion(
  habits: Habit[],
  completions: Completion[],
  dateISO: string
): number {
  const { scheduled, completed } = scheduledCompletionsInRange(
    habits,
    completions,
    [dateISO]
  )
  return percent(completed, scheduled)
}

export function calculateWeeklyCompletion(
  habits: Habit[],
  completions: Completion[],
  dateISO: string
): number {
  const weekDates = getWeekDates(dateISO)
  const { scheduled, completed } = scheduledCompletionsInRange(
    habits,
    completions,
    weekDates
  )
  return percent(completed, scheduled)
}

export function calculateMonthlyCompletion(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): number {
  const { scheduled, completed } = scheduledCompletionsInRange(
    habits,
    completions,
    monthDates
  )
  return percent(completed, scheduled)
}

export function calculateOverallCompletion(
  habits: Habit[],
  completions: Completion[]
): number {
  // Uses every date that has at least one completion record, plus today,
  // so "overall" reflects the habit's whole tracked history.
  const allDates = new Set(completions.map((c) => c.date))
  allDates.add(toISODate(new Date()))
  const { scheduled, completed } = scheduledCompletionsInRange(
    habits,
    completions,
    Array.from(allDates)
  )
  return percent(completed, scheduled)
}

// ---------- totals ----------

export function calculateTotalCompleted(completions: Completion[]): number {
  return completions.filter((c) => c.completed).length
}

export function calculateRemaining(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): number {
  const { scheduled, completed } = scheduledCompletionsInRange(
    habits,
    completions,
    monthDates
  )
  return Math.max(scheduled - completed, 0)
}

// ---------- streaks ----------

export function calculateCurrentStreak(
  habits: Habit[],
  completions: Completion[]
): number {
  let streak = 0
  const cursor = new Date()

  // Walk backward day by day from today. A day counts toward the streak
  // if every habit scheduled that day was completed (or nothing was scheduled).
  // Stop at the first day that fails.
  for (let i = 0; i < 3650; i++) {
    const dateISO = toISODate(cursor)
    const { scheduled, completed } = scheduledCompletionsInRange(
      habits,
      completions,
      [dateISO]
    )

    if (scheduled > 0 && completed < scheduled) {
      // Today itself being incomplete-so-far shouldn't break the streak
      // if it's still in progress; only break on past days.
      if (i === 0) {
        cursor.setDate(cursor.getDate() - 1)
        continue
      }
      break
    }

    if (scheduled > 0) streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function calculateLongestStreak(
  habits: Habit[],
  completions: Completion[]
): number {
  if (completions.length === 0) return 0

  const allDates = Array.from(new Set(completions.map((c) => c.date))).sort()
  if (allDates.length === 0) return 0

  const first = new Date(allDates[0] + "T00:00:00")
  const last = new Date()

  let longest = 0
  let current = 0
  const cursor = new Date(first)

  while (cursor <= last) {
    const dateISO = toISODate(cursor)
    const { scheduled, completed } = scheduledCompletionsInRange(
      habits,
      completions,
      [dateISO]
    )

    if (scheduled > 0 && completed === scheduled) {
      current++
      longest = Math.max(longest, current)
    } else if (scheduled > 0) {
      current = 0
    }

    cursor.setDate(cursor.getDate() + 1)
  }

  return longest
}

export function calculateHabitStreak(
  habit: Habit,
  completions: Completion[]
): number {
  let streak = 0
  const cursor = new Date()

  for (let i = 0; i < 3650; i++) {
    const dateISO = toISODate(cursor)
    const scheduled = isScheduledOn(habit.frequency, dateISO)

    if (scheduled) {
      const record = completions.find(
        (c) => c.habitId === habit.id && c.date === dateISO
      )
      if (!record?.completed) {
        if (i === 0) {
          cursor.setDate(cursor.getDate() - 1)
          continue
        }
        break
      }
      streak++
    }

    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

// ---------- habit rankings ----------

export function calculateBestHabit(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): Habit | null {
  let best: Habit | null = null
  let bestPct = -1

  for (const habit of habits) {
    if (habit.archived) continue
    const { scheduled, completed } = scheduledCompletionsInRange(
      [habit],
      completions,
      monthDates
    )
    if (scheduled === 0) continue
    const pct = percent(completed, scheduled)
    if (pct > bestPct) {
      bestPct = pct
      best = habit
    }
  }

  return best
}

export function calculateWorstHabit(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): Habit | null {
  let worst: Habit | null = null
  let worstPct = 101

  for (const habit of habits) {
    if (habit.archived) continue
    const { scheduled, completed } = scheduledCompletionsInRange(
      [habit],
      completions,
      monthDates
    )
    if (scheduled === 0) continue
    const pct = percent(completed, scheduled)
    if (pct < worstPct) {
      worstPct = pct
      worst = habit
    }
  }

  return worst
}

// ---------- XP & levels ----------

export function calculateXP(
  habits: Habit[],
  completions: Completion[]
): number {
  let xp = 0
  for (const c of completions) {
    if (!c.completed) continue
    const habit = habits.find((h) => h.id === c.habitId)
    if (habit) xp += habit.xpValue
  }
  return xp
}

// Level thresholds: cumulative XP required to reach each level.
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800]

export function calculateLevel(xp: number): {
  level: number
  currentLevelXP: number
  nextLevelXP: number
} {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }

  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextLevelXP =
    LEVEL_THRESHOLDS[level] ?? currentLevelXP + 1000 // keep growing past the table

  return { level, currentLevelXP, nextLevelXP }
}