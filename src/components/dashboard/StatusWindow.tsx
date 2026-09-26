import { Plus, AlertTriangle, Zap, Dumbbell, Brain, Heart, Eye, Flame, Swords } from "lucide-react"
import { getRank } from "../../utils/rank"
import { soundEngine } from "../../utils/soundEngine"
import type { HunterStats, PenaltyState } from "../../types"


interface StatusWindowProps {
  level: number
  xp: number
  currentLevelXP: number
  nextLevelXP: number
  overallCompletion: number
  currentStreak: number
  totalCompleted: number
  equippedTitle?: string | null
  stats: HunterStats
  combatPower: number
  penalty: PenaltyState
  onAllocateAP: (stat: keyof Omit<HunterStats, "availableAP">) => void
}



function StatBar({
  label,
  value,
  max,
  display,
  colorClass = "from-blue-600 to-cyan-400",
}: {
  label: string
  value: number
  max: number
  display: string
  colorClass?: string
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[0.65rem] tracking-widest text-cyan-300 uppercase font-mono">{label}</span>
        <span className="text-xs font-mono text-white font-bold">{display}</span>
      </div>
      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50 relative">
        <div
          className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function CornerBrackets() {
  return (
    <>
      <svg className="absolute top-2 left-2 w-6 h-6 text-cyan-400/60" viewBox="0 0 24 24" fill="none">
        <path d="M2 10V4a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute top-2 right-2 w-6 h-6 text-cyan-400/60" viewBox="0 0 24 24" fill="none">
        <path d="M22 10V4a2 2 0 0 0-2-2h-6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-6 h-6 text-cyan-400/60" viewBox="0 0 24 24" fill="none">
        <path d="M2 14v6a2 2 0 0 0 2 2h6" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-6 h-6 text-cyan-400/60" viewBox="0 0 24 24" fill="none">
        <path d="M22 14v6a2 2 0 0 1-2 2h-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </>
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
  stats,
  combatPower,
  penalty,
  onAllocateAP,
}: StatusWindowProps) {


  const { rank, title } = getRank(level)
  const levelProgress = xp - currentLevelXP
  const levelSpan = nextLevelXP - currentLevelXP

  const jobClass =
    level >= 25 ? "SHADOW MONARCH" : level >= 10 ? "NECROMANCER" : "NONE"

  const statItems: { key: keyof Omit<HunterStats, "availableAP">; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "str", label: "STR", icon: <Dumbbell className="w-3.5 h-3.5 text-red-400" />, desc: "Strength / Workout power" },
    { key: "vit", label: "VIT", icon: <Heart className="w-3.5 h-3.5 text-emerald-400" />, desc: "Vitality / Health endurance" },
    { key: "agi", label: "AGI", icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, desc: "Agility / Streak speed" },
    { key: "int", label: "INT", icon: <Brain className="w-3.5 h-3.5 text-purple-400" />, desc: "Intelligence / Study focus" },
    { key: "per", label: "PER", icon: <Eye className="w-3.5 h-3.5 text-amber-400" />, desc: "Perception / Mindfulness" },
  ]

  return (
    <div
      className={`hero-panel p-6 md:p-8 mb-6 relative overflow-hidden transition-all ${
        level >= 25 ? "border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)]" : "border-cyan-500/40"
      }`}
    >
      <CornerBrackets />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="system-panel-header">STATUS WINDOW</span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              JOB: {jobClass}
            </span>
            {equippedTitle && (
              <span className="text-xs font-mono text-cyan-300 italic">
                &laquo; {equippedTitle} &raquo;
              </span>
            )}
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-black text-white uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
            {title}
          </h2>

          <div className="flex items-center gap-3 mt-2 font-mono text-xs text-slate-300">
            <span>
              COMBAT POWER: <strong className="text-amber-400 font-bold text-sm">{combatPower.toLocaleString()} CP</strong>
            </span>
            {penalty.active && (
              <span className="text-red-400 flex items-center gap-1 font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> DEBUFF: -{penalty.debuffPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Rank Badge Hexagon */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            <polygon
              points="50,4 93,27 93,73 50,96 7,73 7,27"
              fill={level >= 25 ? "rgba(168,85,247,0.15)" : "rgba(56,189,248,0.15)"}
              stroke={level >= 25 ? "#a855f7" : "#38bdf8"}
              strokeWidth="2"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]">
              {rank}
            </span>
            <span className="text-[0.55rem] text-cyan-300 tracking-widest font-mono font-bold">HUNTER</span>
          </div>
        </div>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-center font-mono">
          <p className="text-[0.6rem] text-slate-400 uppercase">STREAK</p>
          <p className="text-amber-400 font-bold text-lg flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-amber-400" /> {currentStreak} d
          </p>
        </div>
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-center font-mono">
          <p className="text-[0.6rem] text-slate-400 uppercase">COMPLETED</p>
          <p className="text-cyan-400 font-bold text-lg flex items-center justify-center gap-1">
            <Swords className="w-4 h-4 text-cyan-400" /> {totalCompleted}
          </p>
        </div>
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-center font-mono">
          <p className="text-[0.6rem] text-slate-400 uppercase">RATE</p>
          <p className="text-emerald-400 font-bold text-lg">{overallCompletion}%</p>
        </div>
      </div>


      {/* HP, MP & Experience Gauges */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 relative z-10">
        <StatBar label="HP (HEALTH)" value={100} max={100} display="100 / 100" colorClass="from-red-600 to-rose-400" />
        <StatBar label="MP (MANA)" value={100} max={100} display="100 / 100" colorClass="from-blue-600 to-indigo-400" />
        <StatBar label="EXP (EXPERIENCE)" value={levelProgress} max={levelSpan} display={`${levelProgress} / ${levelSpan} XP`} colorClass="from-cyan-600 to-emerald-400" />
      </div>

      {/* Core Stats & Free AP Allocation */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 relative z-10">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <span className="font-mono text-xs text-cyan-300 font-bold tracking-wider uppercase">
            HUNTER ATTRIBUTES
          </span>
          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
            AVAILABLE AP: {stats.availableAP}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {statItems.map((item) => (
            <div
              key={item.key}
              className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span className="font-mono text-xs font-bold text-white">{item.label}</span>
                </div>
                <span className="font-mono text-sm font-bold text-cyan-400">{stats[item.key]}</span>
              </div>

              <p className="text-[0.6rem] text-slate-500 mb-2 leading-tight">{item.desc}</p>

              {stats.availableAP > 0 && (
                <button
                  onClick={() => {
                    soundEngine.playStatAllocated()
                    onAllocateAP(item.key)
                  }}
                  className="w-full py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-[0.65rem] rounded flex items-center justify-center gap-1 transition-all shadow-[0_0_8px_rgba(56,189,248,0.5)] active:scale-95"
                >
                  <Plus className="w-3 h-3" /> +1 AP
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
