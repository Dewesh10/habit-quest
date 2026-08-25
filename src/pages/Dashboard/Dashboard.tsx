import { useEffect, useRef, useState } from "react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useSettings } from "../../hooks/useSettings"
import { useAchievements } from "../../hooks/useAchievements"
import { getMonthDates, getMonthName, todayISO } from "../../utils/date"
import {
  calculateOverallCompletion,
  calculateTotalCompleted,
  calculateRemaining,
  calculateCurrentStreak,
  calculateXP,
  calculateLevel,
  calculateBestHabit,
  calculateWorstHabit,
} from "../../utils/stats"
import HabitGrid from "../../components/calendar/HabitGrid"

export default function Dashboard() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()
  const { settings, loaded: settingsLoaded } = useSettings()
  const { achievements, loaded: achievementsLoaded } = useAchievements(
    habits,
    completions
  )

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpValue, setLevelUpValue] = useState(1)
  const prevLevel = useRef<number | null>(null)

  const allLoaded =
    habitsLoaded && completionsLoaded && settingsLoaded && achievementsLoaded

  const xp = allLoaded ? calculateXP(habits, completions) : 0
  const { level, currentLevelXP, nextLevelXP } = calculateLevel(xp)

  useEffect(() => {
    if (!allLoaded) return

    if (prevLevel.current === null) {
      prevLevel.current = level
      return
    }

    if (level > prevLevel.current) {
      setLevelUpValue(level)
      setShowLevelUp(true)
      const timer = setTimeout(() => setShowLevelUp(false), 3000)
      prevLevel.current = level
      return () => clearTimeout(timer)
    }

    prevLevel.current = level
  }, [level, allLoaded])

  if (!allLoaded) {
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

  const bestHabit = calculateBestHabit(habits, completions, monthDates)
  const worstHabit = calculateWorstHabit(habits, completions, monthDates)

  const goal = settings.monthlyGoal
  const goalProgress = goal > 0 ? Math.min(100, Math.round((totalCompleted / goal) * 100)) : 0

  const recentAchievements = achievements
    .filter((a) => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt! > a.unlockedAt! ? 1 : -1))
    .slice(0, 3)

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
      {showLevelUp && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 font-semibold px-5 py-3 rounded-xl shadow-lg animate-pulse">
          🎉 Level Up! You're now Level {levelUpValue}
        </div>
      )}

      <h1 className="text-2xl font-bold text-white">Habit Quest</h1>
      <p className="text-slate-400 mb-6">
        {getMonthName(month)} {year} · {todayISO()}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
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

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white">Monthly Goal</span>
          <span className="text-xs text-slate-400">
            {totalCompleted} / {goal} ({goalProgress}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-white mb-3">Top Habits</p>
          {bestHabit ? (
            <p className="text-slate-300 text-sm">
              🥇 {bestHabit.name}
            </p>
          ) : (
            <p className="text-slate-500 text-sm">Not enough data yet.</p>
          )}
          {worstHabit && worstHabit.id !== bestHabit?.id && (
            <p className="text-slate-500 text-xs mt-2">
              Needs attention: {worstHabit.name}
            </p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-white mb-3">Recent Achievements</p>
          {recentAchievements.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Complete habits to unlock achievements.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentAchievements.map((a) => (
                <p key={a.id} className="text-slate-300 text-xs">
                  🏆 {a.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <HabitGrid year={year} month={month} />
    </div>
  )
}