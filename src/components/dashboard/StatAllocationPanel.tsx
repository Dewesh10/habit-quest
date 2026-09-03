import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import type { StatAllocation } from "../../utils/statMap"

export default function StatAllocationPanel({ stats }: { stats: StatAllocation[] }) {
  if (stats.length === 0) {
    return (
      <div className="system-panel p-4 mb-6">
        <p className="system-panel-header mb-2">Ability Stats</p>
        <p className="text-slate-500 text-sm">No quests completed yet.</p>
      </div>
    )
  }

  const maxValue = Math.max(1, ...stats.map((s) => s.value))
  const chartData = stats.map((s) => ({
    stat: s.abbr,
    fullLabel: s.label,
    value: s.value,
  }))

  return (
    <div className="system-panel p-4 md:p-6 mb-6">
      <p className="system-panel-header mb-4">Ability Stats</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-center">
        {stats.length >= 3 ? (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="75%">
                <PolarGrid stroke="#1e3a5f" />
                <PolarAngleAxis
                  dataKey="stat"
                  tick={{ fill: "#7dd3fc", fontSize: 12, fontFamily: "monospace" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, maxValue]}
                  tick={{ fill: "#475569", fontSize: 9 }}
                  stroke="#1e3a5f"
                />
                <Radar
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-y-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm text-slate-300">
                  <span className="font-display text-blue-400 font-bold mr-1.5 text-base">{s.abbr}</span>
                  {s.label}
                </span>
                <span className="font-stat text-sm font-bold text-white">{s.value}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-blue-900/30">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 to-cyan-400"
                  style={{ width: `${(s.value / maxValue) * 100}%`, boxShadow: "0 0 8px rgba(56,189,248,0.5)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
