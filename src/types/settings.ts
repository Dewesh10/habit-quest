export interface Settings {
  theme: 'dark' | 'light' | 'system'
  weekStartsOn: 0 | 1     // 0=Sunday, 1=Monday
  defaultXP: number
  soundEnabled: boolean
  monthlyGoal: number
  equippedTitle: string | null   // achievement id whose title is currently displayed
}
