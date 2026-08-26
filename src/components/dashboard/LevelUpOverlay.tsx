import { useEffect, useState } from "react"

interface LevelUpOverlayProps {
  level: number
  onDone: () => void
}

export default function LevelUpOverlay({ level, onDone }: LevelUpOverlayProps) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const closeTimer = setTimeout(() => setClosing(true), 2600)
    const doneTimer = setTimeout(onDone, 3000)
    return () => {
      clearTimeout(closeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-400 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-blue-400/20 levelup-flash" />

      <div className="absolute w-[520px] h-[520px] rounded-full border-2 border-cyan-300/70 levelup-ring" />
      <div
        className="absolute w-[520px] h-[520px] rounded-full border-2 border-blue-400/60 levelup-ring"
        style={{ animationDelay: "150ms" }}
      />

      <div className="relative text-center levelup-title-in px-6">
        <p className="system-panel-header mb-3 text-cyan-300">System Alert</p>
        <p className="font-display text-lg md:text-2xl tracking-[0.3em] text-blue-300 uppercase mb-2">
          Level Up
        </p>
        <p className="font-display text-7xl md:text-9xl font-black text-white leading-none neon-text">
          {level}
        </p>
        <p className="text-slate-400 text-sm mt-4 tracking-wide">
          A new level has been reached, Hunter.
        </p>
      </div>
    </div>
  )
}
