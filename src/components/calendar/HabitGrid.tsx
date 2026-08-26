import { useState } from "react"
import type { CSSProperties } from "react"
import { icons } from "lucide-react"
import { getHabitColorClasses } from "../../utils/colorMap"
import { getMonthDates, isScheduledOn, todayISO } from "../../utils/date"
import type { Habit } from "../../types"

function HabitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

interface HabitGridProps {
  year: number
  month: number
  habits: Habit[]
  isCompleted: (habitId: string, dateISO: string) => boolean
  toggleCompletion: (habitId: string, dateISO: string) => void
  onComplete?: (habitName: string, xp: number) => void
}

export default function HabitGrid({
  year,
  month,
  habits,
  isCompleted,
  toggleCompletion,
  onComplete,
}: HabitGridProps) {
  const [burstKey, setBurstKey] = useState<string | null>(null)
  const activeHabits = habits.filter((h) => !h.archived)
  const dates = getMonthDates(year, month)
  const today = todayISO()

  if (activeHabits.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No habits yet. Add some from the Habits page to see them here.
      </div>
    )
  }

  function handleToggle(habit: Habit, dateISO: string) {
    const wasCompleted = isCompleted(habit.id, dateISO)
    toggleCompletion(habit.id, dateISO)
    if (!wasCompleted) {
      if (onComplete) onComplete(habit.name, habit.xpValue)
      const key = `${habit.id}-${dateISO}`
      setBurstKey(key)
      setTimeout(() => {
        setBurstKey((current) => (current === key ? null : current))
      }, 500)
    }
  }

  return (
    <div className="system-panel overflow-x-auto">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="sticky left-0 bg-slate-900 text-left system-panel-header px-3 py-2 min-w-[140px] z-10">
              Quest
            </th>
            {dates.map((dateISO) => {
              const day = Number(dateISO.slice(-2))
              const isToday = dateISO === today
              return (
                <th
                  key={dateISO}
                  className={`text-xs font-mono px-1.5 py-2 min-w-[28px] ${
                    isToday ? "text-blue-400" : "text-slate-500"
                  }`}
                >
                  {day}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {activeHabits.map((habit) => {
            const colors = getHabitColorClasses(habit.color)
            return (
              <tr key={habit.id} className="border-t border-blue-900/20">
                <td className="sticky left-0 bg-slate-900 px-3 py-2 z-10">
                  <div className="flex items-center gap-2">
                    <HabitIcon name={habit.icon} className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-white text-sm whitespace-nowrap">{habit.name}</span>
                  </div>
                </td>
                {dates.map((dateISO) => {
                  const scheduled = isScheduledOn(habit.frequency, dateISO)
                  const completed = isCompleted(habit.id, dateISO)
                  const key = `${habit.id}-${dateISO}`

                  if (!scheduled) {
                    return (
                      <td key={dateISO} className="text-center px-1.5 py-2">
                        <div className="w-5 h-5 mx-auto rounded bg-slate-800/40" />
                      </td>
                    )
                  }

                  return (
                    <td key={dateISO} className="text-center px-1.5 py-2">
                      <button
                        onClick={() => handleToggle(habit, dateISO)}
                        className={`relative w-5 h-5 mx-auto rounded border-2 transition-colors ${
                          completed ? "check-pop" : ""
                        } ${
                          completed
                            ? "bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                            : "border-slate-600 hover:border-blue-500"
                        }`}
                        aria-label={`Toggle ${habit.name} for ${dateISO}`}
                      >
                        {burstKey === key && (
                          <>
                            <span className="burst-ring" />
                            {Array.from({ length: 6 }).map((_, i) => (
                              <span
                                key={i}
                                className="burst-dot"
                                style={{ "--angle": `${i * 60}deg` } as CSSProperties}
                              />
                            ))}
                          </>
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
