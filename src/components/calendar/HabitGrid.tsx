import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { getHabitColorClasses } from "../../utils/colorMap"
import { getMonthDates, isScheduledOn, todayISO } from "../../utils/date"

function HabitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

interface HabitGridProps {
  year: number
  month: number // 0-indexed
}

export default function HabitGrid({ year, month }: HabitGridProps) {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { isCompleted, toggleCompletion, loaded: completionsLoaded } = useCompletions()

  if (!habitsLoaded || !completionsLoaded) {
    return <p className="text-slate-400">Loading grid...</p>
  }

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

  return (
    <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="sticky left-0 bg-slate-900 text-left text-xs text-slate-400 font-medium px-3 py-2 min-w-[140px] z-10">
              Habit
            </th>
            {dates.map((dateISO) => {
              const day = Number(dateISO.slice(-2))
              const isToday = dateISO === today
              return (
                <th
                  key={dateISO}
                  className={`text-xs font-medium px-1.5 py-2 min-w-[28px] ${
                    isToday ? "text-emerald-400" : "text-slate-500"
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
              <tr key={habit.id} className="border-t border-slate-800">
                <td className="sticky left-0 bg-slate-900 px-3 py-2 z-10">
                  <div className="flex items-center gap-2">
                    <HabitIcon name={habit.icon} className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-white text-sm whitespace-nowrap">{habit.name}</span>
                  </div>
                </td>
                {dates.map((dateISO) => {
                  const scheduled = isScheduledOn(habit.frequency, dateISO)
                  const completed = isCompleted(habit.id, dateISO)

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
                        onClick={() => toggleCompletion(habit.id, dateISO)}
                        className={`w-5 h-5 mx-auto rounded border-2 transition-colors ${
                          completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-600 hover:border-slate-500"
                        }`}
                        aria-label={`Toggle ${habit.name} for ${dateISO}`}
                      />
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
