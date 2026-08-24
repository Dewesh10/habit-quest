import { NavLink } from "react-router-dom"
import { LayoutDashboard, ListChecks, BarChart3, Trophy, Settings } from "lucide-react"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 px-4 py-6">
      <h1 className="text-xl font-bold text-emerald-400 mb-8 px-2">Habit Quest</h1>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 py-4 rounded-lg bg-slate-800/50 text-sm">
        <p className="text-slate-400">Level</p>
        <p className="text-2xl font-bold text-white">8</p>
        <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: "60%" }} />
        </div>
      </div>
    </aside>
  )
}
