import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, AlertOctagon } from "lucide-react"
import type { PenaltyState } from "../../types"


interface PenaltyZoneOverlayProps {
  penalty: PenaltyState
  onProgressPenalty: (amount?: number) => void
  onClearPenalty: () => void
}

export default function PenaltyZoneOverlay({
  penalty,
  onProgressPenalty,
  onClearPenalty,
}: PenaltyZoneOverlayProps) {
  if (!penalty.active || !penalty.forcedQuest) return null

  const pct = Math.min(
    100,
    Math.round((penalty.forcedQuest.current / penalty.forcedQuest.target) * 100)
  )

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-lg">
        {/* Animated Penalty Red Pulse */}
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative w-full max-w-lg bg-slate-950 border-2 border-red-500 rounded-xl p-6 shadow-[0_0_60px_rgba(239,68,68,0.7)] text-center overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

          {/* Warning Siren Header */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 font-mono text-xs uppercase tracking-widest animate-pulse">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>[ EMERGENCY PENALTY QUEST ACTIVE ]</span>
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-black text-red-500 uppercase tracking-wider mb-2">
            SURVIVE IN THE PENALTY ZONE
          </h2>

          <p className="text-slate-300 text-sm font-mono mb-4">
            {penalty.reason || "You failed to complete the non-skippable Daily Quests."}
          </p>

          <div className="p-4 rounded-lg bg-red-950/40 border border-red-900/50 mb-6 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" /> STAT DEBUFF ACTIVE
              </span>
              <span className="text-red-400 font-mono font-bold text-xs">-{penalty.debuffPercent}% ALL STATS</span>
            </div>
            <p className="text-slate-400 text-xs font-mono">
              All normal quest rewards are locked until you clear the forced penalty quest below!
            </p>
          </div>

          {/* Forced Quest Box */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-left mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-mono font-bold text-sm">
                {penalty.forcedQuest.title}
              </span>
              <span className="text-red-400 font-mono text-xs font-bold">
                {penalty.forcedQuest.current} / {penalty.forcedQuest.target} {penalty.forcedQuest.unit}
              </span>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            <button
              onClick={() => onProgressPenalty(1)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all"
            >
              PROGRESS SURVIVAL TASK (+1)
            </button>
          </div>

          <button
            onClick={onClearPenalty}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono underline"
          >
            [ Override Penalty / Emergency Clearance ]
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
