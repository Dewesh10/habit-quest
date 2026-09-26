import { NavLink } from "react-router-dom"
import { LayoutDashboard, ListChecks, Swords, ShoppingBag, Zap, Trophy } from "lucide-react"

const navItems = [
  { to: "/", label: "Status", icon: LayoutDashboard },
  { to: "/habits", label: "Quests", icon: ListChecks },
  { to: "/dungeons", label: "Gates", icon: Swords },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/skills", label: "Skills", icon: Zap },
  { to: "/achievements", label: "Titles", icon: Trophy },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-cyan-900/40 flex justify-around items-center h-16 px-1 z-50 shadow-[0_-4px_20px_rgba(56,189,248,0.2)]">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[0.65rem] font-mono flex-1 h-full transition-colors ${
              isActive ? "text-cyan-400" : "text-slate-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={18}
                className={isActive ? "drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" : ""}
              />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}