export interface RankInfo {
  rank: string
  title: string
  nextRank: string | null
  nextRankLevel: number | null
}

const RANK_TABLE: { minLevel: number; rank: string; title: string }[] = [
  { minLevel: 0, rank: "E", title: "Awakened" },
  { minLevel: 2, rank: "D", title: "Novice Hunter" },
  { minLevel: 5, rank: "C", title: "Skilled Hunter" },
  { minLevel: 10, rank: "B", title: "Veteran Hunter" },
  { minLevel: 15, rank: "A", title: "Elite Hunter" },
  { minLevel: 20, rank: "S", title: "Shadow Monarch" },
]

export function getRank(level: number): RankInfo {
  let current = RANK_TABLE[0]
  let next: (typeof RANK_TABLE)[number] | null = null

  for (let i = 0; i < RANK_TABLE.length; i++) {
    if (level >= RANK_TABLE[i].minLevel) {
      current = RANK_TABLE[i]
      next = RANK_TABLE[i + 1] ?? null
    }
  }

  return {
    rank: current.rank,
    title: current.title,
    nextRank: next?.rank ?? null,
    nextRankLevel: next?.minLevel ?? null,
  }
}