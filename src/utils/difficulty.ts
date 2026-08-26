export interface DifficultyInfo {
  label: string
  color: string
}

export function getDifficulty(xpValue: number): DifficultyInfo {
  if (xpValue >= 20) return { label: "Hard", color: "text-red-400 border-red-900/50 bg-red-500/10" }
  if (xpValue >= 12) return { label: "Normal", color: "text-yellow-400 border-yellow-900/50 bg-yellow-500/10" }
  return { label: "Easy", color: "text-blue-400 border-blue-900/50 bg-blue-500/10" }
}