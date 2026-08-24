import { useState } from "react"
import HabitGrid from "../../components/calendar/HabitGrid"
import { getMonthName } from "../../utils/date"

export default function Dashboard() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Habit Quest</h1>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={prevMonth}
              className="text-slate-400 hover:text-white text-sm"
            >
              ?
            </button>
            <span className="text-slate-300 text-sm font-medium">
              {getMonthName(month)} {year}
            </span>
            <button
              onClick={nextMonth}
              className="text-slate-400 hover:text-white text-sm"
            >
              ?
            </button>
          </div>
        </div>
      </div>

      <HabitGrid year={year} month={month} />
    </div>
  )
}
