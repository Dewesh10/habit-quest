import { Dumbbell, Trophy, CheckCircle } from "lucide-react"
import type { DailyQuestFixed } from "../../types"
import CornerBrackets from "../common/CornerBrackets"


interface DailyQuestPanelProps {
  quests: DailyQuestFixed[]
  onIncrement: (questId: string, amount: number) => void
}

export default function DailyQuestPanel({ quests, onIncrement }: DailyQuestPanelProps) {
  const allCompleted = quests.every((q) => q.completed)
  const totalCompletedCount = quests.filter((q) => q.completed).length

  return (
    <div className="system-panel p-5 md:p-6 mb-6 relative overflow-hidden">
      <CornerBrackets />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="system-panel-header">DAILY QUEST</span>
            <span className="text-[0.65rem] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              NON-SKIPPABLE
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-white tracking-wide mt-1">
            Preparations to Become Strong
          </h2>
        </div>

        <div className="text-right font-mono text-xs">
          <p className="text-slate-400">PROGRESS</p>
          <p className="text-cyan-400 text-lg font-bold">
            {totalCompletedCount} / {quests.length}
          </p>
        </div>
      </div>

      {allCompleted && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-emerald-300 text-xs font-bold font-mono">DAILY QUEST COMPLETED!</p>
            <p className="text-slate-400 text-xs">Full recovery granted + Free Stat Point awarded!</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quests.map((quest) => {
          const pct = Math.min(100, Math.round((quest.current / quest.target) * 100))
          return (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border transition-all ${
                quest.completed
                  ? "bg-slate-900/40 border-emerald-500/30"
                  : "bg-slate-900/80 border-cyan-900/40 hover:border-cyan-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className={`w-4 h-4 ${quest.completed ? "text-emerald-400" : "text-cyan-400"}`} />
                  <span className="text-white text-sm font-semibold">{quest.title}</span>
                </div>
                {quest.completed ? (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                    <CheckCircle className="w-3.5 h-3.5" /> DONE
                  </span>
                ) : (
                  <span className="text-xs font-mono text-slate-400">
                    {quest.current} / {quest.target} {quest.unit}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    quest.completed ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {!quest.completed && (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onIncrement(quest.id, quest.unit === "km" ? 1 : 10)}
                    className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-xs font-mono transition-colors"
                  >
                    +{quest.unit === "km" ? "1 km" : "10 reps"}
                  </button>
                  <button
                    onClick={() => onIncrement(quest.id, quest.target - quest.current)}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs font-mono transition-colors"
                  >
                    COMPLETE
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
