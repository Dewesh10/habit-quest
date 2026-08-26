import type { Achievement } from "../types"

// The master list of achievements. unlockedAt starts as null for everyone;
// useAchievements checks criteria and fills this in as they're earned.
export const achievementDefs: Omit<Achievement, "unlockedAt">[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "Complete your first habit.",
    icon: "footprints",
    title: "Awakened",
    criteria: { type: "firstCompletion", target: 1 },
  },
  {
    id: "seven-day-warrior",
    name: "7 Day Warrior",
    description: "Maintain a 7-day consistency streak.",
    icon: "flame",
    title: "Iron Will",
    criteria: { type: "streak", target: 7 },
  },
  {
    id: "thirty-day-warrior",
    name: "30 Day Warrior",
    description: "Maintain a 30-day consistency streak.",
    icon: "flame",
    title: "Unbreakable",
    criteria: { type: "streak", target: 30 },
  },
  {
    id: "hundred-completions",
    name: "100 Completions",
    description: "Complete 100 habit instances.",
    icon: "check-check",
    title: "Relentless",
    criteria: { type: "totalCompletions", target: 100 },
  },
  {
    id: "five-hundred-xp",
    name: "500 XP",
    description: "Earn 500 XP.",
    icon: "star",
    title: "Rising Hunter",
    criteria: { type: "totalXP", target: 500 },
  },
]
