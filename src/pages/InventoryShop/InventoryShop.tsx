import { useState } from "react"
import { Coins, FlaskConical, Sword, Key, ShoppingBag, PackageCheck } from "lucide-react"
import type { InventoryItem, ShopItem } from "../../types"
import CornerBrackets from "../../components/common/CornerBrackets"



interface InventoryShopProps {
  gold: number
  inventory: InventoryItem[]
  onBuyItem: (shopItem: ShopItem) => boolean
  onToggleEquip: (itemId: string) => void
  onUsePotion: (itemId: string) => boolean
}

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: "potion-recovery-1",
    name: "Status Recovery Potion",
    description: "Fully restores player HP/MP and clears fatigue meter.",
    cost: 150,
    type: "potion",
    icon: "FlaskConical",
  },
  {
    id: "potion-xp-elixir",
    name: "System XP Elixir",
    description: "Grants +100 instant bonus XP to player level.",
    cost: 300,
    type: "potion",
    icon: "FlaskConical",
  },
  {
    id: "weapon-knight-killer",
    name: "Knight Killer's Dagger",
    description: "Obsidian dagger crafted to breach heavy armor. (+5 STR, +3 AGI)",
    cost: 500,
    type: "weapon",
    icon: "Sword",
    statBoost: { str: 5, agi: 3 },
  },
  {
    id: "weapon-demon-king-sword",
    name: "Demon King's Longsword",
    description: "Imbued with lightning demon flames. (+15 STR, +10 INT)",
    cost: 1200,
    type: "weapon",
    icon: "Sword",
    statBoost: { str: 15, int: 10 },
  },
  {
    id: "key-gate-red",
    name: "Red Gate Emergency Key",
    description: "Unlocks entry to S-Rank Red Gate & Ant King Lair.",
    cost: 800,
    type: "key",
    icon: "Key",
  },
]

export default function InventoryShop({
  gold,
  inventory,
  onBuyItem,
  onToggleEquip,
  onUsePotion,
}: InventoryShopProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "shop">("inventory")
  const [feedback, setFeedback] = useState<string | null>(null)

  function handleBuy(item: ShopItem) {
    const ok = onBuyItem(item)
    if (ok) {
      setFeedback(`Purchased ${item.name}!`)
    } else {
      setFeedback(`Insufficient Gold to purchase ${item.name}!`)
    }
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
            System Store & Inventory
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-0.5">
            Purchase weapons, potions, keys, and manage equipped hunter gear
          </p>
        </div>

        {/* Gold Display Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/40 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="font-display text-xl font-bold text-amber-300">
            {gold.toLocaleString()} GOLD
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-300 font-mono text-xs text-center animate-pulse">
          &gt; {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
            activeTab === "inventory"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <PackageCheck className="w-4 h-4" /> INVENTORY ({inventory.length})
        </button>

        <button
          onClick={() => setActiveTab("shop")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
            activeTab === "shop"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> SYSTEM SHOP
        </button>
      </div>

      {activeTab === "inventory" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.length === 0 ? (
            <p className="text-slate-500 font-mono text-sm col-span-full py-8 text-center">
              Your inventory is empty. Visit the System Shop to purchase potions & weapons.
            </p>
          ) : (
            inventory.map((item) => (
              <div
                key={item.id}
                className={`system-panel p-5 relative overflow-hidden ${
                  item.equipped ? "border-cyan-400 shadow-[0_0_24px_rgba(56,189,248,0.4)]" : "border-slate-800"
                }`}
              >
                <CornerBrackets />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      {item.type === "weapon" ? (
                        <Sword className="w-6 h-6 text-cyan-400" />
                      ) : item.type === "potion" ? (
                        <FlaskConical className="w-6 h-6 text-purple-400" />
                      ) : (
                        <Key className="w-6 h-6 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base font-display">{item.name}</h3>
                      <span className="text-[0.65rem] font-mono uppercase text-slate-400">
                        QTY: x{item.quantity} &middot; {item.type}
                      </span>
                    </div>
                  </div>

                  {item.equipped && (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[0.65rem] font-bold">
                      EQUIPPED
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-xs font-mono mb-4">{item.description}</p>

                {item.type === "weapon" && (
                  <button
                    onClick={() => onToggleEquip(item.id)}
                    className={`w-full py-2 rounded font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                      item.equipped
                        ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                        : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_16px_rgba(56,189,248,0.5)]"
                    }`}
                  >
                    {item.equipped ? "UNEQUIP WEAPON" : "EQUIP WEAPON"}
                  </button>
                )}

                {item.type === "potion" && (
                  <button
                    onClick={() => onUsePotion(item.id)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded shadow-[0_0_16px_rgba(168,85,247,0.5)] transition-all"
                  >
                    USE POTION
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_SHOP_ITEMS.map((item) => (
            <div key={item.id} className="system-panel p-5 relative overflow-hidden border-slate-800">
              <CornerBrackets />

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    {item.type === "weapon" ? (
                      <Sword className="w-6 h-6 text-cyan-400" />
                    ) : item.type === "potion" ? (
                      <FlaskConical className="w-6 h-6 text-purple-400" />
                    ) : (
                      <Key className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base font-display">{item.name}</h3>
                    <span className="text-amber-400 font-mono font-bold text-xs">
                      {item.cost.toLocaleString()} GOLD
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-mono mb-4">{item.description}</p>

              <button
                onClick={() => handleBuy(item)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded shadow-[0_0_16px_rgba(245,158,11,0.5)] transition-all"
              >
                BUY FOR {item.cost} GOLD
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
