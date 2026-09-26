import { useState } from "react"
import { Swords, Sparkles, CheckCircle2 } from "lucide-react"
import type { DungeonGate, ShadowSoldier, ShadowId } from "../../types"
import CornerBrackets from "../../components/common/CornerBrackets"
import ShadowArmy from "../../components/dungeons/ShadowArmy"
import DungeonBattleArena from "../../components/dungeons/DungeonBattleArena"

interface DungeonsProps {
  gates: DungeonGate[]
  shadows: ShadowSoldier[]
  onClearGate: (gateId: string) => void
  onExtractShadow: (shadowId: ShadowId) => void
  onAssignCategory: (shadowId: ShadowId, category: string) => void
}

const RANK_BADGES: Record<string, string> = {
  E: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  C: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  A: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  S: "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
}

export default function Dungeons({
  gates,
  shadows,
  onClearGate,
  onExtractShadow,
  onAssignCategory,
}: DungeonsProps) {
  const [activeBattleGate, setActiveBattleGate] = useState<DungeonGate | null>(null)

  return (
    <div className="space-y-8">
      {/* Battle Arena Modal */}
      {activeBattleGate && (
        <DungeonBattleArena
          gate={activeBattleGate}
          playerLevel={15}
          shadows={shadows}
          onBattleVictory={onClearGate}
          onExtractShadow={onExtractShadow}
          onClose={() => setActiveBattleGate(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
            Dungeon Gates & Raids
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-0.5">
            Defeat Dungeon Bosses to earn Gold and extract Shadow Soldiers
          </p>
        </div>

        <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-xs font-mono text-red-400">
          INSTANT DUNGEON: AVAILABLE
        </div>
      </div>

      {/* Instant Dungeon Special Challenge Banner */}
      <div className="hero-panel p-6 relative overflow-hidden">
        <CornerBrackets />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" /> SPECIAL INSTANT DUNGEON
            </div>
            <h2 className="font-display text-xl font-bold text-white uppercase tracking-wide">
              Cartenon Temple Double Dungeon
            </h2>
            <p className="text-slate-300 text-sm font-mono mt-1">
              Objective: Complete 3 Quests back-to-back today without failure.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 block">REWARD:</span>
              <span className="text-amber-400 font-bold text-sm">+500 GOLD / +3 AP</span>
            </div>
            <button
              onClick={() => alert("Instant Dungeon challenge accepted! Complete 3 quests today to claim +500 Gold & +3 AP.")}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
            >
              ENTER INSTANT DUNGEON
            </button>
          </div>
        </div>
      </div>

      {/* Standard Gates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gates.map((gate) => {
          const pct = Math.min(100, Math.round((gate.currentProgress / gate.requiredMissions) * 100))
          const canFightBoss = gate.currentProgress >= gate.requiredMissions && !gate.cleared

          return (
            <div
              key={gate.id}
              className={`system-panel p-6 relative overflow-hidden ${
                gate.cleared ? "border-emerald-500/30" : "border-cyan-900/40"
              }`}
            >
              <CornerBrackets />

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <Swords className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span
                      className={`inline-block text-[0.65rem] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        RANK_BADGES[gate.rank]
                      }`}
                    >
                      {gate.rank}-RANK GATE
                    </span>
                    <h3 className="text-white font-bold text-lg font-display tracking-wide mt-1">
                      {gate.name}
                    </h3>
                  </div>
                </div>

                {gate.cleared && (
                  <span className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> CLEARED
                  </span>
                )}
              </div>

              {/* Boss Info */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 mb-4 font-mono text-xs">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>BOSS:</span>
                  <span className="text-red-400 font-bold">{gate.bossName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>REWARDS:</span>
                  <span className="text-amber-400 font-bold">
                    +{gate.goldReward} Gold &middot; +{gate.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Mission Progress Bar */}
              <div className="mb-4 font-mono text-xs">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>GATE CLEARANCE PROGRESS:</span>
                  <span className="text-cyan-400">
                    {gate.currentProgress} / {gate.requiredMissions} Missions
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      gate.cleared
                        ? "bg-emerald-400"
                        : canFightBoss
                        ? "bg-amber-400 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                        : "bg-cyan-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setActiveBattleGate(gate)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all"
                >
                  {gate.cleared ? "RE-ENTER BOSS ARENA" : canFightBoss ? "ENTER BOSS ARENA & EXTRACT SHADOW" : "ENTER DUNGEON ARENA"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Embedded Shadow Army Section */}
      <div className="pt-6 border-t border-slate-800">
        <ShadowArmy
          shadows={shadows}
          onExtractShadow={onExtractShadow}
          onAssignCategory={onAssignCategory}
        />
      </div>
    </div>
  )
}
