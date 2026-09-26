import type { StorageAdapter } from './adapter'
import type {
  HunterStats,
  InventoryItem,
  DungeonGate,
  ShadowSoldier,
  Skill,
  DailyQuestFixed,
  PenaltyState,
} from '../../types'

export const CURRENT_SCHEMA_VERSION = 2

export const DEFAULT_HUNTER_STATS: HunterStats = {
  str: 10,
  vit: 10,
  agi: 10,
  int: 10,
  per: 10,
  availableAP: 5,
}

export const DEFAULT_GOLD = 500

export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'potion-recovery-1',
    name: 'Status Recovery Potion',
    description: 'Fully restores health, mana, and clears fatigue meter.',
    type: 'potion',
    cost: 150,
    icon: 'FlaskConical',
    quantity: 2,
  },
  {
    id: 'weapon-knight-killer',
    name: "Knight Killer's Dagger",
    description: 'Special dagger designed to pierce heavy armor. (+5 STR, +3 AGI)',
    type: 'weapon',
    statBoost: { str: 5, agi: 3 },
    cost: 500,
    icon: 'Sword',
    equipped: true,
    quantity: 1,
  },
  {
    id: 'key-gate-e',
    name: 'E-Rank Gate Key',
    description: 'Unlocks entry to E-Rank Dungeons & Kasaka Lair.',
    type: 'key',
    cost: 200,
    icon: 'Key',
    quantity: 1,
  },
]

export const DEFAULT_DUNGEON_GATES: DungeonGate[] = [
  {
    id: 'gate-e',
    name: 'Kasaka Lair (Subway Dungeon)',
    rank: 'E',
    bossName: 'Blue-Poison Fang Kasaka',
    bossHP: 100,
    bossMaxHP: 100,
    cleared: false,
    requiredMissions: 5,
    currentProgress: 0,
    shadowRewardId: 'iron',
    goldReward: 300,
    xpReward: 150,
    icon: 'Skull',
  },
  {
    id: 'gate-c',
    name: 'Throne Room Gate',
    rank: 'C',
    bossName: 'Blood-Red Commander Igris',
    bossHP: 250,
    bossMaxHP: 250,
    cleared: false,
    requiredMissions: 15,
    currentProgress: 0,
    shadowRewardId: 'igris',
    goldReward: 800,
    xpReward: 400,
    icon: 'ShieldAlert',
  },
  {
    id: 'gate-a',
    name: 'Demon Castle Upper Floors',
    rank: 'A',
    bossName: 'Demon King Baran & Tusk Shaman',
    bossHP: 500,
    bossMaxHP: 500,
    cleared: false,
    requiredMissions: 30,
    currentProgress: 0,
    shadowRewardId: 'tusk',
    goldReward: 2000,
    xpReward: 1000,
    icon: 'Flame',
  },
  {
    id: 'gate-s',
    name: 'Jeju Island Red Gate',
    rank: 'S',
    bossName: 'Ant King Beru',
    bossHP: 1000,
    bossMaxHP: 1000,
    cleared: false,
    requiredMissions: 50,
    currentProgress: 0,
    shadowRewardId: 'beru',
    goldReward: 5000,
    xpReward: 2500,
    icon: 'Crown',
  },
]

export const DEFAULT_SHADOW_ARMY: ShadowSoldier[] = [
  {
    id: 'igris',
    name: 'Igris',
    title: 'The Bloodred Commander Knight',
    extracted: false,
    assignedCategory: 'Fitness',
    xpMultiplier: 1.25,
    power: 450,
    icon: 'Sword',
    color: 'red',
  },
  {
    id: 'iron',
    name: 'Iron',
    title: 'Heavy Shield Tank',
    extracted: false,
    assignedCategory: 'Health',
    xpMultiplier: 1.20,
    power: 320,
    icon: 'Shield',
    color: 'blue',
  },
  {
    id: 'tusk',
    name: 'Tusk',
    title: 'High Orc Shaman',
    extracted: false,
    assignedCategory: 'Study',
    xpMultiplier: 1.30,
    power: 600,
    icon: 'Wand2',
    color: 'purple',
  },
  {
    id: 'beru',
    name: 'Beru',
    title: 'Ant King Marshal',
    extracted: false,
    assignedCategory: 'Productivity',
    xpMultiplier: 1.40,
    power: 950,
    icon: 'Zap',
    color: 'cyan',
  },
  {
    id: 'bellion',
    name: 'Bellion',
    title: 'Grand Marshal of the Shadow Army',
    extracted: false,
    assignedCategory: 'Work',
    xpMultiplier: 1.50,
    power: 1500,
    icon: 'Crown',
    color: 'amber',
  },
]

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'skill-stealth',
    name: 'Stealth',
    description: 'Erase presence and focus completely. Grants +10% XP on Deep Work & Study habits.',
    icon: 'EyeOff',
    unlockCondition: 'Reach Level 5',
    effect: '+10% XP for Study & Work',
    unlocked: false,
    categoryBoost: 'Study',
    boostPercent: 10,
  },
  {
    id: 'skill-bloodlust',
    name: 'Bloodlust',
    description: 'Overwhelm doubt with intense aura. Gives +15% XP for Fitness & Workout quests.',
    icon: 'Flame',
    unlockCondition: 'Clear E-Rank Gate (Kasaka Lair)',
    effect: '+15% XP for Fitness',
    unlocked: false,
    categoryBoost: 'Fitness',
    boostPercent: 15,
  },
  {
    id: 'skill-rulers-authority',
    name: "Ruler's Authority",
    description: 'Telekinetic grip over mind & body. Prevents streak resets once per week.',
    icon: 'Hand',
    unlockCondition: 'Extract Igris Shadow',
    effect: 'Streak Shield once per week',
    unlocked: false,
  },
  {
    id: 'skill-monarch-domain',
    name: "Monarch's Domain",
    description: 'Shadow Soldiers inside your domain gain +50% effective power and double Gold drops.',
    icon: 'Sparkles',
    unlockCondition: 'Reach Level 25 & Extract 3 Shadows',
    effect: '+50% Shadow Power & 2x Gold',
    unlocked: false,
  },
]

export const DEFAULT_DAILY_QUESTS: DailyQuestFixed[] = [
  {
    id: 'daily-pushups',
    title: 'Push-ups',
    target: 100,
    current: 0,
    unit: 'reps',
    skippable: false,
    completed: false,
    xpReward: 30,
    goldReward: 50,
  },
  {
    id: 'daily-situps',
    title: 'Sit-ups',
    target: 100,
    current: 0,
    unit: 'reps',
    skippable: false,
    completed: false,
    xpReward: 30,
    goldReward: 50,
  },
  {
    id: 'daily-squats',
    title: 'Squats',
    target: 100,
    current: 0,
    unit: 'reps',
    skippable: false,
    completed: false,
    xpReward: 30,
    goldReward: 50,
  },
  {
    id: 'daily-running',
    title: 'Running',
    target: 10,
    current: 0,
    unit: 'km',
    skippable: false,
    completed: false,
    xpReward: 50,
    goldReward: 100,
  },
]

export const DEFAULT_PENALTY_STATE: PenaltyState = {
  active: false,
  reason: '',
  debuffPercent: 0,
  forcedQuest: null,
}

export function migrateSchema(adapter: StorageAdapter, versionKey: string): void {
  const currentVersion = adapter.get<number>(versionKey, 1)

  if (currentVersion < 2) {
    console.log(`[StorageMigration] Upgrading schema from version ${currentVersion} to ${CURRENT_SCHEMA_VERSION}`)
    adapter.set(versionKey, CURRENT_SCHEMA_VERSION)
  }
}
