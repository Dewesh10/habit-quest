import type { Habit, Completion, AchievementCriteria } from "../types"
import {
  calculateCurrentStreak,
  calculateTotalCompleted,
  calculateXP,
} from "./stats"

// Returns the current progress value for a given criteria type, so locked
// achievements can show "3 / 7" style progress instead of just a lock icon.
export function getCriteriaProgress(
  criteria: AchievementCriteria,
  habits: Habit[],
  completions: Completion[]
): number {
  switch (criteria.type) {
    case "firstCompletion":
    case "totalCompletions":
      return calculateTotalCompleted(completions)
    case "streak":
      return calculateCurrentStreak(habits, completions)
    case "totalXP":
      return calculateXP(habits, completions)
    default:
      return 0
  }
}
