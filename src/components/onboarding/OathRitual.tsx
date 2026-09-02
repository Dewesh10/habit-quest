import { useRef, useState } from "react"
import { Fingerprint } from "lucide-react"

interface OathRitualProps {
  name: string
  onSigned: () => void
}

const HOLD_DURATION_MS = 1800

export default function OathRitual({ name, onSigned }: OathRitualProps) {
  const [progress, setProgress] = useState(0)
  const [signed, setSigned] = useState(false)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  function step(timestamp: number) {
    if (startRef.current === null) startRef.current = timestamp
    const elapsed = timestamp - startRef.current
    const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100)
    setProgress(pct)

    if (pct >= 100) {
      setSigned(true)
      setTimeout(onSigned, 900)
      return
    }
    frameRef.current = requestAnimationFrame(step)
  }

  function startHold() {
    startRef.current = null
    frameRef.current = requestAnimationFrame(step)
  }

  function cancelHold() {
    if (signed) return
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    startRef.current = null
    setProgress(0)
  }

  const circumference = 2 * Math.PI * 88

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 py-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_60%)]" />

      <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-6 relative">
        The Hunter&apos;s Oath
      </h1>

      <div className="system-panel p-5 max-w-md mb-10 relative">
        <p className="text-slate-300 italic leading-relaxed text-sm md:text-base">
          &ldquo;I, {name}, accept the System. Every day I show up, I turn effort into progress
          I can measure. If I miss a day, I do not start over &mdash; I continue. This is not
          about becoming someone new. It is about becoming who I already decided to be.&rdquo;
        </p>
      </div>

      <p className="text-blue-300/80 text-xs tracking-[0.3em] uppercase mb-6">
        {signed ? "System Calibrated" : "Hold To Sign"}
      </p>

      <button
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        disabled={signed}
        aria-label="Hold to accept the oath"
        className="relative w-48 h-48 flex items-center justify-center select-none"
      >
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 192 192">
          <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="3" />
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            style={{ transition: progress === 0 ? "stroke-dashoffset 200ms ease-out" : "none", filter: "drop-shadow(0 0 6px rgba(56,189,248,0.8))" }}
          />
        </svg>
        <div
          className={`w-32 h-32 rounded-full border-2 border-blue-500/40 bg-slate-900/80 flex items-center justify-center transition-transform ${
            signed ? "scale-110" : ""
          }`}
        >
          <Fingerprint className={`w-12 h-12 ${signed ? "text-blue-300" : "text-slate-500"} transition-colors`} />
        </div>
      </button>

      <p className="text-slate-500 text-xs mt-8 max-w-xs">
        {signed ? "Welcome, Hunter." : "Press and hold until the System recognizes you."}
      </p>
    </div>
  )
}
