export type AchievementCriteriaType =
  | 'firstCompletion'
  | 'streak'
  | 'totalCompletions'
  | 'totalXP'
  | 'perfectWeek'
  | 'perfectMonth'
  | 'habitCompletions'   // tied to a specific habit, e.g. "50 gym sessions"

export interface AchievementCriteria {
  type: AchievementCriteriaType
  target: number          // e.g. 7 for a 7-day streak, 100 for 100 completions
  habitId?: string        // only used when type === 'habitCompletions'
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string             // lucide-react icon name
  criteria: AchievementCriteria
  unlockedAt: string | null // ISO date, null = still locked
}