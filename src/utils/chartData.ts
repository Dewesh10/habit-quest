import type { Habit, Completion } from "../types"
import { isScheduledOn, toISODate } from "./date"

export interface DailyChartPoint {
  date: string       // ISO date
  label: string       // short day label, e.g. "24"
  completed: number
  total: number
  percent: number
}

export interface WeeklyChartPoint {
  label: string       // "Week 1", "Week 2", ...
  completed: number
  total: number
  percent: number
}

function statsForDate(
  habits: Habit[],
  completions: Completion[],
  dateISO: string
): { completed: number; total: number } {
  let total = 0
  let completed = 0

  for (const habit of habits) {
    if (habit.archived) continue
    if (!isScheduledOn(habit.frequency, dateISO)) continue
    total++
    const record = completions.find(
      (c) => c.habitId === habit.id && c.date === dateISO
    )
    if (record?.completed) completed++
  }

  return { completed, total }
}

export function buildDailyChartData(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): DailyChartPoint[] {
  return monthDates.map((dateISO) => {
    const { completed, total } = statsForDate(habits, completions, dateISO)
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    const day = Number(dateISO.slice(-2))
    return { date: dateISO, label: String(day), completed, total, percent }
  })
}

export function buildWeeklyChartData(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): WeeklyChartPoint[] {
  // Group the month's dates into calendar weeks (chunks of up to 7),
  // starting from the first date. Handles months that start/end mid-week.
  const weeks: string[][] = []
  let currentWeek: string[] = []

  for (const dateISO of monthDates) {
    const weekday = new Date(dateISO + "T00:00:00").getDay()
    if (weekday === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(dateISO)
  }
  if (currentWeek.length > 0) weeks.push(currentWeek)

  return weeks.map((weekDates, i) => {
    let completed = 0
    let total = 0
    for (const dateISO of weekDates) {
      const stats = statsForDate(habits, completions, dateISO)
      completed += stats.completed
      total += stats.total
    }
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { label: `Week ${i + 1}`, completed, total, percent }
  })
}

export { toISODate }