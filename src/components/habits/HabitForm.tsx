import { useState } from "react"
import type { Habit, HabitCategory, Frequency } from "../../types"
import { SWATCH_CLASSES } from "../../utils/colorMap"

interface HabitFormProps {
  initial?: Habit
  onSubmit: (habit: Habit) => void
  onCancel: () => void
}

const CATEGORIES: HabitCategory[] = [
  "Fitness", "Health", "Study", "Work", "Productivity",
  "Personal", "Finance", "Social", "Other",
]

const COLORS = [
  "amber", "red", "blue", "violet", "teal",
  "lime", "cyan", "green", "indigo", "slate",
]

const ICONS = [
  "Sunrise", "Dumbbell", "BookOpen", "Code2", "Book",
  "Footprints", "GlassWater", "Apple", "Moon", "Target",
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function makeId(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36)
}

export default function HabitForm({ initial, onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? "")
  const [category, setCategory] = useState<HabitCategory>(initial?.category ?? "Personal")
  const [color, setColor] = useState(initial?.color ? initial.color.trim() : "blue")
  const [icon, setIcon] = useState(initial?.icon ?? "Target")
  const [xpValue, setXpValue] = useState(initial?.xpValue ?? 15)
  const [freqType, setFreqType] = useState<"daily" | "specific">(
    Array.isArray(initial?.frequency) ? "specific" : "daily"
  )
  const [days, setDays] = useState<number[]>(
    Array.isArray(initial?.frequency) ? (initial!.frequency as number[]) : []
  )

  function toggleDay(day: number) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const frequency: Frequency = freqType === "daily" ? "daily" : days

    const habit: Habit = {
      id: initial?.id ?? makeId(name),
      name: name.trim(),
      icon,
      category,
      color,
      frequency,
      targetPerWeek: freqType === "specific" ? days.length : undefined,
      xpValue,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
      archived: initial?.archived ?? false,
      order: initial?.order ?? 999,
    }

    onSubmit(habit)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono">
      <div>
        <label className="text-xs text-cyan-300 block mb-1 uppercase">Quest Title</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. 50 Push-ups or 2h Deep Study Block"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-cyan-300 block mb-1 uppercase">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as HabitCategory)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-cyan-300 block mb-1 uppercase">XP Reward</label>
          <input
            type="number"
            min={5}
            step={5}
            value={xpValue}
            onChange={(e) => setXpValue(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-cyan-300 block mb-1 uppercase">Icon Token</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setIcon(i)}
              className={`px-2.5 py-1 rounded text-xs border ${
                icon === i
                  ? "border-cyan-400 text-cyan-300 bg-cyan-950/60"
                  : "border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-cyan-300 block mb-1 uppercase">Glow Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${SWATCH_CLASSES[c]} ${
                color === c ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "border-transparent"
              }`}
              title={c}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-cyan-300 block mb-1 uppercase">Frequency</label>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setFreqType("daily")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              freqType === "daily"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-900 text-slate-400"
            }`}
          >
            Daily Quest
          </button>
          <button
            type="button"
            onClick={() => setFreqType("specific")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
              freqType === "specific"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-900 text-slate-400"
            }`}
          >
            Specific Days
          </button>
        </div>
        {freqType === "specific" && (
          <div className="flex gap-1.5">
            {WEEKDAYS.map((label, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => toggleDay(idx)}
                className={`w-8 h-8 rounded-full text-xs font-medium ${
                  days.includes(idx)
                    ? "bg-cyan-400 text-slate-950 font-bold"
                    : "bg-slate-900 text-slate-400"
                }`}
              >
                {label[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold uppercase py-2.5 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold uppercase py-2.5 rounded-lg shadow-[0_0_16px_rgba(56,189,248,0.5)] transition-colors"
        >
          {initial ? "Save Changes" : "Create Quest"}
        </button>
      </div>
    </form>
  )
}
