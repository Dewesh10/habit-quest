import type {
  Habit,
  Completion,
  Settings,
  Achievement,
  NotificationEntry,
  HunterStats,
  InventoryItem,
  DungeonGate,
  ShadowSoldier,
  Skill,
  DailyQuestFixed,
  PenaltyState,
} from "../types"
import { localAdapter } from "./storage/localAdapter"
import {
  migrateSchema,
  DEFAULT_HUNTER_STATS,
  DEFAULT_GOLD,
  DEFAULT_INVENTORY,
  DEFAULT_DUNGEON_GATES,
  DEFAULT_SHADOW_ARMY,
  DEFAULT_SKILLS,
  DEFAULT_DAILY_QUESTS,
  DEFAULT_PENALTY_STATE,
} from "./storage/migrations"


const PREFIX = "habitQuest:v2:"

const KEYS = {
  version: PREFIX + "schema_version",
  habits: PREFIX + "habits",
  completions: PREFIX + "completions",
  settings: PREFIX + "settings",
  achievements: PREFIX + "achievements",
  notifications: PREFIX + "notifications",
  userName: PREFIX + "userName",
  onboarded: PREFIX + "onboarded",
  hunterStats: PREFIX + "hunterStats",
  gold: PREFIX + "gold",
  inventory: PREFIX + "inventory",
  dungeonGates: PREFIX + "dungeonGates",
  shadowArmy: PREFIX + "shadowArmy",
  skills: PREFIX + "skills",
  dailyQuests: PREFIX + "dailyQuests",
  penaltyState: PREFIX + "penaltyState",
}

const MAX_NOTIFICATIONS = 50

// Perform initial migration on load
migrateSchema(localAdapter, KEYS.version)

export const storageService = {
  getHabits(): Habit[] {
    return localAdapter.get<Habit[]>(KEYS.habits, [])
  },
  saveHabits(habits: Habit[]): void {
    localAdapter.set(KEYS.habits, habits)
  },

  getCompletions(): Completion[] {
    return localAdapter.get<Completion[]>(KEYS.completions, [])
  },
  saveCompletions(completions: Completion[]): void {
    localAdapter.set(KEYS.completions, completions)
  },

  getSettings(): Settings {
    return localAdapter.get<Settings>(KEYS.settings, {
      theme: "dark",
      weekStartsOn: 1,
      defaultXP: 10,
      soundEnabled: true,
      monthlyGoal: 300,
      equippedTitle: null,
    })
  },
  saveSettings(settings: Settings): void {
    localAdapter.set(KEYS.settings, settings)
  },

  getAchievements(): Achievement[] {
    return localAdapter.get<Achievement[]>(KEYS.achievements, [])
  },
  saveAchievements(achievements: Achievement[]): void {
    localAdapter.set(KEYS.achievements, achievements)
  },

  getNotifications(): NotificationEntry[] {
    return localAdapter.get<NotificationEntry[]>(KEYS.notifications, [])
  },
  saveNotifications(entries: NotificationEntry[]): void {
    const trimmed = entries.slice(-MAX_NOTIFICATIONS)
    localAdapter.set(KEYS.notifications, trimmed)
  },

  getUserName(): string | null {
    return localAdapter.get<string | null>(KEYS.userName, null)
  },
  saveUserName(name: string): void {
    localAdapter.set(KEYS.userName, name)
  },

  getOnboarded(): boolean {
    return localAdapter.get<boolean>(KEYS.onboarded, false)
  },
  setOnboarded(value: boolean): void {
    localAdapter.set(KEYS.onboarded, value)
  },

  // --- Solo Leveling Extensions ---

  getHunterStats(): HunterStats {
    return localAdapter.get<HunterStats>(KEYS.hunterStats, DEFAULT_HUNTER_STATS)
  },
  saveHunterStats(stats: HunterStats): void {
    localAdapter.set(KEYS.hunterStats, stats)
  },

  getGold(): number {
    return localAdapter.get<number>(KEYS.gold, DEFAULT_GOLD)
  },
  saveGold(gold: number): void {
    localAdapter.set(KEYS.gold, gold)
  },

  getInventory(): InventoryItem[] {
    return localAdapter.get<InventoryItem[]>(KEYS.inventory, DEFAULT_INVENTORY)
  },
  saveInventory(inventory: InventoryItem[]): void {
    localAdapter.set(KEYS.inventory, inventory)
  },

  getDungeonGates(): DungeonGate[] {
    return localAdapter.get<DungeonGate[]>(KEYS.dungeonGates, DEFAULT_DUNGEON_GATES)
  },
  saveDungeonGates(gates: DungeonGate[]): void {
    localAdapter.set(KEYS.dungeonGates, gates)
  },

  getShadowArmy(): ShadowSoldier[] {
    return localAdapter.get<ShadowSoldier[]>(KEYS.shadowArmy, DEFAULT_SHADOW_ARMY)
  },
  saveShadowArmy(shadows: ShadowSoldier[]): void {
    localAdapter.set(KEYS.shadowArmy, shadows)
  },

  getSkills(): Skill[] {
    return localAdapter.get<Skill[]>(KEYS.skills, DEFAULT_SKILLS)
  },
  saveSkills(skills: Skill[]): void {
    localAdapter.set(KEYS.skills, skills)
  },

  getDailyQuests(): DailyQuestFixed[] {
    return localAdapter.get<DailyQuestFixed[]>(KEYS.dailyQuests, DEFAULT_DAILY_QUESTS)
  },
  saveDailyQuests(quests: DailyQuestFixed[]): void {
    localAdapter.set(KEYS.dailyQuests, quests)
  },

  getPenaltyState(): PenaltyState {
    return localAdapter.get<PenaltyState>(KEYS.penaltyState, DEFAULT_PENALTY_STATE)
  },
  savePenaltyState(penalty: PenaltyState): void {
    localAdapter.set(KEYS.penaltyState, penalty)
  },
}
