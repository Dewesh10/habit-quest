import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useAchievements } from "../../hooks/useAchievements"
import { achievementDefs } from "../../data/achievementDefs"
import CornerBrackets from "../../components/common/CornerBrackets"

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

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-1 uppercase tracking-wide">Titles</h1>
      <p className="text-slate-500 mb-6 text-sm">
        {unlockedCount} / {achievements.length} earned
      </p>

      {achievements.length === 0 ? (
        <p className="text-slate-400">
          Complete quests to earn titles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => {
            const unlocked = !!a.unlockedAt
            const tier = getTier(a.id)
            return (
              <div
                key={a.id}
                className={`${
                  unlocked && tier.label === "GOLD" ? "hero-panel" : "system-panel"
                } relative p-4 flex items-start gap-3 ${
                  unlocked ? tier.glow : "opacity-50"
                }`}
              >
                <CornerBrackets />
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
                    <p className="text-white font-semibold text-sm">{a.name}</p>
                    {unlocked && (
                      <span className="text-[0.55rem] tracking-widest text-slate-400 font-mono">
                        {tier.label}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{a.description}</p>
                  {unlocked && (
                    <p className="text-blue-400 text-xs mt-2 font-mono">
                      Earned {new Date(a.unlockedAt!).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}