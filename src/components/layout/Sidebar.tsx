import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ListChecks,
  Swords,
  ShoppingBag,
  Zap,
  BarChart3,
  Trophy,
  Settings,
  Sparkles,
} from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { calculateXP, calculateLevel } from "../../utils/stats"
import { getRank } from "../../utils/rank"

const navItems = [
  { to: "/", label: "Status Window", icon: LayoutDashboard },
  { to: "/habits", label: "Quest Log", icon: ListChecks },
  { to: "/dungeons", label: "Dungeons & Shadows", icon: Swords },
  { to: "/shop", label: "Inventory & Shop", icon: ShoppingBag },
  { to: "/skills", label: "Skills Tree", icon: Zap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/achievements", label: "Titles", icon: Trophy },
  { to: "/settings", label: "System Config", icon: Settings },
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
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-950 border-r border-cyan-900/40 h-screen sticky top-0 px-4 py-6 z-20">
      <div className="flex items-center gap-2 mb-6 px-2">
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h1 className="font-display text-xl font-bold text-white tracking-wider uppercase">
          SOLO LEVELING
        </h1>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border-l-2 ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-300 border-cyan-400 shadow-[0_0_16px_rgba(56,189,248,0.3)]"
                  : "text-slate-400 border-transparent hover:text-white hover:bg-slate-900"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto hero-panel p-4 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              <polygon
                points="50,4 93,27 93,73 50,96 7,73 7,27"
                fill="rgba(56,189,248,0.1)"
                stroke="#38bdf8"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-base font-bold text-cyan-300">
                {rank}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold font-mono truncate">{title}</p>
            <p className="text-cyan-400 text-[0.65rem] font-mono">Lv. {level}</p>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden border border-cyan-900/40">
          <div
            className="h-full bg-cyan-400"
            style={{ width: `${pct}%`, boxShadow: "0 0 6px rgba(56,189,248,0.6)" }}
          />
        </div>
      </div>
    </aside>
  )
}