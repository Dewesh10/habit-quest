import { useState } from "react"
import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { getHabitColorClasses } from "../../utils/colorMap"
import { getDifficulty } from "../../utils/difficulty"
import Modal from "../../components/common/Modal"
import HabitForm from "../../components/habits/HabitForm"
import CornerBrackets from "../../components/common/CornerBrackets"
import HabitsSkeleton from "../../components/habits/HabitsSkeleton"
import { isScheduledOn, toISODate } from "../../utils/date"
import type { Habit } from "../../types"
import {
  calculateHabitStreak,
  calculateCurrentStreak,
  calculateLongestStreak,
} from "../../utils/stats"

function HabitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

function frequencyLabel(habit: Habit): string {
  if (habit.frequency === "daily") return "Daily"
  if (habit.frequency === "weekly") return "Weekly"
  if (Array.isArray(habit.frequency)) {
    return `${habit.frequency.length}x / week`
  }
  return ""
}

// Completion ratio for the current week (Sun-Sat), scheduled days only.
function weeklyProgress(habit: Habit, completions: { habitId: string; date: string; completed: boolean }[]) {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - dayOfWeek)

  let scheduled = 0
  let done = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    if (d > today) continue
    const iso = toISODate(d)
    if (!isScheduledOn(habit.frequency, iso)) continue
    scheduled++
    if (completions.some((c) => c.habitId === habit.id && c.date === iso && c.completed)) {
      done++
    }
  }
  return { done, scheduled }
}

const DIFFICULTY_BORDER: Record<string, string> = {
  Easy: "before:bg-emerald-500",
  Normal: "before:bg-amber-500",
  Hard: "before:bg-red-500",
}

export default function Habits() {
  const { habits, loaded, addHabit, updateHabit } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()
  const activeHabits = habits.filter((h) => !h.archived)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined)

  function openAddModal() {
    setEditingHabit(undefined)
    setModalOpen(true)
  }

  function openEditModal(habit: Habit) {
    setEditingHabit(habit)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingHabit(undefined)
  }

  function handleSubmit(habit: Habit) {
    if (editingHabit) {
      updateHabit(habit.id, habit)
    } else {
      addHabit(habit)
    }
    closeModal()
  }

  if (!loaded || !completionsLoaded) {
    return <HabitsSkeleton />
  }

  const currentStreak = calculateCurrentStreak(habits, completions)
  const longestStreak = calculateLongestStreak(habits, completions)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wide">Quest Log</h1>
          <p className="text-slate-500 text-sm mt-0.5">Your active daily quests</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-[0_0_16px_rgba(56,189,248,0.4)]"
        >
          + New Quest
        </button>
      </div>

      {activeHabits.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div className="hero-panel relative px-5 py-4 flex-1">
            <CornerBrackets />
            <p className="system-panel-header mb-1">Current Streak</p>
            <p className="font-display text-3xl font-bold text-white">
              &#128293; {currentStreak} <span className="text-lg text-slate-400 font-normal">days</span>
            </p>
          </div>
          <div className="hero-panel relative px-5 py-4 flex-1">
            <CornerBrackets />
            <p className="system-panel-header mb-1">Longest Streak</p>
            <p className="font-display text-3xl font-bold text-white">
              &#127942; {longestStreak} <span className="text-lg text-slate-400 font-normal">days</span>
            </p>
          </div>
        </div>
      )}

      {activeHabits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-2">Your journey starts here.</p>
          <p className="text-slate-500 text-sm mb-4">Create your first quest to begin earning XP.</p>
          <button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Create Quest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeHabits.map((habit) => {
            const colors = getHabitColorClasses(habit.color)
            const habitStreak = calculateHabitStreak(habit, completions)
            const difficulty = getDifficulty(habit.xpValue)
            const { done, scheduled } = weeklyProgress(habit, completions)
            const weekPct = scheduled > 0 ? Math.round((done / scheduled) * 100) : 0
            const borderClass = DIFFICULTY_BORDER[difficulty.label] ?? "before:bg-slate-500"

            return (
              <button
                key={habit.id}
                onClick={() => openEditModal(habit)}
                className={`system-panel card-hover relative text-left p-5 flex flex-col gap-3 overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] ${borderClass}`}
              >
                <CornerBrackets />
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border border-blue-900/40 ${colors.bgSoft} shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>
                      <HabitIcon name={habit.icon} className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{habit.name}</p>
                      <p className="text-slate-500 text-xs">{habit.category}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[0.6rem] font-medium uppercase tracking-wide px-2 py-0.5 rounded border ${difficulty.color}`}
                  >
                    {difficulty.label}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{frequencyLabel(habit)}</span>
                  <span className="text-blue-400 font-mono font-medium">+{habit.xpValue} XP</span>
                </div>

                {scheduled > 0 && (
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[0.6rem] tracking-widest text-slate-500 uppercase">This week</span>
                      <span className="text-[0.65rem] font-mono text-slate-400">{done}/{scheduled}</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.text.replace("text-", "bg-")} transition-all`}
                        style={{ width: `${weekPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {habitStreak > 0 && (
                  <div className="text-xs text-orange-400 font-medium">
                    &#128293; {habitStreak} day streak
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingHabit ? "Edit Quest" : "New Quest"}
      >
        <HabitForm
          initial={editingHabit}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}
