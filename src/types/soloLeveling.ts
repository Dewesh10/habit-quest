export interface HunterStats {
  str: number
  vit: number
  agi: number
  int: number
  per: number
  availableAP: number
}

export type ItemType = 'potion' | 'weapon' | 'key'

export interface InventoryItem {
  id: string
  name: string
  description: string
  type: ItemType
  statBoost?: Partial<HunterStats>
  cost: number
  icon: string
  equipped?: boolean
  quantity: number
}

export interface ShopItem {
  id: string
  name: string
  description: string
  cost: number
  type: ItemType
  icon: string
  statBoost?: Partial<HunterStats>
}

export type GateRank = 'E' | 'C' | 'A' | 'S'

export interface DungeonGate {
  id: string
  name: string
  rank: GateRank
  bossName: string
  bossHP: number
  bossMaxHP: number
  cleared: boolean
  requiredMissions: number
  currentProgress: number
  shadowRewardId?: 'igris' | 'iron' | 'tusk' | 'beru' | 'bellion'
  goldReward: number
  xpReward: number
  icon: string
}

export type ShadowId = 'igris' | 'iron' | 'tusk' | 'beru' | 'bellion'

export interface ShadowSoldier {
  id: ShadowId
  name: string
  title: string
  extracted: boolean
  assignedCategory?: string
  xpMultiplier: number
  power: number
  icon: string
  color: string
}

export type SystemMessageType = 'quest' | 'caution' | 'levelup' | 'penalty' | 'arise'

export interface SystemMessageData {
  id: string
  type: SystemMessageType
  title: string
  text: string
  subtext?: string
  requiresConfirm?: boolean
  onConfirmText?: string
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  unlockCondition: string
  effect: string
  unlocked: boolean
  categoryBoost?: string
  boostPercent?: number
}

export interface DailyQuestFixed {
  id: string
  title: string
  target: number
  current: number
  unit: string
  skippable: false
  completed: boolean
  xpReward: number
  goldReward: number
}

export interface PenaltyState {
  active: boolean
  reason: string
  debuffPercent: number
  forcedQuest: {
    title: string
    target: number
    current: number
    unit: string
  } | null
  triggeredAt?: string
}
