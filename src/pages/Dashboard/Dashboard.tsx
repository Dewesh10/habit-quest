import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { getMonthDates, getMonthName, todayISO } from "../../utils/date"
import {
  calculateOverallCompletion,
  calculateTotalCompleted,
  calculateRemaining,
  calculateCurrentStreak,
  calculateXP,
  calculateLevel,
} from "../../utils/stats"
import HabitGrid from "../../components/calendar/HabitGrid"

export default function Dashboard() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()

  if (!habitsLoaded || !completionsLoaded) {
    return <p className="text-slate-400">Loading...</p>
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthDates = getMonthDates(year, month)

  const overallCompletion = calculateOverallCompletion(habits, completions)
  const totalCompleted = calculateTotalCompleted(completions)
  const remaining = calculateRemaining(habits, completions, monthDates)
  const currentStreak = calculateCurrentStreak(habits, completions)
  const xp = calculateXP(habits, completions)
  const { level, currentLevelXP, nextLevelXP } = calculateLevel(xp)

  const stats = [
    { label: "Overall Completion", value: `${overallCompletion}%` },
    { label: "Completed", value: totalCompleted },
    { label: "Remaining", value: remaining },
    { label: "Current Streak", value: `${currentStreak} days` },
    { label: "XP", value: xp.toLocaleString() },
    { label: "Level", value: level },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Habit Quest</h1>
      <p className="text-slate-400 mb-6">
        {getMonthName(month)} {year} · {todayISO()}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className="text-xl font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white">Level {level}</span>
          <span className="text-xs text-slate-400">
            {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500"
            style={{
              width: `${Math.min(
                100,
                ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
              )}%`,
            }}
          />
        </div>
      </div>

      <HabitGrid year={year} month={month} />
    </div>
  )
}