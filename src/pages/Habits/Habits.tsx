import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { getHabitColorClasses } from "../../utils/colorMap"
import type { Habit } from "../../types"

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
  const { habits, loaded } = useHabits()
  const activeHabits = habits.filter((h) => !h.archived)

  if (!loaded) {
    return <p className="text-slate-400">Loading habits...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Habits</h1>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
          + Add Habit
        </button>
      </div>

      {activeHabits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-2">Your journey starts here.</p>
          <p className="text-slate-500 text-sm">Create your first habit to begin earning XP.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeHabits.map((habit) => {
            const colors = getHabitColorClasses(habit.color)
            return (
              <div
                key={habit.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3"
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
