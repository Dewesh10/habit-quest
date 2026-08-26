import type { StatAllocation } from "../../utils/statMap"

export default function StatAllocationPanel({ stats }: { stats: StatAllocation[] }) {
  const maxValue = Math.max(1, ...stats.map((s) => s.value))

  if (stats.length === 0) {
    return (
      <div className="system-panel p-4 mb-6">
        <p className="system-panel-header mb-2">Ability Stats</p>
        <p className="text-slate-500 text-sm">No quests completed yet.</p>
      </div>
    )
  }

  return (
    <div className="system-panel p-4 mb-6">
      <p className="system-panel-header mb-4">Ability Stats</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-slate-300">
                <span className="text-blue-400 font-mono font-bold mr-1">{s.abbr}</span>
                {s.label}
              </span>
              <span className="text-xs font-mono text-white">{s.value}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-blue-900/30">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-cyan-400"
                style={{ width: `${(s.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}