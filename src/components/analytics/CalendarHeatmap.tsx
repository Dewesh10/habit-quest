import { useState } from "react"
import { buildHeatmapData } from "../../utils/chartData"
import { toISODate } from "../../utils/date"
import type { Habit, Completion } from "../../types"

interface CalendarHeatmapProps {
  habits: Habit[]
  completions: Completion[]
  weeksToShow?: number
}

function getIntensityClass(percent: number, total: number): string {
  if (total === 0) return "bg-slate-800/40"
  if (percent === 0) return "bg-slate-800"
  if (percent < 34) return "bg-blue-900/60"
  if (percent < 67) return "bg-blue-700/70"
  if (percent < 100) return "bg-blue-500/80"
  return "bg-blue-400 shadow-[0_0_4px_rgba(56,189,248,0.8)]"
}

function buildDateRange(weeks: number): string[] {
  const dates: string[] = []
  const end = new Date()
  const totalDays = weeks * 7

  const start = new Date(end)
  start.setDate(start.getDate() - totalDays + 1)
  // Align to the most recent Sunday on or before start, so columns are clean weeks.
  const startWeekday = start.getDay()
  start.setDate(start.getDate() - startWeekday)

  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(toISODate(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

export default function CalendarHeatmap({ habits, completions, weeksToShow = 26 }: CalendarHeatmapProps) {
  const [hovered, setHovered] = useState<{ date: string; completed: number; total: number; percent: number } | null>(null)

  const dates = buildDateRange(weeksToShow)
  const points = buildHeatmapData(habits, completions, dates)
  const pointByDate = new Map(points.map((p) => [p.date, p]))

  // Group into columns of 7 (weeks), Sunday-first.
  const columns: string[][] = []
  for (let i = 0; i < dates.length; i += 7) {
    columns.push(dates.slice(i, i + 7))
  }

  // Month labels: mark the first column where a new month begins.
  const monthMarkers: { colIndex: number; label: string }[] = []
  let lastMonth = -1
  columns.forEach((col, i) => {
    const firstOfCol = new Date(col[0] + "T00:00:00")
    const m = firstOfCol.getMonth()
    if (m !== lastMonth) {
      monthMarkers.push({ colIndex: i, label: MONTH_LABELS[m] })
      lastMonth = m
    }
  })

  const today = toISODate(new Date())

  return (
    <div className="relative">
      <div className="flex gap-[3px] text-[10px] text-slate-500 mb-1 font-mono" style={{ paddingLeft: 0 }}>
        {columns.map((_, i) => {
          const marker = monthMarkers.find((m) => m.colIndex === i)
          return (
            <div key={i} className="w-[11px] shrink-0">
              {marker ? marker.label : ""}
            </div>
          )
        })}
      </div>

      <div className="flex gap-[3px]">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-[3px]">
            {col.map((dateISO) => {
              const point = pointByDate.get(dateISO)
              const isFuture = dateISO > today
              if (isFuture) {
                return <div key={dateISO} className="w-[11px] h-[11px] rounded-sm bg-transparent" />
              }
              return (
                <div
                  key={dateISO}
                  onMouseEnter={() => point && setHovered(point)}
                  onMouseLeave={() => setHovered(null)}
                  className={`w-[11px] h-[11px] rounded-sm cursor-pointer transition-transform hover:scale-125 ${getIntensityClass(
                    point?.percent ?? 0,
                    point?.total ?? 0
                  )}`}
                />
              )
            })}
          </div>
        ))}
      </div>

      {hovered && (
        <div className="mt-3 inline-block bg-slate-900 border border-blue-900/40 rounded-lg px-3 py-2 text-xs">
          <p className="text-blue-300 font-mono">{hovered.date}</p>
          <p className="text-slate-300">
            {hovered.completed} / {hovered.total} habits · {hovered.percent}%
          </p>
        </div>
      )}
    </div>
  )
}
