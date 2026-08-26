import { useMemo } from "react"
import type { CSSProperties } from "react"

const PARTICLE_COUNT = 32

export default function AmbientBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 10 + Math.random() * 14,
        delay: -(Math.random() * 20),
        opacity: 0.35 + Math.random() * 0.5,
      })),
    []
  )

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-texture opacity-40" />

      <div
        className="absolute top-[-10%] w-[900px] h-[900px] rounded-full bg-blue-500/25 blur-[110px] animate-gate-pulse"
        style={{ left: "50%", marginLeft: "-450px" }}
      />
      <div
        className="absolute right-[-10%] bottom-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/25 blur-[100px] animate-gate-pulse"
        style={{ animationDelay: "-4s" }}
      />

      <div className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-blue-400/15 to-transparent animate-page-scan" />

      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan-200 animate-particle-drift"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: "0 0 6px 1px rgba(125, 211, 252, 0.8)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--particle-opacity": p.opacity,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
