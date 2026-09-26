import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Swords, Zap, Sparkles, Skull, Trophy } from "lucide-react"
import type { DungeonGate, ShadowSoldier, ShadowId } from "../../types"
import { soundEngine } from "../../utils/soundEngine"


interface DungeonBattleArenaProps {
  gate: DungeonGate
  playerLevel: number
  shadows: ShadowSoldier[]
  onBattleVictory: (gateId: string) => void
  onExtractShadow: (shadowId: ShadowId) => void
  onClose: () => void
}

export default function DungeonBattleArena({
  gate,
  playerLevel,
  shadows,
  onBattleVictory,
  onExtractShadow,
  onClose,
}: DungeonBattleArenaProps) {
  const [bossHP, setBossHP] = useState(gate.bossMaxHP)
  const [playerHP, setPlayerHP] = useState(100)
  const [combatLogs, setCombatLogs] = useState<string[]>([
    `[SYSTEM] Entered ${gate.name}. Boss ${gate.bossName} has appeared!`,
  ])
  const [damagePopup, setDamagePopup] = useState<{ amount: number; isCrit: boolean } | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const [isDefeated, setIsDefeated] = useState(false)

  const extractedShadows = shadows.filter((s) => s.extracted)

  function triggerScreenShake() {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 300)
  }

  function handlePlayerAttack(type: "basic" | "skill" | "shadow") {
    if (bossHP <= 0 || playerHP <= 0) return

    let dmg = 0
    let isCrit = false
    let logMsg = ""

    if (type === "basic") {
      dmg = Math.floor(Math.random() * 20 + playerLevel * 3 + 15)
      logMsg = `You executed Knight Killer Dagger Slash dealing ${dmg} damage!`
      soundEngine.playQuestChime()
    } else if (type === "skill") {
      dmg = Math.floor(Math.random() * 40 + playerLevel * 5 + 35)
      isCrit = Math.random() > 0.4
      if (isCrit) dmg = Math.floor(dmg * 1.5)
      logMsg = `Unleashed [Ruler's Authority]! Telekinetic strike deals ${dmg} CRITICAL damage!`
      soundEngine.playLevelUpFanfare()
    } else if (type === "shadow") {
      const shadowPower = extractedShadows.reduce((sum, s) => sum + s.power, 0)
      dmg = Math.floor(shadowPower * 0.15 + 40)
      logMsg = `Shadow Army Commander Strike! All shadows attack dealing ${dmg} damage!`
      soundEngine.playAriseSound()
    }

    triggerScreenShake()
    setDamagePopup({ amount: dmg, isCrit })
    setTimeout(() => setDamagePopup(null), 1000)

    const nextBossHP = Math.max(0, bossHP - dmg)
    setBossHP(nextBossHP)
    setCombatLogs((prev) => [logMsg, ...prev.slice(0, 4)])

    if (nextBossHP <= 0) {
      setIsDefeated(true)
      soundEngine.speakSystemDirective(`Boss ${gate.bossName} defeated. Clearance confirmed.`)
      onBattleVictory(gate.id)
      return
    }

    // Boss Retaliation Attack
    setTimeout(() => {
      const bossDmg = Math.floor(Math.random() * 15 + 5)
      setPlayerHP((prev) => Math.max(0, prev - bossDmg))
      setCombatLogs((prev) => [
        `${gate.bossName} retaliated with dark magic dealing ${bossDmg} damage!`,
        ...prev.slice(0, 4),
      ])
    }, 600)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          className={`relative w-full max-w-2xl bg-slate-950 border-2 ${
            isDefeated ? "border-emerald-500 shadow-[0_0_60px_rgba(52,211,153,0.5)]" : "border-red-500/80 shadow-[0_0_60px_rgba(239,68,68,0.5)]"
          } rounded-2xl p-6 overflow-hidden ${isShaking ? "animate-bounce" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-red-400 animate-pulse" />
              <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
                DUNGEON RAID ARENA &middot; {gate.rank}-RANK
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-mono text-slate-400 hover:text-white border border-slate-800 px-3 py-1 rounded"
            >
              RETREAT (ESC)
            </button>
          </div>

          {/* Boss Stage */}
          <div className="relative p-6 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 text-center overflow-hidden">
            {damagePopup && (
              <div
                className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-4xl font-black ${
                  damagePopup.isCrit ? "text-amber-400 animate-ping" : "text-red-500 animate-bounce"
                }`}
              >
                -{damagePopup.amount} {damagePopup.isCrit ? "CRIT!" : ""}
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-xs mb-3">
              <Skull className="w-4 h-4 text-red-400" /> BOSS ENCOUNTER
            </div>

            <h3 className="font-display text-3xl font-black text-white uppercase tracking-wider mb-2">
              {gate.bossName}
            </h3>

            {/* Boss HP Bar */}
            <div className="w-full max-w-md mx-auto mb-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>BOSS HP:</span>
                <span className="text-red-400 font-bold">{bossHP} / {gate.bossMaxHP}</span>
              </div>
              <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-red-900">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                  style={{ width: `${Math.min(100, (bossHP / gate.bossMaxHP) * 100)}%` }}
                />
              </div>
            </div>

            {/* Player HP */}
            <div className="w-full max-w-md mx-auto font-mono text-xs">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>PLAYER HEALTH:</span>
                <span className="text-cyan-400 font-bold">{playerHP} / 100</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-cyan-900">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${playerHP}%` }}
                />
              </div>
            </div>
          </div>

          {/* Combat Actions */}
          {!isDefeated ? (
            <div className="grid grid-cols-3 gap-3 mb-6 font-mono text-xs">
              <button
                onClick={() => handlePlayerAttack("basic")}
                className="py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold flex flex-col items-center gap-1 transition-all"
              >
                <Swords className="w-5 h-5 text-cyan-400" />
                <span>DAGGER STRIKE</span>
              </button>

              <button
                onClick={() => handlePlayerAttack("skill")}
                className="py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg font-bold flex flex-col items-center gap-1 transition-all"
              >
                <Zap className="w-5 h-5 text-purple-400" />
                <span>RULER'S AUTHORITY</span>
              </button>

              <button
                onClick={() => handlePlayerAttack("shadow")}
                disabled={extractedShadows.length === 0}
                className={`py-3 rounded-lg font-bold flex flex-col items-center gap-1 transition-all ${
                  extractedShadows.length > 0
                    ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                    : "bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>SHADOW COMMAND</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center mb-6">
              <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-display text-2xl font-black text-emerald-300 uppercase mb-1">
                DUNGEON BOSS DEFEATED!
              </h4>
              <p className="text-slate-300 text-xs font-mono mb-4">
                +{gate.goldReward} Gold &middot; +{gate.xpReward} XP Awarded!
              </p>

              {gate.shadowRewardId && (
                <button
                  onClick={() => {
                    onExtractShadow(gate.shadowRewardId!)
                    onClose()
                  }}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-sm uppercase tracking-widest rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all animate-bounce"
                >
                  ARISE (EXTRACT SHADOW SOLDIER)
                </button>
              )}
            </div>
          )}

          {/* Combat Log */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
            <span className="text-cyan-400 font-bold block mb-1">&gt; COMBAT LOG:</span>
            {combatLogs.map((log, i) => (
              <p key={i} className="truncate">
                &middot; {log}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
