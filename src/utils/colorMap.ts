// Tailwind cannot detect dynamically-built class names like `bg-${color}-500`.
// This map ensures every class we might use is written out literally somewhere,
// so Tailwind generates the CSS for it at build time.

export type HabitColor =
  | "amber" | "red" | "blue" | "violet" | "teal"
  | "lime" | "cyan" | "green" | "indigo" | "slate"

interface ColorClasses {
  bgSoft: string   // soft background for icon chip
  text: string     // icon / accent text color
}

const colorMap: Record<string, ColorClasses> = {
  amber:   { bgSoft: "bg-amber-500/10",   text: "text-amber-400" },
  red:     { bgSoft: "bg-red-500/10",     text: "text-red-400" },
  blue:    { bgSoft: "bg-blue-500/10",    text: "text-blue-400" },
  violet:  { bgSoft: "bg-violet-500/10",  text: "text-violet-400" },
  teal:    { bgSoft: "bg-teal-500/10",    text: "text-teal-400" },
  lime:    { bgSoft: "bg-lime-500/10",    text: "text-lime-400" },
  cyan:    { bgSoft: "bg-cyan-500/10",    text: "text-cyan-400" },
  green:   { bgSoft: "bg-green-500/10",   text: "text-green-400" },
  indigo:  { bgSoft: "bg-indigo-500/10",  text: "text-indigo-400" },
  slate:   { bgSoft: "bg-slate-500/10",   text: "text-slate-400" },
}

export function getHabitColorClasses(color: string): ColorClasses {
  return colorMap[color] ?? colorMap.slate
}

export const SWATCH_CLASSES: Record<string, string> = {
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  teal: "bg-teal-500",
  lime: "bg-lime-500",
  cyan: "bg-cyan-500",
  green: "bg-green-500",
  indigo: "bg-indigo-500",
  slate: "bg-slate-500",
}
