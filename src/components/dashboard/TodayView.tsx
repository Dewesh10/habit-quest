import { icons } from "lucide-react"
import { isScheduledOn, todayISO } from "../../utils/date"
import { getHabitColorClasses } from "../../utils/colorMap"
import type { Habit } from "../../types"

function HabitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

interface TodayViewProps {
  habits: Habit[]
  isCompleted: (habitId: string, dateISO: string) => boolean
  toggleCompletion: (habitId: string, dateISO: string) => void
}

export default function TodayView({ habits, isCompleted, toggleCompletion }: TodayViewProps) {
  const today = todayISO()
  const todaysHabits = habits.filter(
    (h) => !h.archived && isScheduledOn(h.frequency, today)
  )

  if (todaysHabits.length === 0) {
    return (
      <div className="md:hidden bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 text-center text-slate-400 text-sm">
        Nothing scheduled for today.
      </div>
    )
  }

  const completedCount = todaysHabits.filter((h) => isCompleted(h.id, today)).length

  return (
    <div className="md:hidden bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-white">Today</p>
        <p className="text-xs text-slate-400">
          {completedCount} / {todaysHabits.length}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {todaysHabits.map((habit) => {
          const done = isCompleted(habit.id, today)
          const colors = getHabitColorClasses(habit.color)
          return (
            <button
              key={habit.id}
              onClick={() => toggleCompletion(habit.id, today)}
              className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                done
                  ? "bg-blue-500/10 border-blue-800"
                  : "bg-slate-800/50 border-slate-800"
              }`}
            >
              <div className={`p-1.5 rounded-md ${colors.bgSoft}`}>
                <HabitIcon name={habit.icon} className={`w-4 h-4 ${colors.text}`} />
              </div>
              <span className={`text-sm flex-1 ${done ? "text-white" : "text-slate-300"}`}>
                {habit.name}
              </span>
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  done
                    ? "bg-blue-500 border-blue-500"
                    : "border-slate-600"
                }`}
              >
                {done && <span className="text-slate-950 text-xs">?</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
