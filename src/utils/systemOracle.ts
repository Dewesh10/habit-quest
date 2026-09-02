import type { UserInsightContext } from "./insights"

export interface SuggestedQuery {
  id: string
  label: string
}

export const SUGGESTED_QUERIES: SuggestedQuery[] = [
  { id: "overview", label: "How am I doing overall?" },
  { id: "weak", label: "What should I focus on?" },
  { id: "goal", label: "Will I clear my Gate this month?" },
  { id: "streak", label: "How's my streak looking?" },
  { id: "days", label: "What's my best day of the week?" },
]

function trendPhrase(direction: UserInsightContext["trendDirection"]): string {
  switch (direction) {
    case "improving":
      return "trending upward"
    case "declining":
      return "slipping compared to recent weeks"
    case "steady":
      return "holding steady"
    default:
      return "still gathering enough data to read a trend"
  }
}

function overviewResponse(ctx: UserInsightContext): string {
  const { overallCompletion, currentStreak, trendDirection } = ctx
  const streakLine =
    currentStreak > 0
      ? `Your current streak is ${currentStreak} day${currentStreak === 1 ? "" : "s"}.`
      : "You don't have an active streak right now — clearing a quest today would start one."

  return `Overall completion sits at ${overallCompletion}%, and your performance is ${trendPhrase(
    trendDirection
  )}. ${streakLine}`
}

function weakResponse(ctx: UserInsightContext): string {
  const { habitsAtRisk, categoryPerformance } = ctx
  if (habitsAtRisk.length === 0) {
    return "Every active quest has been touched recently. No immediate weak points detected, Hunter."
  }

  const top = habitsAtRisk.slice(0, 3)
  const lines = top.map((r) => {
    if (r.daysSinceCompletion === null) return `${r.habit.name} — never completed yet`
    return `${r.habit.name} — ${r.daysSinceCompletion} day${r.daysSinceCompletion === 1 ? "" : "s"} since last completion`
  })

  const weakestCategory = categoryPerformance[categoryPerformance.length - 1]
  const categoryLine = weakestCategory
    ? ` Your weakest category this month is ${weakestCategory.category} at ${weakestCategory.percent}%.`
    : ""

  return `Quests needing attention: ${lines.join(", ")}.${categoryLine}`
}

function goalResponse(ctx: UserInsightContext): string {
  const { goalProjection } = ctx
  const { onTrack, projectedTotal, daysRemaining, currentPace } = goalProjection

  if (daysRemaining <= 0) {
    return `The month is closing out. Final tally: ${projectedTotal} quests completed.`
  }

  const status = onTrack
    ? "on pace to clear this Gate"
    : "currently behind pace to clear this Gate"

  return `At your current rate of ${currentPace} quest completions per day, you're ${status}. Projected total by month end: ${projectedTotal}, with ${daysRemaining} day${
    daysRemaining === 1 ? "" : "s"
  } remaining.`
}

function streakResponse(ctx: UserInsightContext): string {
  const { currentStreak } = ctx
  if (currentStreak === 0) {
    return "No active streak right now. Clear one scheduled quest today to begin building momentum again."
  }
  if (currentStreak < 7) {
    return `Your streak is at ${currentStreak} day${currentStreak === 1 ? "" : "s"}. Reach 7 for consistent-hunter status.`
  }
  if (currentStreak < 30) {
    return `${currentStreak} days strong. You're well past the initial threshold — 30 days puts you in elite territory.`
  }
  return `${currentStreak} days. That is a serious streak, Hunter. Do not break the chain.`
}

function daysResponse(ctx: UserInsightContext): string {
  const { dayOfWeekPerformance } = ctx
  if (dayOfWeekPerformance.length === 0) {
    return "Not enough data yet to identify your strongest and weakest days."
  }
  const sorted = [...dayOfWeekPerformance].sort((a, b) => b.percent - a.percent)
  const best = sorted[0]
  const worst = sorted[sorted.length - 1]
  return `${best.label} is your strongest day at ${best.percent}% completion. ${worst.label} is your weakest at ${worst.percent}%.`
}

const INTENT_HANDLERS: Record<string, (ctx: UserInsightContext) => string> = {
  overview: overviewResponse,
  weak: weakResponse,
  goal: goalResponse,
  streak: streakResponse,
  days: daysResponse,
}

// Loose keyword routing for free-text input.
function matchIntent(query: string): string {
  const q = query.toLowerCase()
  if (/goal|gate|month|clear/.test(q)) return "goal"
  if (/streak|chain|consistent/.test(q)) return "streak"
  if (/day|monday|tuesday|wednesday|thursday|friday|saturday|sunday|weekday/.test(q)) return "days"
  if (/weak|worst|focus|improve|neglect|risk|behind/.test(q)) return "weak"
  return "overview"
}

export function generateResponse(context: UserInsightContext, query: string): string {
  const intentId = SUGGESTED_QUERIES.some((s) => s.label === query)
    ? SUGGESTED_QUERIES.find((s) => s.label === query)!.id
    : matchIntent(query)

  const handler = INTENT_HANDLERS[intentId] ?? overviewResponse
  return handler(context)
}
