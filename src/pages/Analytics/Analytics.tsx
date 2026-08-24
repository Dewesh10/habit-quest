import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { getMonthDates, getMonthName } from "../../utils/date"
import { buildDailyChartData, buildWeeklyChartData } from "../../utils/chartData"

function DailyTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white">
      <p className="font-medium mb-1">Day {d.label}</p>
      <p className="text-slate-300">
        {d.completed} / {d.total} habits · {d.percent}%
      </p>
    </div>
  )
}

function WeeklyTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white">
      <p className="font-medium mb-1">{d.label}</p>
      <p className="text-slate-300">
        {d.completed} / {d.total} habits · {d.percent}%
      </p>
    </div>
  )
}

export default function Analytics() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()

  if (!habitsLoaded || !completionsLoaded) {
    return <p className="text-slate-400">Loading...</p>
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthDates = getMonthDates(year, month)

  const dailyData = buildDailyChartData(habits, completions, monthDates)
  const weeklyData = buildWeeklyChartData(habits, completions, monthDates)

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
      <p className="text-slate-400 mb-6">
        {getMonthName(month)} {year}
      </p>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <h2 className="text-sm font-medium text-white mb-4">
          Daily Completion
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} unit="%" />
            <Tooltip content={<DailyTooltip />} cursor={{ fill: "#1e293b" }} />
            <Bar dataKey="percent" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-sm font-medium text-white mb-4">
          Weekly Completion
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} unit="%" />
            <Tooltip content={<WeeklyTooltip />} cursor={{ fill: "#1e293b" }} />
            <Bar dataKey="percent" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}