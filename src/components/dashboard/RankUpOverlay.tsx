import { useEffect, useState } from "react"

interface RankUpOverlayProps {
  rank: string
  title: string
  onDone: () => void
}

export default function RankUpOverlay({ rank, title, onDone }: RankUpOverlayProps) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const closeTimer = setTimeout(() => setClosing(true), 3600)
    const doneTimer = setTimeout(onDone, 4000)
    return () => {
      clearTimeout(closeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center transition-opacity duration-500 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      <div className="absolute inset-0 bg-amber-300/25 rankup-flash" />

      {[0, 200, 400].map((delay) => (
        <div
          key={delay}
          className="absolute w-40 h-40 rounded-full border-2 border-amber-300/80 rankup-shockwave"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}

      <div className="relative text-center px-6">
        <p className="system-panel-header mb-3 text-amber-300 tracking-[0.3em]">
          Rank Advancement
        </p>

        <div className="relative inline-block rankup-letter-in">
          <div className="relative w-44 h-44 md:w-56 md:h-56 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-300 shadow-[0_0_60px_10px_rgba(252,211,77,0.6)]" />
            <div className="absolute inset-3 rounded-full border border-amber-200/40" />
            <span className="font-display text-8xl md:text-9xl font-black text-amber-200 relative overflow-hidden">
              {rank}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent rankup-shine" />
            </span>
          </div>
        </div>

        <p className="font-display text-2xl md:text-3xl tracking-[0.15em] text-white uppercase mt-6 mb-1">
          {title}
        </p>
        <p className="text-amber-200/80 text-sm tracking-wide">
          Your rank has increased, Hunter.
        </p>
      </div>
    </div>
  )
}
