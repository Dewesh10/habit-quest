import { getGateStyle } from "../../utils/gate"

interface GatePanelProps {
  rank: string
  completed: number
  goal: number
}

export default function GatePanel({ rank, completed, goal }: GatePanelProps) {
  const style = getGateStyle(rank)
  const progress = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0
  const bossHealth = 100 - progress
  const cleared = progress >= 100

  return (
    <div className={`system-panel relative p-4 mb-6 border ${style.borderClass}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="system-panel-header">
            {cleared ? "Gate Cleared" : "Active Gate"}
          </span>
          <span className={`text-[0.65rem] font-mono px-1.5 py-0.5 rounded border ${style.colorClass} ${style.borderClass}`}>
            {rank}-Rank
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {completed} / {goal} ({progress}%)
        </span>
      </div>

      <div className="mb-1.5 flex justify-between items-baseline">
        <span className="text-[0.6rem] tracking-widest text-slate-500 uppercase">
          {cleared ? "Boss Defeated" : "Gate Integrity"}
        </span>
        <span className="text-[0.6rem] font-mono text-slate-500">{bossHealth}%</span>
      </div>
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div
          className={`h-full bg-gradient-to-r ${style.barClass} transition-all duration-700 ease-out`}
          style={{
            width: `${bossHealth}%`,
            boxShadow: `0 0 10px ${style.glowColor}`,
          }}
        />
      </div>

      {cleared && (
        <p className="text-emerald-400 text-xs mt-3 font-medium">
          Gate cleared, Hunter. Set a new goal in Settings to open the next Gate.
        </p>
      )}
    </div>
  )
}
