import { useEffect, useRef, useState } from "react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useSettings } from "../../hooks/useSettings"
import { useAchievements } from "../../hooks/useAchievements"
import { useNotificationLog } from "../../hooks/useNotificationLog"
import LevelUpOverlay from "../../components/dashboard/LevelUpOverlay"
import RankUpOverlay from "../../components/dashboard/RankUpOverlay"
import GatePanel from "../../components/dashboard/GatePanel"
import GateClearOverlay from "../../components/dashboard/GateClearOverlay"
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
import { getRank } from "../../utils/rank"
import { getSystemMessage } from "../../utils/systemMessage"
import { getNeglectedHabits } from "../../utils/penalty"
import { playQuestCompleteSound, playLevelUpSound } from "../../utils/sound"
import HabitGrid from "../../components/calendar/HabitGrid"
import TodayView from "../../components/dashboard/TodayView"
import StatusWindow from "../../components/dashboard/StatusWindow"
import SystemNotification from "../../components/dashboard/SystemNotification"
import StatAllocationPanel from "../../components/dashboard/StatAllocationPanel"
import NotificationLogPanel from "../../components/dashboard/NotificationLogPanel"
import { buildStatAllocations } from "../../utils/statMap"

export default function Dashboard() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded, isCompleted, toggleCompletion } = useCompletions()
  const { settings, loaded: settingsLoaded } = useSettings()
  const { achievements, loaded: achievementsLoaded, newlyUnlocked, clearNewlyUnlocked } = useAchievements(
    habits,
    completions
  )
  const { entries: logEntries, loaded: logLoaded, logEvent } = useNotificationLog()

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpValue, setLevelUpValue] = useState(1)
  const prevLevel = useRef<number | null>(null)

  const [showRankUp, setShowRankUp] = useState(false)
  const [rankUpInfo, setRankUpInfo] = useState<{ rank: string; title: string } | null>(null)
  const prevRank = useRef<string | null>(null)

  const [showGateClear, setShowGateClear] = useState(false)
  const prevGateCleared = useRef<boolean | null>(null)

  const [questNotif, setQuestNotif] = useState<{ message: string; subtext: string } | null>(null)
  const [questNotifVisible, setQuestNotifVisible] = useState(false)

  const allLoaded =
    habitsLoaded && completionsLoaded && settingsLoaded && achievementsLoaded && logLoaded

  const xp = allLoaded ? calculateXP(habits, completions) : 0
  const { level, currentLevelXP, nextLevelXP } = calculateLevel(xp)
  const rankInfo = getRank(level)
  const totalCompletedEarly = allLoaded ? calculateTotalCompleted(completions) : 0
  const goalEarly = settings.monthlyGoal
  const goalProgressEarly = goalEarly > 0 ? Math.min(100, Math.round((totalCompletedEarly / goalEarly) * 100)) : 0
  const gateCleared = goalProgressEarly >= 100

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
      logEvent("levelup", `Level Up! You're now Level ${level}`)
      prevLevel.current = level
      return
    }

    prevLevel.current = level
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, allLoaded, settings.soundEnabled])

  useEffect(() => {
    if (!allLoaded) return

    if (prevRank.current === null) {
      prevRank.current = rankInfo.rank
      return
    }

    if (rankInfo.rank !== prevRank.current) {
      setRankUpInfo({ rank: rankInfo.rank, title: rankInfo.title })
      setShowRankUp(true)
      if (settings.soundEnabled) playLevelUpSound()
      logEvent("levelup", `Rank Advanced: ${rankInfo.rank}-Rank Hunter`, rankInfo.title)
      prevRank.current = rankInfo.rank
      return
    }

    prevRank.current = rankInfo.rank
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankInfo.rank, allLoaded, settings.soundEnabled])

  useEffect(() => {
    if (!allLoaded) return

    if (prevGateCleared.current === null) {
      prevGateCleared.current = gateCleared
      return
    }

    if (gateCleared && !prevGateCleared.current) {
      setShowGateClear(true)
      if (settings.soundEnabled) playLevelUpSound()
      logEvent("achievement", "Gate Cleared", "Monthly goal fully completed")
    }

    prevGateCleared.current = gateCleared
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateCleared, allLoaded, settings.soundEnabled])

  useEffect(() => {
    if (!newlyUnlocked) return
    setQuestNotif({
      message: `Achievement Unlocked: ${newlyUnlocked.name}`,
      subtext: newlyUnlocked.description,
    })
    setQuestNotifVisible(true)
    logEvent("achievement", `Achievement Unlocked: ${newlyUnlocked.name}`, newlyUnlocked.description)
    const timer = setTimeout(() => {
      setQuestNotifVisible(false)
      clearNewlyUnlocked()
    }, 2800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newlyUnlocked])

  function handleQuestComplete(habitName: string, xpGained: number) {
    setQuestNotif({
      message: `Quest Complete: ${habitName}`,
      subtext: `+${xpGained} XP gained`,
    })
    setQuestNotifVisible(true)
    if (settings.soundEnabled) playQuestCompleteSound()
    logEvent("quest", `Quest Complete: ${habitName}`, `+${xpGained} XP gained`)
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
  const neglectedHabits = getNeglectedHabits(habits, completions, todayISOStr)

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
        <LevelUpOverlay level={levelUpValue} onDone={() => setShowLevelUp(false)} />
      )}

      {showRankUp && rankUpInfo && (
        <RankUpOverlay
          rank={rankUpInfo.rank}
          title={rankUpInfo.title}
          onDone={() => setShowRankUp(false)}
        />
      )}

      {showGateClear && (
        <GateClearOverlay onDone={() => setShowGateClear(false)} />
      )}

      <h1 className="text-2xl font-bold text-white">Habit Quest</h1>
      <p className="text-slate-400 mb-2">
        {getMonthName(month)} {year} · {todayISO()}
      </p>
      <p className="text-blue-400/90 text-sm font-mono mb-6">&gt; {systemMessage}</p>
      {neglectedHabits.length > 0 && (
        <p className="text-red-400/90 text-sm font-mono mb-6 -mt-4">
          &gt; Penalty: {neglectedHabits.length} quest{neglectedHabits.length === 1 ? "" : "s"} neglected yesterday.
        </p>
      )}

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
        completions={completions}
        isCompleted={isCompleted}
        toggleCompletion={toggleCompletion}
      />

      <StatAllocationPanel stats={statAllocations} />

      <GatePanel rank={rankInfo.rank} completed={totalCompleted} goal={goal} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="system-panel p-4 md:p-6">
          <p className="system-panel-header mb-4">Performance Ranking</p>
          <div className="space-y-3">
            {bestHabit ? (
              <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-900/30 rounded-lg px-3 py-2.5">
                <span className="text-xl">🥇</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{bestHabit.name}</p>
                  <p className="text-slate-500 text-xs">Top performer this month</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Not enough data yet.</p>
            )}
            {worstHabit && worstHabit.id !== bestHabit?.id && (
              <div className="flex items-center gap-3 bg-orange-500/5 border border-orange-900/30 rounded-lg px-3 py-2.5">
                <span className="text-xl">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{worstHabit.name}</p>
                  <p className="text-slate-500 text-xs">Needs attention</p>
                </div>
              </div>
            )}
          </div>
          <p className="font-display text-slate-400 text-xs mt-4 pt-4 border-t border-blue-900/20">
            {remaining} quests remaining this month
          </p>
        </div>

        <div className="system-panel p-4 md:p-6">
          <p className="system-panel-header mb-4">Recent Titles</p>
          {recentAchievements.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Complete quests to unlock titles.
            </p>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 bg-blue-500/5 border border-blue-900/30 rounded-lg px-3 py-2.5"
                >
                  <span className="text-xl">🏆</span>
                  <p className="text-white text-sm font-medium truncate">{a.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NotificationLogPanel entries={logEntries} />

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










