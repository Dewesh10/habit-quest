export function getSystemMessage(currentStreak: number, todayDone: number, todayTotal: number): string {
  if (todayTotal === 0) return "No quests scheduled today. Rest, Hunter."
  if (todayDone === todayTotal) return "All quests cleared. Well done, Hunter."
  if (currentStreak >= 7) return `${currentStreak}-day streak active. Do not break the chain.`
  if (currentStreak === 0 && todayDone === 0) return "The System is watching. Begin your quests."
  const remaining = todayTotal - todayDone
  return `${remaining} quest${remaining === 1 ? "" : "s"} remain today.`
}