import ParticleCanvas from "./ParticleCanvas"

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid-texture opacity-40" />

      {/* Radial Energy Orbs */}
      <div
        className="absolute top-[-10%] w-[900px] h-[900px] rounded-full bg-cyan-500/15 blur-[120px] animate-gate-pulse"
        style={{ left: "50%", marginLeft: "-450px" }}
      />
      <div
        className="absolute right-[-10%] bottom-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[110px] animate-gate-pulse"
        style={{ animationDelay: "-4s" }}
      />

      <div className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-page-scan" />

      {/* Particle Canvas */}
      <ParticleCanvas />
    </div>
  )
}
