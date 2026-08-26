import { Flame, Trophy, CheckCircle2 } from "lucide-react"
import type { NotificationEntry } from "../../types"

interface NotificationLogPanelProps {
  entries: NotificationEntry[]
}

const ICONS: Record<NotificationEntry["type"], typeof CheckCircle2> = {
  quest: CheckCircle2,
  levelup: Flame,
  achievement: Trophy,
}

const ICON_COLORS: Record<NotificationEntry["type"], string> = {
  quest: "text-blue-400",
  levelup: "text-amber-400",
  achievement: "text-violet-400",
}

function formatTime(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function NotificationLogPanel({ entries }: NotificationLogPanelProps) {
  const recent = [...entries].reverse().slice(0, 20)

  return (
    <div className="system-panel p-4 mb-6">
      <p className="system-panel-header mb-3">System Log</p>
      {recent.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No activity yet. Complete a quest to begin your log.
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {recent.map((entry) => {
            const Icon = ICONS[entry.type]
            return (
              <div
                key={entry.id}
                className="flex items-start gap-2.5 text-xs border-b border-blue-900/20 last:border-0 pb-2 last:pb-0"
              >
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${ICON_COLORS[entry.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200">{entry.message}</p>
                  {entry.subtext && (
                    <p className="text-slate-500">{entry.subtext}</p>
                  )}
                </div>
                <span className="text-slate-600 font-mono whitespace-nowrap">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
