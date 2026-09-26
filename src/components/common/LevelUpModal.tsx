import { useEffect } from "react"
import { Sparkles, Trophy, Shield, ArrowRight } from "lucide-react"
import { soundEngine } from "../../utils/soundEngine"

interface LevelUpModalProps {
  level: number
  unallocatedPoints: number
  onClose: () => void
}

export default function LevelUpModal({ level, unallocatedPoints, onClose }: LevelUpModalProps) {
  useEffect(() => {
    soundEngine.playLevelUpFanfare()
    soundEngine.speakSystemDirective(`Warning. Player experience threshold exceeded. You have reached Level ${level}.`)
  }, [level])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Level Up Notification"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-toast-in"
    >
      {/* Anime shockwave ring */}
      <div className="absolute w-96 h-96 rounded-full border border-cyan-400/40 rankup-shockwave pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-purple-500/30 rankup-shockwave pointer-events-none" style={{ animationDelay: "200ms" }} />

      <div className="relative w-full max-w-md system-panel p-8 flex flex-col items-center text-center border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(56,189,248,0.5)]">
        {/* Holographic Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          SYSTEM DIRECTIVE: THRESHOLD EXCEEDED
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 tracking-wider rankup-title-in mb-2">
          LEVEL UP!
        </h2>

        {/* Level Number Showcase */}
        <div className="my-6 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400 uppercase">PREVIOUS</span>
            <span className="text-2xl font-bold text-slate-500 font-mono">LVL {Math.max(1, level - 1)}</span>
          </div>

          <ArrowRight className="w-6 h-6 text-cyan-400 animate-pulse" />

          <div className="flex flex-col items-center p-4 rounded-xl bg-cyan-950/80 border border-cyan-400/80 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider">CURRENT</span>
            <span className="text-4xl font-extrabold text-cyan-300 font-mono">LVL {level}</span>
          </div>
        </div>

        {/* Rewards Box */}
        <div className="w-full bg-slate-900/90 border border-cyan-900/50 rounded-xl p-4 mb-6 text-left space-y-2">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            HUNTER REWARDS GRANTED:
          </p>

          <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800">
            <span className="text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Stat Ability Points (AP)
            </span>
            <span className="font-mono text-emerald-400 font-bold">+{unallocatedPoints || 5} AP</span>
          </div>

          <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800">
            <span className="text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              HP / MP Recovery
            </span>
            <span className="font-mono text-cyan-300 font-bold">100% RESTORED</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundEngine.playClick()
            onClose()
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base font-display tracking-wider shadow-[0_0_24px_rgba(56,189,248,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          ALLOCATE STAT POINTS
        </button>
      </div>
    </div>
  )
}
