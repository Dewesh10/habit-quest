import { useState, useEffect, useCallback } from "react"
import type {
  HunterStats,
  InventoryItem,
  ShopItem,
  DungeonGate,
  ShadowSoldier,
  ShadowId,
  Skill,
  DailyQuestFixed,
  PenaltyState,
} from "../types"
import { storageService } from "../services/storageService"
import { soundEngine } from "../utils/soundEngine"

export function useHunterSystem() {
  const [stats, setStats] = useState<HunterStats>(() => storageService.getHunterStats())
  const [gold, setGold] = useState<number>(() => storageService.getGold())
  const [inventory, setInventory] = useState<InventoryItem[]>(() => storageService.getInventory())
  const [gates, setGates] = useState<DungeonGate[]>(() => storageService.getDungeonGates())
  const [shadows, setShadows] = useState<ShadowSoldier[]>(() => storageService.getShadowArmy())
  const [skills] = useState<Skill[]>(() => storageService.getSkills())
  const [dailyQuests, setDailyQuests] = useState<DailyQuestFixed[]>(() => storageService.getDailyQuests())
  const [penalty, setPenalty] = useState<PenaltyState>(() => storageService.getPenaltyState())

  // Persist state changes
  useEffect(() => {
    storageService.saveHunterStats(stats)
  }, [stats])

  useEffect(() => {
    storageService.saveGold(gold)
  }, [gold])

  useEffect(() => {
    storageService.saveInventory(inventory)
  }, [inventory])

  useEffect(() => {
    storageService.saveDungeonGates(gates)
  }, [gates])

  useEffect(() => {
    storageService.saveShadowArmy(shadows)
  }, [shadows])

  useEffect(() => {
    storageService.saveSkills(skills)
  }, [skills])

  useEffect(() => {
    storageService.saveDailyQuests(dailyQuests)
  }, [dailyQuests])

  useEffect(() => {
    storageService.savePenaltyState(penalty)
  }, [penalty])

  // --- Actions ---

  // Allocate 1 Stat Point
  const allocateAP = useCallback((stat: keyof Omit<HunterStats, "availableAP">) => {
    setStats((prev) => {
      if (prev.availableAP <= 0) return prev
      soundEngine.playSystemAlert()
      return {
        ...prev,
        [stat]: prev[stat] + 1,
        availableAP: prev.availableAP - 1,
      }
    })
  }, [])

  // Award free AP (on level up)
  const awardAP = useCallback((points = 3) => {
    setStats((prev) => ({
      ...prev,
      availableAP: prev.availableAP + points,
    }))
  }, [])

  // Gold operations
  const addGold = useCallback((amount: number) => {
    setGold((prev) => prev + amount)
  }, [])

  const spendGold = useCallback((amount: number): boolean => {
    let success = false
    setGold((prev) => {
      if (prev >= amount) {
        success = true
        return prev - amount
      }
      return prev
    })
    return success
  }, [])

  // Shop & Inventory
  const buyItem = useCallback(
    (shopItem: ShopItem): boolean => {
      if (gold < shopItem.cost) return false

      setGold((prev) => prev - shopItem.cost)
      setInventory((prev) => {
        const existing = prev.find((item) => item.id === shopItem.id)
        if (existing) {
          return prev.map((item) =>
            item.id === shopItem.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        } else {
          return [
            ...prev,
            {
              id: shopItem.id,
              name: shopItem.name,
              description: shopItem.description,
              type: shopItem.type,
              cost: shopItem.cost,
              icon: shopItem.icon,
              statBoost: shopItem.statBoost,
              quantity: 1,
              equipped: false,
            },
          ]
        }
      })
      soundEngine.playSystemAlert()
      return true
    },
    [gold]
  )

  const toggleEquipWeapon = useCallback((itemId: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.type === "weapon") {
          return { ...item, equipped: !item.equipped }
        }
        return item
      })
    )
    soundEngine.playSystemAlert()
  }, [])

  const usePotion = useCallback((itemId: string): boolean => {
    let used = false
    setInventory((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId && item.type === "potion" && item.quantity > 0) {
            used = true
            return { ...item, quantity: item.quantity - 1 }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
    if (used) {
      soundEngine.playQuestChime()
    }
    return used
  }, [])

  // Daily Quests
  const incrementDailyQuest = useCallback((questId: string, amount = 10) => {
    setDailyQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextCurrent = Math.min(q.target, q.current + amount)
          const isDone = nextCurrent >= q.target
          if (isDone && !q.completed) {
            soundEngine.playQuestChime()
            setGold((g) => g + q.goldReward)
          }
          return { ...q, current: nextCurrent, completed: isDone }
        }
        return q
      })
    )
  }, [])

  // Dungeon Gates
  const recordMissionProgress = useCallback(() => {
    setGates((prev) =>
      prev.map((gate) => {
        if (!gate.cleared) {
          const nextProg = gate.currentProgress + 1
          return { ...gate, currentProgress: nextProg }
        }
        return gate
      })
    )
  }, [])

  const clearGate = useCallback((gateId: string) => {
    setGates((prev) =>
      prev.map((gate) => {
        if (gate.id === gateId && !gate.cleared) {
          soundEngine.playLevelUpFanfare()
          setGold((g) => g + gate.goldReward)
          return { ...gate, cleared: true, currentProgress: gate.requiredMissions }
        }
        return gate
      })
    )
  }, [])

  // Shadow Extraction (ARISE!)
  const extractShadow = useCallback((shadowId: ShadowId) => {
    soundEngine.playAriseSound()
    setShadows((prev) =>
      prev.map((s) => (s.id === shadowId ? { ...s, extracted: true } : s))
    )
  }, [])

  const assignShadowCategory = useCallback((shadowId: ShadowId, category: string) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === shadowId ? { ...s, assignedCategory: category } : s))
    )
    soundEngine.playSystemAlert()
  }, [])

  // Penalty Zone Logic
  const triggerPenalty = useCallback((reason = "Daily Quests neglected") => {
    soundEngine.playPenaltySiren()
    setPenalty({
      active: true,
      reason,
      debuffPercent: 20, // -20% effective stat debuff
      forcedQuest: {
        title: "Survive Penalty Zone",
        target: 4,
        current: 0,
        unit: "hours / workouts",
      },
      triggeredAt: new Date().toISOString(),
    })
  }, [])

  const progressPenaltyQuest = useCallback((amount = 1) => {
    setPenalty((prev) => {
      if (!prev.active || !prev.forcedQuest) return prev
      const nextCurrent = prev.forcedQuest.current + amount
      if (nextCurrent >= prev.forcedQuest.target) {
        soundEngine.playQuestChime()
        return {
          active: false,
          reason: "",
          debuffPercent: 0,
          forcedQuest: null,
        }
      }
      return {
        ...prev,
        forcedQuest: { ...prev.forcedQuest, current: nextCurrent },
      }
    })
  }, [])

  const clearPenalty = useCallback(() => {
    setPenalty({
      active: false,
      reason: "",
      debuffPercent: 0,
      forcedQuest: null,
    })
  }, [])

  // Dynamic Combat Power (CP) calculation
  const getCombatPower = useCallback(
    (playerLevel: number): number => {
      const baseStatPower = stats.str * 10 + stats.vit * 8 + stats.agi * 8 + stats.int * 6 + stats.per * 6
      const equippedWeaponPower = inventory
        .filter((i) => i.equipped && i.type === "weapon" && i.statBoost)
        .reduce((sum, item) => {
          const b = item.statBoost!
          return sum + ((b.str ?? 0) * 15 + (b.agi ?? 0) * 10)
        }, 0)
      const shadowPower = shadows
        .filter((s) => s.extracted)
        .reduce((sum, s) => sum + s.power, 0)
      const debuffMultiplier = penalty.active ? (100 - penalty.debuffPercent) / 100 : 1

      return Math.round((playerLevel * 50 + baseStatPower + equippedWeaponPower + shadowPower) * debuffMultiplier)
    },
    [stats, inventory, shadows, penalty]
  )

  return {
    stats,
    gold,
    inventory,
    gates,
    shadows,
    skills,
    dailyQuests,
    penalty,
    allocateAP,
    awardAP,
    addGold,
    spendGold,
    buyItem,
    toggleEquipWeapon,
    usePotion,
    incrementDailyQuest,
    recordMissionProgress,
    clearGate,
    extractShadow,
    assignShadowCategory,
    triggerPenalty,
    progressPenaltyQuest,
    clearPenalty,
    getCombatPower,
  }
}
