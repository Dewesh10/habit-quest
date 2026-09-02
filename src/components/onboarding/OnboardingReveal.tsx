import { useState } from "react"
import { icons } from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"
import type { QuizAnswers } from "../../utils/onboardingScoring"
import {
  computeStats,
  project30Days,
  buildSuggestedHabits,
  buildNarrative,
} from "../../utils/onboardingScoring"
import { getHabitColorClasses } from "../../utils/colorMap"

interface OnboardingRevealProps {
  name: string
  answers: QuizAnswers
  onDone: (habits: ReturnType<typeof buildSuggestedHabits>) => void
}

function HabitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

const STAT_LABELS: Record<string, string> = {
  WIL: "Willpower",
  STR: "Strength",
  INT: "Intelligence",
  DIL: "Diligence",
  VIT: "Vitality",
}

export default function OnboardingReveal({ name, answers, onDone }: OnboardingRevealProps) {
  const [page, setPage] = useState(0)

  const stats = computeStats(answers)
  const projection = project30Days(answers)
  const habits = buildSuggestedHabits(answers)
  const narrative = buildNarrative(name, answers)

  const chartData = Object.entries(stats).map(([key, value]) => ({
    stat: key,
    fullLabel: STAT_LABELS[key],
    value,
  }))

  const maxStat = Math.max(...Object.values(stats), 20)

  const pages = [
    // Page 0: narrative reflection
    <div key="narrative" className="route-fade-in">
      <span className="inline-block text-[0.65rem] tracking-widest uppercase text-blue-300 border border-blue-900/50 rounded-full px-3 py-1 mb-6">
        We See You
      </span>
      <h1 className="font-display text-2xl md:text-3xl font-bold italic text-white leading-tight mb-6">
        Your answers have been read, {name}.
      </h1>
      <div className="system-panel p-5">
        <p className="text-slate-200 leading-relaxed">{narrative}</p>
      </div>
    </div>,

    // Page 1: life map radar
    <div key="lifemap" className="route-fade-in">
      <span className="inline-block text-[0.65rem] tracking-widest uppercase text-blue-300 border border-blue-900/50 rounded-full px-3 py-1 mb-6">
        Your Profile
      </span>
      <h1 className="font-display text-2xl md:text-3xl font-bold italic text-white leading-tight mb-2">
        Your Life Map
      </h1>
      <p className="text-slate-500 text-sm mb-6">Built entirely from your answers.</p>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="72%">
            <PolarGrid stroke="#1e3a5f" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: "#7dd3fc", fontSize: 12, fontFamily: "monospace" }} />
            <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.35} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center bg-slate-900/60 border border-blue-900/30 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-400">{STAT_LABELS[key]}</span>
            <span className="font-mono text-white text-sm">{value}</span>
          </div>
        ))}
      </div>
    </div>,

    // Page 2: 30-day projection
    <div key="projection" className="route-fade-in">
      <span className="inline-block text-[0.65rem] tracking-widest uppercase text-blue-300 border border-blue-900/50 rounded-full px-3 py-1 mb-6">
        The Projection
      </span>
      <h1 className="font-display text-2xl md:text-3xl font-bold italic text-white leading-tight mb-6">
        Where you could be in 30 days
      </h1>
      <div className="system-panel p-6 text-center mb-4">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">At {projection.missionsPerDay} quests a day</p>
        <p className="font-display text-6xl font-black text-blue-300 mb-1">Lv.{projection.level}</p>
        <p className="text-slate-400 text-sm">{projection.missionsTotal} quests completed &middot; {projection.totalXP} XP earned</p>
      </div>
      <p className="text-slate-500 text-xs text-center">
        This is not a guess — it is {projection.missionsPerDay} &times; 15 XP &times; 30 days, the same math your dashboard will use every day.
      </p>
    </div>,

    // Page 3: suggested habits
    <div key="habits" className="route-fade-in">
      <span className="inline-block text-[0.65rem] tracking-widest uppercase text-blue-300 border border-blue-900/50 rounded-full px-3 py-1 mb-6">
        Your Quests
      </span>
      <h1 className="font-display text-2xl md:text-3xl font-bold italic text-white leading-tight mb-2">
        Built for what you told us
      </h1>
      <p className="text-slate-500 text-sm mb-6">You can edit or remove any of these later.</p>
      <div className="flex flex-col gap-2.5">
        {habits.map((h) => {
          const colors = getHabitColorClasses(h.color)
          return (
            <div key={h.name} className="flex items-center gap-3 bg-slate-900/60 border border-blue-900/30 rounded-xl px-4 py-3">
              <div className={`p-2 rounded-lg ${colors.bgSoft}`}>
                <HabitIcon name={h.icon} className={`w-4 h-4 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{h.name}</p>
                <p className="text-slate-500 text-xs">{h.category}</p>
              </div>
              <span className="text-blue-400 text-xs font-mono">+{h.xpValue} XP</span>
            </div>
          )
        })}
      </div>
    </div>,
  ]

  const isLast = page === pages.length - 1

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col px-6 py-8 max-w-lg mx-auto">
      <div className="flex-1">{pages[page]}</div>
      <button
        onClick={() => (isLast ? onDone(habits) : setPage((p) => p + 1))}
        className="mt-8 bg-blue-500 hover:bg-blue-400 text-slate-950 font-semibold py-3.5 rounded-xl transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
