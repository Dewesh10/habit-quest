import { isScheduledOn, toISODate } from "./date"
import type { Habit, Completion } from "../types"

// A habit is "neglected" if it was scheduled yesterday and was not completed.
// This drives the penalty/warning visual state — a light nudge, checked fresh each day.
export function isNeglected(
  habit: Habit,
  completions: Completion[],
  todayISO: string
): boolean {
  const yesterday = new Date(todayISO + "T00:00:00")
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = toISODate(yesterday)

  if (!isScheduledOn(habit.frequency, yesterdayISO)) return false

  const wasCompleted = completions.some(
    (c) => c.habitId === habit.id && c.date === yesterdayISO && c.completed
  )
  return !wasCompleted
}

export function getNeglectedHabits(
  habits: Habit[],
  completions: Completion[],
  todayISO: string
): Habit[] {
  return habits.filter(
    (h) => !h.archived && isNeglected(h, completions, todayISO)
  )
}
