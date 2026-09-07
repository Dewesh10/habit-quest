import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useAchievements } from "../../hooks/useAchievements"
import { achievementDefs } from "../../data/achievementDefs"
import CornerBrackets from "../../components/common/CornerBrackets"
import { getCriteriaProgress } from "../../utils/achievementProgress"

function AchievementIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

function getTier(id: string): { label: string; glow: string; ring: string } {
  const def = achievementDefs.find((d) => d.id === id)
  const target = def?.criteria.target ?? 0
  if (target >= 100 || target >= 30) {
    return { label: "GOLD", glow: "shadow-[0_0_20px_rgba(250,204,21,0.4)]", ring: "border-yellow-400/60" }
  }
  if (target >= 7 || target >= 500) {
    return { label: "SILVER", glow: "shadow-[0_0_16px_rgba(148,163,184,0.4)]", ring: "border-slate-300/50" }
  }
  return { label: "BRONZE", glow: "shadow-[0_0_14px_rgba(180,120,80,0.4)]", ring: "border-orange-700/60" }
}

export default function Achievements() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()
  const { achievements, loaded: achievementsLoaded } = useAchievements(
    habits,
    completions
  )

  if (!habitsLoaded || !completionsLoaded || !achievementsLoaded) {
    return <p className="text-slate-400">Loading...</p>
  }

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length
  const overallPct = achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0

  const nextUp = achievements
    .filter((a) => !a.unlockedAt)
    .map((a) => {
      const def = achievementDefs.find((d) => d.id === a.id)
      const current = def ? getCriteriaProgress(def.criteria, habits, completions) : 0
      const target = def?.criteria.target ?? 1
      const pct = Math.min(100, Math.round((current / target) * 100))
      return { ...a, current, target, pct }
    })
    .sort((a, b) => b.pct - a.pct)[0]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1 uppercase tracking-wide">Titles</h1>
      <p className="text-slate-500 mb-6 text-sm">
        {unlockedCount} / {achievements.length} earned
      </p>

      {achievements.length > 0 && (
        <div className="system-panel relative p-4 mb-6">
          <CornerBrackets />
          <div className="flex items-center justify-between mb-2">
            <span className="system-panel-header">Collection Progress</span>
            <span className="text-xs text-slate-400 font-mono">{overallPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
              style={{ width: `${overallPct}%`, boxShadow: "0 0 8px rgba(56,189,248,0.7)" }}
            />
          </div>
          {nextUp && (
            <p className="text-slate-400 text-xs">
              Closest to unlock:{" "}
              <span className="text-blue-300 font-medium">{nextUp.name}</span>{" "}
              <span className="font-mono">
                ({nextUp.current} / {nextUp.target})
              </span>
            </p>
          )}
        </div>
      )}

      {achievements.length === 0 ? (
        <p className="text-slate-400">
          Complete quests to earn titles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => {
            const unlocked = !!a.unlockedAt
            const tier = getTier(a.id)
            const def = achievementDefs.find((d) => d.id === a.id)
            const current = def ? getCriteriaProgress(def.criteria, habits, completions) : 0
            const target = def?.criteria.target ?? 1
            const pct = Math.min(100, Math.round((current / target) * 100))

            return (
              <div
                key={a.id}
                className={`${
                  unlocked && tier.label === "GOLD" ? "hero-panel" : "system-panel"
                } relative p-4 flex flex-col gap-3 ${
                  unlocked ? tier.glow : ""
                }`}
              >
                <CornerBrackets />
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg border-2 ${
                      unlocked ? tier.ring : "border-slate-700"
                    } ${unlocked ? "bg-blue-500/10" : "bg-slate-800"}`}
                  >
                    <AchievementIcon
                      name={a.icon}
                      className={`w-5 h-5 ${unlocked ? "text-blue-300" : "text-slate-500"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-sm ${unlocked ? "text-white" : "text-slate-300"}`}>
                        {a.name}
                      </p>
                      {unlocked && (
                        <span className="text-[0.55rem] tracking-widest text-slate-400 font-mono shrink-0">
                          {tier.label}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-1">{a.description}</p>
                    {unlocked && (
                      <p className="text-blue-400 text-xs mt-2 font-mono">
                        Earned {new Date(a.unlockedAt!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {!unlocked && (
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[0.6rem] tracking-widest text-slate-600 uppercase">Progress</span>
                      <span className="text-[0.65rem] font-mono text-slate-500">
                        {current} / {target}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
