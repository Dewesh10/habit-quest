import { Shield, Sword, Wand2, Zap, Crown, Lock, Sparkles, CheckCircle2 } from "lucide-react"
import type { ShadowSoldier, ShadowId } from "../../types"
import CornerBrackets from "../common/CornerBrackets"


interface ShadowArmyProps {
  shadows: ShadowSoldier[]
  onExtractShadow: (shadowId: ShadowId) => void
  onAssignCategory: (shadowId: ShadowId, category: string) => void
}

const SHADOW_ICONS: Record<string, React.ReactNode> = {
  Sword: <Sword className="w-6 h-6 text-red-400" />,
  Shield: <Shield className="w-6 h-6 text-blue-400" />,
  Wand2: <Wand2 className="w-6 h-6 text-purple-400" />,
  Zap: <Zap className="w-6 h-6 text-cyan-400" />,
  Crown: <Crown className="w-6 h-6 text-amber-400" />,
}

const CATEGORIES = ["Fitness", "Health", "Study", "Work", "Productivity", "Personal"]

export default function ShadowArmy({ shadows, onExtractShadow, onAssignCategory }: ShadowArmyProps) {
  const totalExtracted = shadows.filter((s) => s.extracted).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Shadow Monarch Army
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-0.5">
            Command extracted shadows to multiply XP & Stat yields in assigned habit categories
          </p>
        </div>

        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-xs font-mono text-purple-300">
          ARMY SIZE: {totalExtracted} SOLDIERS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shadows.map((shadow) => (
          <div
            key={shadow.id}
            className={`system-panel p-6 relative overflow-hidden transition-all ${
              shadow.extracted
                ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                : "border-slate-800 opacity-60"
            }`}
          >
            <CornerBrackets />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    shadow.extracted
                      ? "bg-purple-950/60 border-purple-500/60 shadow-[0_0_16px_rgba(168,85,247,0.5)]"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  {SHADOW_ICONS[shadow.icon] || <Zap className="w-6 h-6 text-purple-400" />}
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg font-display tracking-wide">
                    {shadow.name}
                  </h3>
                  <p className="text-purple-300 text-xs font-mono">{shadow.title}</p>
                </div>
              </div>

              {shadow.extracted ? (
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              ) : (
                <Lock className="w-5 h-5 text-slate-600" />
              )}
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 mb-4 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>COMBAT POWER:</span>
                <span className="text-purple-300 font-bold">{shadow.power} CP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>XP MULTIPLIER:</span>
                <span className="text-cyan-400 font-bold">+{Math.round((shadow.xpMultiplier - 1) * 100)}% XP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ASSIGNED ZONE:</span>
                <span className="text-amber-400 font-bold">{shadow.assignedCategory || "Unassigned"}</span>
              </div>
            </div>

            {shadow.extracted ? (
              <div className="space-y-2">
                <label className="text-[0.65rem] font-mono text-slate-400 uppercase tracking-widest block">
                  Assign Category Buff:
                </label>
                <select
                  value={shadow.assignedCategory || ""}
                  onChange={(e) => onAssignCategory(shadow.id, e.target.value)}
                  className="w-full bg-slate-900 border border-purple-500/40 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">-- Choose Category --</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} (+{Math.round((shadow.xpMultiplier - 1) * 100)}% XP)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <button
                onClick={() => onExtractShadow(shadow.id)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
              >
                ARISE (EXTRACT SHADOW)
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
