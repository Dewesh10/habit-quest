import { useEffect, useState } from "react"
import { ShieldCheck } from "lucide-react"

interface GateClearOverlayProps {
  onDone: () => void
}

export default function GateClearOverlay({ onDone }: GateClearOverlayProps) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const closeTimer = setTimeout(() => setClosing(true), 2800)
    const doneTimer = setTimeout(onDone, 3200)
    return () => {
      clearTimeout(closeTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center transition-opacity duration-400 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />
      <div className="absolute inset-0 bg-emerald-300/15 rankup-flash" />

      <div className="relative text-center px-6 rankup-letter-in">
        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 shadow-[0_0_50px_10px_rgba(52,211,153,0.55)]" />
          <ShieldCheck className="w-14 h-14 text-emerald-300" strokeWidth={1.5} />
        </div>
        <p className="font-display text-3xl tracking-[0.15em] text-white uppercase mb-1">
          Gate Cleared
        </p>
        <p className="text-emerald-200/80 text-sm">
          The monthly Gate has been sealed, Hunter.
        </p>
      </div>
    </div>
  )
}
