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

function StatBar({ label, value, max, display }: { label: string; value: number; max: number; display: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[0.65rem] tracking-widest text-blue-300/80 uppercase">{label}</span>
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

function CornerBrackets() {
  return (
    <>
      <svg className="absolute top-2 left-2 w-6 h-6 text-blue-400/70" viewBox="0 0 24 24" fill="none">
        <path d="M2 10V4a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute top-2 right-2 w-6 h-6 text-blue-400/70" viewBox="0 0 24 24" fill="none">
        <path d="M22 10V4a2 2 0 0 0-2-2h-6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-6 h-6 text-blue-400/70" viewBox="0 0 24 24" fill="none">
        <path d="M2 14v6a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-6 h-6 text-blue-400/70" viewBox="0 0 24 24" fill="none">
        <path d="M22 14v6a2 2 0 0 1-2 2h-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </>
  )
}

export default function StatusWindow({
  level, xp, currentLevelXP, nextLevelXP, overallCompletion, currentStreak, totalCompleted, equippedTitle,
}: StatusWindowProps) {
  const { rank, title, nextRank, nextRankLevel } = getRank(level)
  const levelProgress = xp - currentLevelXP
  const levelSpan = nextLevelXP - currentLevelXP

  return (
    <div className="hero-panel p-6 md:p-10 mb-6 relative overflow-hidden">
      <CornerBrackets />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <p className="system-panel-header mb-1 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Status Window
          </p>
          {equippedTitle && (
            <p className="text-[0.7rem] text-cyan-300/90 tracking-wide font-mono mb-1">
              &laquo; {equippedTitle} &raquo;
            </p>
          )}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-wide">{title}</h2>
          {nextRank && nextRankLevel && (
            <p className="text-[0.65rem] text-slate-500 mt-2">
              Next rank: <span className="text-blue-400 font-mono">{nextRank}</span> at Lv. {nextRankLevel}
            </p>
          )}
        </div>

        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <polygon
              points="50,4 93,27 93,73 50,96 7,73 7,27"
              fill="rgba(56,189,248,0.08)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <polygon
              points="50,14 84,32 84,68 50,86 16,68 16,32"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.5"
              opacity="0.4"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-blue-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]">{rank}</span>
            <span className="text-[0.5rem] text-blue-400/70 tracking-widest">RANK</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 relative z-10">
        {[
          { label: "Level", value: level, suffix: "" },
          { label: "Completion", value: overallCompletion, suffix: "%" },
          { label: "Day Streak", value: currentStreak, suffix: "" },
          { label: "Quests Done", value: totalCompleted, suffix: "" },
        ].map((stat) => (
          <div key={stat.label} className="relative border-l-2 border-blue-500/30 pl-3 min-w-0">
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none truncate">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-[0.65rem] tracking-widest text-slate-500 uppercase mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <StatBar
          label="Experience"
          value={levelProgress}
          max={levelSpan}
          display={`${levelProgress} / ${levelSpan} XP`}
        />
      </div>
    </div>
  )
}
