import { icons } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useAchievements } from "../../hooks/useAchievements"

function AchievementIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
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
      <h1 className="text-2xl font-bold text-white mb-1">Achievements</h1>
      <p className="text-slate-400 mb-6">
        {unlockedCount} / {achievements.length} unlocked
      </p>

      {achievements.length === 0 ? (
        <p className="text-slate-400">
          Complete habits to unlock achievements.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => {
            const unlocked = !!a.unlockedAt
            return (
              <div
                key={a.id}
                className={`rounded-xl p-4 border flex items-start gap-3 ${
                  unlocked
                    ? "bg-slate-900 border-emerald-800"
                    : "bg-slate-900/50 border-slate-800 opacity-60"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    unlocked ? "bg-emerald-500/10" : "bg-slate-800"
                  }`}
                >
                  <AchievementIcon
                    name={a.icon}
                    className={`w-5 h-5 ${
                      unlocked ? "text-emerald-400" : "text-slate-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{a.name}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {a.description}
                  </p>
                  {unlocked && (
                    <p className="text-emerald-500 text-xs mt-2">
                      Unlocked {new Date(a.unlockedAt!).toLocaleDateString()}
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
