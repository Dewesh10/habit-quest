import type { Habit, Completion } from "../types"
import { isScheduledOn, toISODate, getMonthDates } from "./date"
import {
  calculateHabitStreak,
  calculateOverallCompletion,
  calculateCurrentStreak,
  calculateTotalCompleted,
} from "./stats"

// ---------- weekly trend ----------

export interface WeekPoint {
  weekLabel: string
  scheduled: number
  completed: number
  percent: number
}

// Last N weeks (including current, partial), Sunday-start.
export function getRecentWeeklyTrend(
  habits: Habit[],
  completions: Completion[],
  weeks = 4
): WeekPoint[] {
  const points: WeekPoint[] = []
  const today = new Date()
  const todayWeekday = today.getDay()
  const thisWeekStart = new Date(today)
  thisWeekStart.setDate(today.getDate() - todayWeekday)

  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = new Date(thisWeekStart)
    weekStart.setDate(thisWeekStart.getDate() - w * 7)

    let scheduled = 0
    let completed = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      if (d > today) continue
      const iso = toISODate(d)
      for (const habit of habits) {
        if (habit.archived) continue
        if (!isScheduledOn(habit.frequency, iso)) continue
        scheduled++
        if (completions.some((c) => c.habitId === habit.id && c.date === iso && c.completed)) {
          completed++
        }
      }
    }

    points.push({
      weekLabel: w === 0 ? "This week" : `${w} week${w > 1 ? "s" : ""} ago`,
      scheduled,
      completed,
      percent: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
    })
  }

  return points
}

export function getTrendDirection(points: WeekPoint[]): "improving" | "declining" | "steady" | "not-enough-data" {
  const withData = points.filter((p) => p.scheduled > 0)
  if (withData.length < 2) return "not-enough-data"
  const first = withData[0].percent
  const last = withData[withData.length - 1].percent
  const diff = last - first
  if (diff >= 8) return "improving"
  if (diff <= -8) return "declining"
  return "steady"
}

// ---------- category performance ----------

export interface CategoryStat {
  category: string
  scheduled: number
  completed: number
  percent: number
}

export function getCategoryPerformance(
  habits: Habit[],
  completions: Completion[],
  dates: string[]
): CategoryStat[] {
  const map = new Map<string, { scheduled: number; completed: number }>()

  for (const habit of habits) {
    if (habit.archived) continue
    const entry = map.get(habit.category) ?? { scheduled: 0, completed: 0 }
    for (const dateISO of dates) {
      if (!isScheduledOn(habit.frequency, dateISO)) continue
      entry.scheduled++
      if (completions.some((c) => c.habitId === habit.id && c.date === dateISO && c.completed)) {
        entry.completed++
      }
    }
    map.set(habit.category, entry)
  }

  return Array.from(map.entries())
    .map(([category, { scheduled, completed }]) => ({
      category,
      scheduled,
      completed,
      percent: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
    }))
    .filter((c) => c.scheduled > 0)
    .sort((a, b) => b.percent - a.percent)
}

// ---------- weak / strong habits ----------

export interface HabitRisk {
  habit: Habit
  daysSinceCompletion: number | null
  streak: number
}

export function getHabitsAtRisk(
  habits: Habit[],
  completions: Completion[]
): HabitRisk[] {
  const today = new Date()
  const results: HabitRisk[] = []

  for (const habit of habits) {
    if (habit.archived) continue
    const habitCompletions = completions
      .filter((c) => c.habitId === habit.id && c.completed)
      .sort((a, b) => (a.date < b.date ? 1 : -1))

    let daysSince: number | null = null
    if (habitCompletions.length > 0) {
      const last = new Date(habitCompletions[0].date + "T00:00:00")
      daysSince = Math.round((today.getTime() - last.getTime()) / 86400000)
    }

    const streak = calculateHabitStreak(habit, completions)
    results.push({ habit, daysSinceCompletion: daysSince, streak })
  }

  return results
    .filter((r) => r.daysSinceCompletion === null || r.daysSinceCompletion >= 2)
    .sort((a, b) => (b.daysSinceCompletion ?? 99) - (a.daysSinceCompletion ?? 99))
}

// ---------- goal pace projection ----------

export interface GoalProjection {
  onTrack: boolean
  projectedTotal: number
  daysElapsed: number
  daysRemaining: number
  currentPace: number
}

export function projectMonthlyGoal(
  habits: Habit[],
  completions: Completion[],
  goal: number
): GoalProjection {
  const today = new Date()
  const monthDates = getMonthDates(today.getFullYear(), today.getMonth())
  const daysElapsed = today.getDate()
  const daysInMonth = monthDates.length
  const daysRemaining = daysInMonth - daysElapsed

  const totalCompleted = calculateTotalCompleted(
    completions.filter((c) => monthDates.includes(c.date))
  )

  const currentPace = daysElapsed > 0 ? totalCompleted / daysElapsed : 0
  const projectedTotal = Math.round(totalCompleted + currentPace * daysRemaining)

  return {
    onTrack: projectedTotal >= goal,
    projectedTotal,
    daysElapsed,
    daysRemaining,
    currentPace: Math.round(currentPace * 10) / 10,
  }
}

// ---------- best/worst day of week ----------

export interface DayOfWeekStat {
  weekday: number
  label: string
  percent: number
}

const WEEKDAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function getDayOfWeekPerformance(
  habits: Habit[],
  completions: Completion[],
  lookbackDates: string[]
): DayOfWeekStat[] {
  const buckets: { scheduled: number; completed: number }[] = Array.from({ length: 7 }, () => ({
    scheduled: 0,
    completed: 0,
  }))

  for (const dateISO of lookbackDates) {
    const weekday = new Date(dateISO + "T00:00:00").getDay()
    for (const habit of habits) {
      if (habit.archived) continue
      if (!isScheduledOn(habit.frequency, dateISO)) continue
      buckets[weekday].scheduled++
      if (completions.some((c) => c.habitId === habit.id && c.date === dateISO && c.completed)) {
        buckets[weekday].completed++
      }
    }
  }

  return buckets
    .map((b, i) => ({
      weekday: i,
      label: WEEKDAY_LABELS[i],
      percent: b.scheduled > 0 ? Math.round((b.completed / b.scheduled) * 100) : 0,
    }))
    .filter((d) => {
      const bucket = buckets[d.weekday]
      return bucket.scheduled > 0
    })
}

// ---------- full context bundle ----------

export interface UserInsightContext {
  overallCompletion: number
  currentStreak: number
  totalCompleted: number
  weeklyTrend: WeekPoint[]
  trendDirection: ReturnType<typeof getTrendDirection>
  categoryPerformance: CategoryStat[]
  habitsAtRisk: HabitRisk[]
  goalProjection: GoalProjection
  dayOfWeekPerformance: DayOfWeekStat[]
}

export function buildUserContext(
  habits: Habit[],
  completions: Completion[],
  monthlyGoal: number
): UserInsightContext {
  const today = new Date()
  const monthDates = getMonthDates(today.getFullYear(), today.getMonth())
  const weeklyTrend = getRecentWeeklyTrend(habits, completions, 4)

  return {
    overallCompletion: calculateOverallCompletion(habits, completions),
    currentStreak: calculateCurrentStreak(habits, completions),
    totalCompleted: calculateTotalCompleted(completions),
    weeklyTrend,
    trendDirection: getTrendDirection(weeklyTrend),
    categoryPerformance: getCategoryPerformance(habits, completions, monthDates),
    habitsAtRisk: getHabitsAtRisk(habits, completions),
    goalProjection: projectMonthlyGoal(habits, completions, monthlyGoal),
    dayOfWeekPerformance: getDayOfWeekPerformance(habits, completions, monthDates),
  }
}
