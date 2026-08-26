import type { Habit, Completion } from "../types"
import { isScheduledOn, toISODate } from "./date"

export interface DailyChartPoint {
  date: string
  label: string
  completed: number
  total: number
  percent: number
}

export interface WeeklyChartPoint {
  label: string
  completed: number
  total: number
  percent: number
}

export interface CategoryChartPoint {
  category: string
  percent: number
}

export interface HabitComparisonPoint {
  name: string
  percent: number
}

export interface XPProgressionPoint {
  date: string
  label: string
  xp: number
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

export function buildCategoryChartData(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): CategoryChartPoint[] {
  const byCategory = new Map<string, { completed: number; total: number }>()

  for (const habit of habits) {
    if (habit.archived) continue
    const bucket = byCategory.get(habit.category) ?? { completed: 0, total: 0 }

    for (const dateISO of monthDates) {
      if (!isScheduledOn(habit.frequency, dateISO)) continue
      bucket.total++
      const record = completions.find(
        (c) => c.habitId === habit.id && c.date === dateISO
      )
      if (record?.completed) bucket.completed++
    }

    byCategory.set(habit.category, bucket)
  }

  return Array.from(byCategory.entries())
    .map(([category, { completed, total }]) => ({
      category,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent)
}

export function buildHabitComparisonData(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): HabitComparisonPoint[] {
  return habits
    .filter((h) => !h.archived)
    .map((habit) => {
      let completed = 0
      let total = 0
      for (const dateISO of monthDates) {
        if (!isScheduledOn(habit.frequency, dateISO)) continue
        total++
        const record = completions.find(
          (c) => c.habitId === habit.id && c.date === dateISO
        )
        if (record?.completed) completed++
      }
      return {
        name: habit.name,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      }
    })
    .sort((a, b) => b.percent - a.percent)
}

export function buildXPProgressionData(
  habits: Habit[],
  completions: Completion[],
  monthDates: string[]
): XPProgressionPoint[] {
  let cumulativeXP = 0

  return monthDates.map((dateISO) => {
    const dayCompletions = completions.filter(
      (c) => c.date === dateISO && c.completed
    )
    for (const c of dayCompletions) {
      const habit = habits.find((h) => h.id === c.habitId)
      if (habit) cumulativeXP += habit.xpValue
    }
    const day = Number(dateISO.slice(-2))
    return { date: dateISO, label: String(day), xp: cumulativeXP }
  })
}

export { toISODate }
export interface HeatmapPoint {
  date: string
  completed: number
  total: number
  percent: number
}

export function buildHeatmapData(
  habits: Habit[],
  completions: Completion[],
  dates: string[]
): HeatmapPoint[] {
  return dates.map((dateISO) => {
    const { completed, total } = statsForDate(habits, completions, dateISO)
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { date: dateISO, completed, total, percent }
  })
}
