export interface StatAllocation {
  label: string
  abbr: string
  value: number
}

const CATEGORY_STAT_MAP: Record<string, { label: string; abbr: string }> = {
  Fitness: { label: "Strength", abbr: "STR" },
  Health: { label: "Vitality", abbr: "VIT" },
  Study: { label: "Intelligence", abbr: "INT" },
  Education: { label: "Intelligence", abbr: "INT" },
  Work: { label: "Diligence", abbr: "DIL" },
  Productivity: { label: "Diligence", abbr: "DIL" },
  Personal: { label: "Willpower", abbr: "WIL" },
  Finance: { label: "Prosperity", abbr: "PRO" },
  Social: { label: "Charisma", abbr: "CHA" },
}

function statFor(category: string): { label: string; abbr: string } {
  return CATEGORY_STAT_MAP[category] ?? { label: category, abbr: category.slice(0, 3).toUpperCase() }
}

export function buildStatAllocations(
  habits: { category: string; archived: boolean }[],
  completedCountByCategory: Map<string, number>
): StatAllocation[] {
  const seen = new Map<string, StatAllocation>()

  for (const habit of habits) {
    if (habit.archived) continue
    const { label, abbr } = statFor(habit.category)
    const count = completedCountByCategory.get(habit.category) ?? 0
    const existing = seen.get(label)
    if (existing) {
      existing.value += count
    } else {
      seen.set(label, { label, abbr, value: count })
    }
  }

  return Array.from(seen.values()).sort((a, b) => b.value - a.value)
}