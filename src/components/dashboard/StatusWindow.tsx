import { getRank } from "../../utils/rank"

interface StatusWindowProps {
  level: number
  xp: number
  currentLevelXP: number
  nextLevelXP: number
  overallCompletion: number
  currentStreak: number
  totalCompleted: number
}

function StatBar({
  label,
  value,
  max,
  display,
}: {
  label: string
  value: number
  max: number
  display: string
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[0.65rem] tracking-widest text-blue-300/80 uppercase">
          {label}
        </span>
        <span className="text-xs font-mono text-white">{display}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-blue-900/40">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
          style={{ width: `${pct}%`, boxShadow: "0 0 8px rgba(56,189,248,0.7)" }}
        />
      </div>
    </div>
  )
}

export default function StatusWindow({
  level,
  xp,
  currentLevelXP,
  nextLevelXP,
  overallCompletion,
  currentStreak,
  totalCompleted,
}: StatusWindowProps) {
  const { rank, title, nextRank, nextRankLevel } = getRank(level)
  const levelProgress = xp - currentLevelXP
  const levelSpan = nextLevelXP - currentLevelXP

  return (
    <div className="system-panel p-6 mb-6 relative overflow-hidden">
      <div className="system-panel-scan" style={{ top: 0 }} />

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="system-panel-header mb-1">Status Window</p>
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
          {nextRank && nextRankLevel && (
            <p className="text-[0.65rem] text-slate-500 mt-1">
              Next rank: <span className="text-blue-400 font-mono">{nextRank}</span> at Lv. {nextRankLevel}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 border-blue-400/60 bg-blue-500/10 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
          <span className="text-2xl font-bold text-blue-300 font-mono">{rank}</span>
          <span className="text-[0.55rem] text-blue-400/70 tracking-widest">RANK</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-center">
        <div>
          <p className="text-3xl font-bold text-white font-mono">{level}</p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase">Level</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white font-mono">{overallCompletion}%</p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase">Completion</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white font-mono">{currentStreak}</p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase">Day Streak</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white font-mono">{totalCompleted}</p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase">Quests Done</p>
        </div>
      </div>

      <StatBar
        label="Experience"
        value={levelProgress}
        max={levelSpan}
        display={`${levelProgress} / ${levelSpan} XP`}
      />
    </div>
  )
}