import { getRank } from "../../utils/rank"
import CountUp from "../common/CountUp"

interface StatusWindowProps {
  level: number
  xp: number
  currentLevelXP: number
  nextLevelXP: number
  overallCompletion: number
  currentStreak: number
  totalCompleted: number
  equippedTitle?: string | null
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
      <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden border border-blue-900/40 relative">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700 ease-out relative"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px rgba(56,189,248,0.8)" }}
        >
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-white/60 blur-[3px]" />
        </div>
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
  equippedTitle,
}: StatusWindowProps) {
  const { rank, title, nextRank, nextRankLevel } = getRank(level)
  const levelProgress = xp - currentLevelXP
  const levelSpan = nextLevelXP - currentLevelXP

  return (
    <div className="system-panel p-6 md:p-8 mb-6 relative overflow-hidden">
      <div className="system-panel-scan" style={{ top: 0 }} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="system-panel-header mb-1">Status Window</p>
          {equippedTitle && (
            <p className="text-[0.7rem] text-cyan-300/90 tracking-wide font-mono mb-1">
              &laquo; {equippedTitle} &raquo;
            </p>
          )}
          <h2 className="font-display text-2xl font-bold text-white tracking-wide">{title}</h2>
          {nextRank && nextRankLevel && (
            <p className="text-[0.65rem] text-slate-500 mt-1">
              Next rank: <span className="text-blue-400 font-mono">{nextRank}</span> at Lv. {nextRankLevel}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-blue-400/60 bg-blue-500/10 shadow-[0_0_28px_rgba(56,189,248,0.55)]">
          <span className="font-display text-3xl font-bold text-blue-300">{rank}</span>
          <span className="text-[0.55rem] text-blue-400/70 tracking-widest">RANK</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 text-center">
        <div>
          <p className="font-display text-4xl md:text-5xl font-black text-white leading-none">
            <CountUp value={level} />
          </p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase mt-2">Level</p>
        </div>
        <div>
          <p className="font-display text-4xl md:text-5xl font-black text-white leading-none">
            <CountUp value={overallCompletion} suffix="%" />
          </p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase mt-2">Completion</p>
        </div>
        <div>
          <p className="font-display text-4xl md:text-5xl font-black text-white leading-none">
            <CountUp value={currentStreak} />
          </p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase mt-2">Day Streak</p>
        </div>
        <div>
          <p className="font-display text-4xl md:text-5xl font-black text-white leading-none">
            <CountUp value={totalCompleted} />
          </p>
          <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase mt-2">Quests Done</p>
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
