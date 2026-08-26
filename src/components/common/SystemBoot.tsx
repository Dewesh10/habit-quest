import { useEffect, useState } from "react"

export default function SystemBoot({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0)

  const lines = [
    "INITIALIZING SYSTEM...",
    "SYNCHRONIZING PLAYER DATA...",
    "STATUS WINDOW READY",
  ]

  useEffect(() => {
    if (line >= lines.length) {
      const timer = setTimeout(onDone, 400)
      return () => clearTimeout(timer)
    }
    const timer = setTimeout(() => setLine((l) => l + 1), 450)
    return () => clearTimeout(timer)
  }, [line])

  return (
    <div className="fixed inset-0 z-[100] bg-[#05070f] flex items-center justify-center">
      <div className="system-panel px-8 py-6 min-w-[320px]">
        <div className="system-panel-scan" style={{ top: 0 }} />
        <p className="system-panel-header mb-4">System</p>
        <div className="space-y-2 font-mono text-sm">
          {lines.slice(0, line).map((l, i) => (
            <p key={i} className="text-blue-300">
              &gt; {l}
            </p>
          ))}
          {line < lines.length && (
            <p className="text-blue-400 animate-pulse">▋</p>
          )}
        </div>
      </div>
    </div>
  )
}