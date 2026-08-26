import { NavLink } from "react-router-dom"
import { LayoutDashboard, ListChecks, BarChart3, Trophy, Settings } from "lucide-react"

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/habits", label: "Quests", icon: ListChecks },
  { to: "/analytics", label: "Stats", icon: BarChart3 },
  { to: "/achievements", label: "Titles", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-blue-900/30 flex justify-around items-center h-16 px-2 z-50 shadow-[0_-4px_20px_rgba(56,189,248,0.15)]">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-xs flex-1 h-full transition-colors ${
              isActive ? "text-blue-400" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                className={isActive ? "drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]" : ""}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}