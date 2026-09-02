import type { QuizQuestion, StatKey } from "../data/onboardingQuiz"
import { QUIZ_QUESTIONS } from "../data/onboardingQuiz"
import { calculateLevel } from "./stats"

export type QuizAnswers = Record<string, string | string[] | number>

const BASE_STAT = 10

export function computeStats(answers: QuizAnswers): Record<StatKey, number> {
  const stats: Record<StatKey, number> = { WIL: BASE_STAT, STR: BASE_STAT, INT: BASE_STAT, DIL: BASE_STAT, VIT: BASE_STAT }

  for (const q of QUIZ_QUESTIONS) {
    if (q.type === "slider") continue
    const answer = answers[q.id]
    if (!answer || !q.options) continue

    const selectedIds = Array.isArray(answer) ? answer : [answer]
    for (const id of selectedIds) {
      const option = q.options.find((o) => o.id === id)
      if (!option?.stats) continue
      for (const [key, value] of Object.entries(option.stats)) {
        stats[key as StatKey] += value ?? 0
      }
    }
  }

  return stats
}

// Missions/day pace implied by the "how hard do you want us to push" answer.
export function getMissionsPerDay(answers: QuizAnswers): number {
  const answer = answers["push-level"]
  switch (answer) {
    case "step-by-step":
      return 1
    case "steady":
      return 2
    case "push-me":
      return 3
    case "all-or-nothing":
      return 4
    default:
      return 2
  }
}

const XP_PER_MISSION = 15

export function project30Days(answers: QuizAnswers) {
  const missionsPerDay = getMissionsPerDay(answers)
  const totalXP = missionsPerDay * XP_PER_MISSION * 30
  const { level } = calculateLevel(totalXP)
  const missionsTotal = missionsPerDay * 30
  return { missionsPerDay, totalXP, level, missionsTotal }
}

interface SuggestedHabit {
  name: string
  category: string
  icon: string
  color: string
  frequency: "daily" | number[]
  xpValue: number
}

// Built from the person's actual answers: life areas picked, sleep/eating
// quality, and the habit they said is costing them most.
export function buildSuggestedHabits(answers: QuizAnswers): SuggestedHabit[] {
  const habits: SuggestedHabit[] = []
  const lifeAreas = (answers["life-areas"] as string[]) ?? []

  habits.push({
    name: "Sleep on time",
    category: "Health",
    icon: "Moon",
    color: "indigo",
    frequency: "daily",
    xpValue: 10,
  })

  if (answers["sleep"] === "struggle" || answers["sleep"] === "mess") {
    habits.push({
      name: "Wind down by 11 PM",
      category: "Health",
      icon: "Moon",
      color: "indigo",
      frequency: "daily",
      xpValue: 10,
    })
  }

  if (answers["eating"] === "fast-food" || answers["eating"] === "no-thought") {
    habits.push({
      name: "Eat one real meal",
      category: "Health",
      icon: "Apple",
      color: "green",
      frequency: "daily",
      xpValue: 10,
    })
  }

  if (lifeAreas.includes("fitness")) {
    habits.push({
      name: "Move for 20 minutes",
      category: "Fitness",
      icon: "Dumbbell",
      color: "red",
      frequency: [1, 3, 5],
      xpValue: 20,
    })
  }

  if (lifeAreas.includes("mental") || lifeAreas.includes("growth")) {
    habits.push({
      name: "Sit in silence, 5 minutes",
      category: "Personal",
      icon: "Sunrise",
      color: "amber",
      frequency: "daily",
      xpValue: 10,
    })
  }

  if (lifeAreas.includes("study")) {
    habits.push({
      name: "Study block",
      category: "Study",
      icon: "BookOpen",
      color: "blue",
      frequency: "daily",
      xpValue: 15,
    })
  }

  if (lifeAreas.includes("career") || lifeAreas.includes("discipline")) {
    habits.push({
      name: "Deep work session",
      category: "Productivity",
      icon: "Code2",
      color: "violet",
      frequency: "daily",
      xpValue: 15,
    })
  }

  const costly = answers["costly-habit"]
  if (costly === "phone") {
    habits.push({
      name: "No phone first hour",
      category: "Personal",
      icon: "Target",
      color: "cyan",
      frequency: "daily",
      xpValue: 10,
    })
  } else if (costly === "gaming") {
    habits.push({
      name: "Cap gaming time",
      category: "Personal",
      icon: "Target",
      color: "cyan",
      frequency: "daily",
      xpValue: 10,
    })
  } else if (costly === "junk-food") {
    habits.push({
      name: "No junk food",
      category: "Health",
      icon: "Apple",
      color: "green",
      frequency: "daily",
      xpValue: 10,
    })
  } else if (costly === "procrastination") {
    habits.push({
      name: "First task before noon",
      category: "Productivity",
      icon: "Target",
      color: "violet",
      frequency: "daily",
      xpValue: 15,
    })
  }

  habits.push({
    name: "Drink enough water",
    category: "Health",
    icon: "GlassWater",
    color: "cyan",
    frequency: "daily",
    xpValue: 5,
  })

  // De-duplicate by name, cap at 6 so the starter set stays manageable.
  const seen = new Set<string>()
  return habits.filter((h) => {
    if (seen.has(h.name)) return false
    seen.add(h.name)
    return true
  }).slice(0, 6)
}

// A short, honest reflection built only from what was actually answered —
// no invented detail, no reused phrasing from any other app.
export function buildNarrative(name: string, answers: QuizAnswers): string {
  const attempts = answers["attempts"]
  const selfAssessment = answers["self-assessment"]
  const slip = answers["slip-trigger"]

  const parts: string[] = []

  parts.push(
    `${name}, here is what your answers show.`
  )

  if (attempts === "few" || attempts === "lost-count") {
    parts.push(
      "You have tried to change this before, more than once. That is not a record of failure — it is evidence you have not stopped wanting this."
    )
  } else if (attempts === "first") {
    parts.push("This is your first real attempt at structuring this, which means nothing here is broken yet — only unbuilt.")
  }

  if (selfAssessment === "struggle-basics") {
    parts.push("Right now even the basics feel like a lot, so the plan ahead starts small on purpose.")
  } else if (selfAssessment === "high-performance") {
    parts.push("You are already looking for more than the basics, so the plan ahead will not hold back.")
  }

  const slipLabel: Record<string, string> = {
    stress: "stress",
    boredom: "boredom",
    alone: "being alone",
    nights: "the nights",
    people: "the people around you",
  }
  if (typeof slip === "string" && slipLabel[slip]) {
    parts.push(`You said ${slipLabel[slip]} is usually what pulls you off track — that's worth watching for.`)
  }

  return parts.join(" ")
}
