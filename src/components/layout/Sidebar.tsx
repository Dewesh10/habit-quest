import { NavLink } from "react-router-dom"
import { LayoutDashboard, ListChecks, BarChart3, Trophy, Settings } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { calculateXP, calculateLevel } from "../../utils/stats"
import { getRank } from "../../utils/rank"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Quest Log", icon: ListChecks },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/achievements", label: "Titles", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()

  const ready = habitsLoaded && completionsLoaded
  const xp = ready ? calculateXP(habits, completions) : 0
  const { level, currentLevelXP, nextLevelXP } = calculateLevel(xp)
  const { rank, title } = getRank(level)
  const pct = Math.min(100, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-slate-900 border-r border-blue-900/30 h-screen sticky top-0 px-4 py-6">
      <h1 className="font-display text-xl font-bold text-blue-400 mb-8 px-2 tracking-wide uppercase">
        Habit Quest
      </h1>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium border-l-2 ${
                isActive
                  ? "bg-blue-500/20 text-blue-400 border-blue-400 neon-glow"
                  : "text-slate-300 border-transparent hover:text-white hover:bg-slate-800/80"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto hero-panel p-4 relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <polygon
                points="50,4 93,27 93,73 50,96 7,73 7,27"
                fill="rgba(56,189,248,0.1)"
                stroke="#38bdf8"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-lg font-bold text-blue-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]">
                {rank}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{title}</p>
            <p className="text-slate-500 text-xs font-mono">Lv. {level}</p>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden border border-blue-900/40">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
            style={{ width: `${pct}%`, boxShadow: "0 0 6px rgba(56,189,248,0.6)" }}
          />
        </div>
      </div>
    </aside>
  )
}