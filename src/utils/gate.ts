export interface GateStyle {
  colorClass: string       // text color
  barClass: string          // gradient bar
  glowColor: string         // box-shadow rgba
  borderClass: string
}

const GATE_STYLES: Record<string, GateStyle> = {
  E: {
    colorClass: "text-slate-300",
    barClass: "from-slate-500 to-slate-300",
    glowColor: "rgba(148,163,184,0.6)",
    borderClass: "border-slate-600/50",
  },
  D: {
    colorClass: "text-blue-300",
    barClass: "from-blue-600 to-cyan-400",
    glowColor: "rgba(56,189,248,0.6)",
    borderClass: "border-blue-700/50",
  },
  C: {
    colorClass: "text-emerald-300",
    barClass: "from-emerald-600 to-teal-400",
    glowColor: "rgba(52,211,153,0.6)",
    borderClass: "border-emerald-700/50",
  },
  B: {
    colorClass: "text-violet-300",
    barClass: "from-violet-600 to-fuchsia-400",
    glowColor: "rgba(167,139,250,0.6)",
    borderClass: "border-violet-700/50",
  },
  A: {
    colorClass: "text-amber-300",
    barClass: "from-amber-600 to-orange-400",
    glowColor: "rgba(252,211,77,0.6)",
    borderClass: "border-amber-700/50",
  },
  S: {
    colorClass: "text-red-300",
    barClass: "from-red-600 to-rose-400",
    glowColor: "rgba(248,113,113,0.6)",
    borderClass: "border-red-700/50",
  },
}

export function getGateStyle(rank: string): GateStyle {
  return GATE_STYLES[rank] ?? GATE_STYLES.E
}
