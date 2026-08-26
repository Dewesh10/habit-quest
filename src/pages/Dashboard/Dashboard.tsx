import { useEffect, useRef, useState } from "react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useSettings } from "../../hooks/useSettings"
import { useAchievements } from "../../hooks/useAchievements"
import { getMonthDates, getMonthName, todayISO, isScheduledOn } from "../../utils/date"
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
import { getSystemMessage } from "../../utils/systemMessage"
import { playQuestCompleteSound, playLevelUpSound } from "../../utils/sound"
import HabitGrid from "../../components/calendar/HabitGrid"
import TodayView from "../../components/dashboard/TodayView"
import StatusWindow from "../../components/dashboard/StatusWindow"
import SystemNotification from "../../components/dashboard/SystemNotification"
import StatAllocationPanel from "../../components/dashboard/StatAllocationPanel"
import { buildStatAllocations } from "../../utils/statMap"

export default function Dashboard() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded, isCompleted, toggleCompletion } = useCompletions()
  const { settings, loaded: settingsLoaded } = useSettings()
  const { achievements, loaded: achievementsLoaded, newlyUnlocked, clearNewlyUnlocked } = useAchievements(
    habits,
    completions
  )

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpValue, setLevelUpValue] = useState(1)
  const prevLevel = useRef<number | null>(null)

  const [questNotif, setQuestNotif] = useState<{ message: string; subtext: string } | null>(null)
  const [questNotifVisible, setQuestNotifVisible] = useState(false)

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
      if (settings.soundEnabled) playLevelUpSound()
      const timer = setTimeout(() => setShowLevelUp(false), 3000)
      prevLevel.current = level
      return () => clearTimeout(timer)
    }

    prevLevel.current = level
  }, [level, allLoaded, settings.soundEnabled])

  useEffect(() => {
    if (!newlyUnlocked) return
    setQuestNotif({
      message: `Achievement Unlocked: ${newlyUnlocked.name}`,
      subtext: newlyUnlocked.description,
    })
    setQuestNotifVisible(true)
    const timer = setTimeout(() => {
      setQuestNotifVisible(false)
      clearNewlyUnlocked()
    }, 2800)
    return () => clearTimeout(timer)
  }, [newlyUnlocked])

  function handleQuestComplete(habitName: string, xpGained: number) {
    setQuestNotif({
      message: `Quest Complete: ${habitName}`,
      subtext: `+${xpGained} XP gained`,
    })
    setQuestNotifVisible(true)
    if (settings.soundEnabled) playQuestCompleteSound()
    setTimeout(() => setQuestNotifVisible(false), 2200)
  }

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

  const todayISOStr = todayISO()
  const todaysHabits = habits.filter((h) => !h.archived && isScheduledOn(h.frequency, todayISOStr))
  const todaysDone = todaysHabits.filter((h) =>
    completions.some((c) => c.habitId === h.id && c.date === todayISOStr && c.completed)
  ).length
  const systemMessage = getSystemMessage(currentStreak, todaysDone, todaysHabits.length)

  const bestHabit = calculateBestHabit(habits, completions, monthDates)
  const worstHabit = calculateWorstHabit(habits, completions, monthDates)
  const completedCountByCategory = new Map<string, number>()
  for (const c of completions) {
    if (!c.completed) continue
    const habit = habits.find((h) => h.id === c.habitId)
    if (!habit) continue
    completedCountByCategory.set(
      habit.category,
      (completedCountByCategory.get(habit.category) ?? 0) + 1
    )
  }
  const statAllocations = buildStatAllocations(habits, completedCountByCategory)

  const goal = settings.monthlyGoal
  const goalProgress = goal > 0 ? Math.min(100, Math.round((totalCompleted / goal) * 100)) : 0

  const recentAchievements = achievements
    .filter((a) => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt! > a.unlockedAt! ? 1 : -1))
    .slice(0, 3)

  return (
    <div>
      {questNotif && (
        <SystemNotification
          message={questNotif.message}
          subtext={questNotif.subtext}
          visible={questNotifVisible}
        />
      )}

      {showLevelUp && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 system-panel px-6 py-3 shadow-[0_0_30px_rgba(56,189,248,0.6)] text-center">
          <p className="system-panel-header mb-1">System Alert</p>
          <p className="text-white font-semibold">
            ?? Level Up! You're now Level {levelUpValue}
          </p>
        </div>
      )}

      <h1 className="text-2xl font-bold text-white">Habit Quest</h1>
      <p className="text-slate-400 mb-2">
        {getMonthName(month)} {year} · {todayISO()}
      </p>
      <p className="text-blue-400/90 text-sm font-mono mb-6">&gt; {systemMessage}</p>

      <StatusWindow
        level={level}
        xp={xp}
        currentLevelXP={currentLevelXP}
        nextLevelXP={nextLevelXP}
        overallCompletion={overallCompletion}
        currentStreak={currentStreak}
        totalCompleted={totalCompleted}
        equippedTitle={achievements.find((a) => a.id === settings.equippedTitle)?.title ?? null}
      />

      <TodayView
        habits={habits}
        isCompleted={isCompleted}
        toggleCompletion={toggleCompletion}
      />

      <StatAllocationPanel stats={statAllocations} />

      <div className="system-panel p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="system-panel-header">Monthly Goal</span>
          <span className="text-xs text-slate-400 font-mono">
            {totalCompleted} / {goal} ({goalProgress}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
            style={{ width: `${goalProgress}%`, boxShadow: "0 0 8px rgba(56,189,248,0.7)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="system-panel p-4">
          <p className="system-panel-header mb-3">Top Habits</p>
          {bestHabit ? (
            <p className="text-slate-300 text-sm">?? {bestHabit.name}</p>
          ) : (
            <p className="text-slate-500 text-sm">Not enough data yet.</p>
          )}
          {worstHabit && worstHabit.id !== bestHabit?.id && (
            <p className="text-slate-500 text-xs mt-2">
              Needs attention: {worstHabit.name}
            </p>
          )}
          <p className="text-slate-500 text-xs mt-2">Remaining this month: {remaining}</p>
        </div>

        <div className="system-panel p-4">
          <p className="system-panel-header mb-3">Recent Achievements</p>
          {recentAchievements.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Complete habits to unlock achievements.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentAchievements.map((a) => (
                <p key={a.id} className="text-slate-300 text-xs">
                  ?? {a.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <HabitGrid
        year={year}
        month={month}
        habits={habits}
        isCompleted={isCompleted}
        toggleCompletion={toggleCompletion}
        onComplete={handleQuestComplete}
      />
    </div>
  )
}
