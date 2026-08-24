// Central date utilities. All dates are ISO strings: "YYYY-MM-DD".
// Never use ambiguous formats or rely on Date's local-timezone quirks for storage.

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function getDaysInMonth(year: number, month: number): number {
  // month is 0-indexed (0 = January). Day 0 of next month = last day of this month.
  return new Date(year, month + 1, 0).getDate()
}

export function getWeekdayOfDate(year: number, month: number, day: number): number {
  // Returns 0 (Sunday) through 6 (Saturday)
  return new Date(year, month, day).getDay()
}

export function getMonthDates(year: number, month: number): string[] {
  const days = getDaysInMonth(year, month)
  const dates: string[] = []
  for (let d = 1; d <= days; d++) {
    dates.push(toISODate(new Date(year, month, d)))
  }
  return dates
}

export function getMonthName(month: number): string {
  return new Date(2000, month, 1).toLocaleString("default", { month: "long" })
}

// Is a habit scheduled on this specific date, based on its frequency?
export function isScheduledOn(
  frequency: "daily" | "weekly" | number[],
  dateISO: string
): boolean {
  if (frequency === "daily") return true
  if (frequency === "weekly") return true // counted once per week elsewhere; treat every day as eligible
  const date = new Date(dateISO + "T00:00:00")
  const weekday = date.getDay()
  return frequency.includes(weekday)
}
