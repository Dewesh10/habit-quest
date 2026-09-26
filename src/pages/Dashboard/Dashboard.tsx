import { useEffect, useRef, useState } from "react"
import { Trophy, AlertTriangle } from "lucide-react"

import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useSettings } from "../../hooks/useSettings"
import { useAchievements } from "../../hooks/useAchievements"
import { useNotificationLog } from "../../hooks/useNotificationLog"
import { useHunterSystem } from "../../hooks/useHunterSystem"

import LevelUpOverlay from "../../components/dashboard/LevelUpOverlay"
import RankUpOverlay from "../../components/dashboard/RankUpOverlay"
import GatePanel from "../../components/dashboard/GatePanel"
import GateClearOverlay from "../../components/dashboard/GateClearOverlay"
import DailyQuestPanel from "../../components/dashboard/DailyQuestPanel"
import PenaltyZoneOverlay from "../../components/dashboard/PenaltyZoneOverlay"
import CollegeSystemPanel from "../../components/dashboard/CollegeSystemPanel"
import CustomRoutineModal from "../../components/dashboard/CustomRoutineModal"

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
import { soundEngine } from "../../utils/soundEngine"

import HabitGrid from "../../components/calendar/HabitGrid"
import TodayView from "../../components/dashboard/TodayView"
import StatusWindow from "../../components/dashboard/StatusWindow"
import SystemNotification from "../../components/dashboard/SystemNotification"
import StatAllocationPanel from "../../components/dashboard/StatAllocationPanel"
import NotificationLogPanel from "../../components/dashboard/NotificationLogPanel"
import { buildStatAllocations } from "../../utils/statMap"
import type { CollegeProfile } from "../../types"

export default function Dashboard() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded, isCompleted, toggleCompletion } = useCompletions()
  const { settings, loaded: settingsLoaded } = useSettings()
  const { achievements, loaded: achievementsLoaded, newlyUnlocked, clearNewlyUnlocked } = useAchievements(
    habits,
    completions
  )
  const { entries: logEntries, loaded: logLoaded, logEvent } = useNotificationLog()

  const {
    stats,
    dailyQuests,
    penalty,
    allocateAP,
    awardAP,
    addGold,
    incrementDailyQuest,
    triggerPenalty,
    progressPenaltyQuest,
    clearPenalty,
    getCombatPower,
  } = useHunterSystem()

  // College Profile State
  const [collegeProfile, setCollegeProfile] = useState<CollegeProfile>(() => {
    const saved = localStorage.getItem("hq-college-profile")
    if (saved) {
      try { return JSON.parse(saved) as CollegeProfile } catch {}
    }
    return {
      major: "Computer Science & Engineering",
      year: "2nd Year",
      targetGPA: 3.8,
      dailyStudyGoalHours: 3,
      academicQuests: [
        {
          id: "acad-attendance-1",
          title: "Attend All Lectures & Classes Today",
          category: "Attendance",
          hoursTarget: 2,
          hoursCompleted: 0,
          completed: false,
          intReward: 2,
          goldReward: 60,
        },
        {
          id: "acad-study-1",
          title: "Deep Study Block (Revision / Coding)",
          category: "Study Block",
          hoursTarget: 3,
          hoursCompleted: 0,
          completed: false,
          intReward: 3,
          goldReward: 100,
        },
        {
          id: "acad-assignment-1",
          title: "Complete Assignment Milestone / Sprint",
          category: "Assignment",
          hoursTarget: 1,
          hoursCompleted: 0,
          completed: false,
          intReward: 2,
          goldReward: 80,
        },
      ],
      examGates: [
        {
          id: "exam-midterms",
          name: "Midterm Examinations Gate",
          type: "Midterms Raid",
          difficulty: "A-Rank",
          requiredStudyHours: 15,
          currentStudyHours: 4,
          cleared: false,
          gpaBoost: 0.2,
        },
        {
          id: "exam-finals",
          name: "Semester Finals S-Rank Gate",
          type: "Finals S-Rank Gate",
          difficulty: "S-Rank",
          requiredStudyHours: 30,
          currentStudyHours: 8,
          cleared: false,
          gpaBoost: 0.4,
        },
      ],
    }
  })

  useEffect(() => {
    localStorage.setItem("hq-college-profile", JSON.stringify(collegeProfile))
  }, [collegeProfile])

  const [routineModalOpen, setRoutineModalOpen] = useState(false)

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

  const combatPower = getCombatPower(level)

  // Level up trigger
  useEffect(() => {
    if (!allLoaded) return

    if (prevLevel.current === null) {
      prevLevel.current = level
      return
    }

    if (level > prevLevel.current) {
      setLevelUpValue(level)
      setShowLevelUp(true)
      awardAP(3)
      if (settings.soundEnabled) soundEngine.playLevelUpFanfare()
      logEvent("levelup", `Level Up! You're now Level ${level}`)
      prevLevel.current = level
      return
    }

    prevLevel.current = level
  }, [level, allLoaded, settings.soundEnabled, awardAP, logEvent])

  // Rank up trigger
  useEffect(() => {
    if (!allLoaded) return

    if (prevRank.current === null) {
      prevRank.current = rankInfo.rank
      return
    }

    if (rankInfo.rank !== prevRank.current) {
      setRankUpInfo({ rank: rankInfo.rank, title: rankInfo.title })
      setShowRankUp(true)
      if (settings.soundEnabled) soundEngine.playLevelUpFanfare()
      logEvent("levelup", `Rank Advanced: ${rankInfo.rank}-Rank Hunter`, rankInfo.title)
      prevRank.current = rankInfo.rank
      return
    }

    prevRank.current = rankInfo.rank
  }, [rankInfo.rank, allLoaded, settings.soundEnabled, logEvent])

  // Gate clear trigger
  useEffect(() => {
    if (!allLoaded) return

    if (prevGateCleared.current === null) {
      prevGateCleared.current = gateCleared
      return
    }

    if (gateCleared && !prevGateCleared.current) {
      setShowGateClear(true)
      if (settings.soundEnabled) soundEngine.playLevelUpFanfare()
      logEvent("achievement", "Gate Cleared", "Monthly goal fully completed")
    }

    prevGateCleared.current = gateCleared
  }, [gateCleared, allLoaded, settings.soundEnabled, logEvent])

  // Achievements unlock trigger
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
  }, [newlyUnlocked, clearNewlyUnlocked, logEvent])

  function handleQuestComplete(habitName: string, xpGained: number) {
    setQuestNotif({
      message: `Quest Complete: ${habitName}`,
      subtext: `+${xpGained} XP gained`,
    })
    setQuestNotifVisible(true)
    if (settings.soundEnabled) soundEngine.playQuestChime()
    logEvent("quest", `Quest Complete: ${habitName}`, `+${xpGained} XP gained`)
    setTimeout(() => setQuestNotifVisible(false), 2200)
  }

  function handleCompleteAcademicQuest(questId: string) {
    setCollegeProfile((prev) => {
      const target = prev.academicQuests.find((q) => q.id === questId)
      if (target && !target.completed) {
        soundEngine.playQuestChime()
        addGold(target.goldReward)
      }
      return {
        ...prev,
        academicQuests: prev.academicQuests.map((q) =>
          q.id === questId ? { ...q, completed: true } : q
        ),
      }
    })
  }

  function handleProgressExamGate(gateId: string, hours: number) {
    setCollegeProfile((prev) => ({
      ...prev,
      examGates: prev.examGates.map((g) => {
        if (g.id === gateId) {
          const nextProg = Math.min(g.requiredStudyHours, g.currentStudyHours + hours)
          const isDone = nextProg >= g.requiredStudyHours
          if (isDone && !g.cleared) {
            soundEngine.playLevelUpFanfare()
            addGold(500)
          }
          return { ...g, currentStudyHours: nextProg, cleared: isDone }
        }
        return g
      }),
    }))
  }

  if (!allLoaded) {
    return <p className="text-slate-400 font-mono p-6">&gt; Initializing System...</p>
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

  const recentAchievements = achievements
    .filter((a) => a.unlockedAt)
    .sort((a, b) => (b.unlockedAt! > a.unlockedAt! ? 1 : -1))
    .slice(0, 3)

  return (
    <div>
      {/* Penalty Warning Overlay */}
      <PenaltyZoneOverlay
        penalty={penalty}
        onProgressPenalty={progressPenaltyQuest}
        onClearPenalty={clearPenalty}
      />

      {/* Routine Customizer Modal */}
      <CustomRoutineModal
        open={routineModalOpen}
        currentMajor={collegeProfile.major}
        onSave={(config) => {
          setCollegeProfile((prev) => ({
            ...prev,
            major: config.major,
            dailyStudyGoalHours: config.dailyStudyGoalHours,
          }))
        }}
        onClose={() => setRoutineModalOpen(false)}
      />

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white uppercase tracking-wider">
            Solo Leveling System
          </h1>
          <p className="text-slate-400 text-xs font-mono">
            {getMonthName(month)} {year} &middot; {todayISO()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoutineModalOpen(true)}
            className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-mono text-xs uppercase hover:bg-cyan-500/30 transition-all"
          >
            CUSTOM ROUTINE PERSONALIZER
          </button>

          {neglectedHabits.length > 0 && !penalty.active && (
            <button
              onClick={() => triggerPenalty(`${neglectedHabits.length} quests neglected yesterday.`)}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded font-mono text-xs uppercase animate-pulse"
            >
              TRIGGER PENALTY
            </button>
          )}
        </div>
      </div>

      <p className="text-cyan-400 text-xs font-mono mb-6">&gt; {systemMessage}</p>

      {/* Upgraded Hunter Status Window */}
      <StatusWindow
        level={level}
        xp={xp}
        currentLevelXP={currentLevelXP}
        nextLevelXP={nextLevelXP}
        overallCompletion={overallCompletion}
        currentStreak={currentStreak}
        totalCompleted={totalCompleted}
        equippedTitle={achievements.find((a) => a.id === settings.equippedTitle)?.title ?? null}
        stats={stats}
        combatPower={combatPower}
        penalty={penalty}
        onAllocateAP={allocateAP}
      />

      {/* Dedicated College Student System HUD */}
      <CollegeSystemPanel
        profile={collegeProfile}
        onUpdateProfile={(updated) => setCollegeProfile((prev) => ({ ...prev, ...updated }))}
        onCompleteAcademicQuest={handleCompleteAcademicQuest}
        onProgressExamGate={handleProgressExamGate}
      />

      {/* Fixed Non-skippable Daily Quests */}
      <DailyQuestPanel quests={dailyQuests} onIncrement={incrementDailyQuest} />

      {/* Today's User Quests */}
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
                <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{bestHabit.name}</p>
                  <p className="text-slate-500 text-xs">Top performer this month</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm font-mono">Not enough data yet.</p>
            )}
            {worstHabit && worstHabit.id !== bestHabit?.id && (
              <div className="flex items-center gap-3 bg-orange-500/5 border border-orange-900/30 rounded-lg px-3 py-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{worstHabit.name}</p>
                  <p className="text-slate-500 text-xs">Needs attention</p>
                </div>
              </div>
            )}
          </div>
          <p className="font-mono text-slate-400 text-xs mt-4 pt-4 border-t border-blue-900/20">
            {remaining} quests remaining this month
          </p>
        </div>

        <div className="system-panel p-4 md:p-6">
          <p className="system-panel-header mb-4">Recent Titles</p>
          {recentAchievements.length === 0 ? (
            <p className="text-slate-500 text-sm font-mono">
              Complete quests to unlock titles.
            </p>
          ) : (
            <div className="space-y-3">
              {recentAchievements.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 bg-blue-500/5 border border-blue-900/30 rounded-lg px-3 py-2.5"
                >
                  <Trophy className="w-5 h-5 text-cyan-400 shrink-0" />
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
