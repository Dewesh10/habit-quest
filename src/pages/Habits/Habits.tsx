import { useState } from "react"
import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { getHabitColorClasses } from "../../utils/colorMap"
import Modal from "../../components/common/Modal"
import HabitForm from "../../components/habits/HabitForm"
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
    return <p className="text-slate-400">Loading habits...</p>
  }

  const currentStreak = calculateCurrentStreak(habits, completions)
  const longestStreak = calculateLongestStreak(habits, completions)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Habits</h1>
        <button
          onClick={openAddModal}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Add Habit
        </button>
      </div>

      {activeHabits.length > 0 && (
        <div className="flex gap-4 mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex-1">
            <p className="text-xs text-slate-400 mb-1">Current Streak</p>
            <p className="text-lg font-semibold text-white">
              🔥 {currentStreak} days
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex-1">
            <p className="text-xs text-slate-400 mb-1">Longest Streak</p>
            <p className="text-lg font-semibold text-white">
              🏆 {longestStreak} days
            </p>
          </div>
        </div>
      )}

      {activeHabits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-2">Your journey starts here.</p>
          <p className="text-slate-500 text-sm mb-4">Create your first habit to begin earning XP.</p>
          <button
            onClick={openAddModal}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Create Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeHabits.map((habit) => {
            const colors = getHabitColorClasses(habit.color)
            const habitStreak = calculateHabitStreak(habit, completions)
            return (
              <button
                key={habit.id}
                onClick={() => openEditModal(habit)}
                className="text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bgSoft}`}>
                    <HabitIcon name={habit.icon} className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{habit.name}</p>
                    <p className="text-slate-500 text-xs">{habit.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{frequencyLabel(habit)}</span>
                  <span className="text-emerald-400 font-medium">+{habit.xpValue} XP</span>
                </div>
                {habitStreak > 0 && (
                  <div className="text-xs text-orange-400 font-medium">
                    🔥 {habitStreak} day streak
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
        title={editingHabit ? "Edit Habit" : "New Habit"}
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