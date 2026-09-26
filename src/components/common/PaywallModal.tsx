import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Check, ArrowRight, X } from "lucide-react"

import { MONARCH_PLANS, stripeService } from "../../services/stripeService"

interface PaywallModalProps {
  open: boolean
  onClose: () => void
}

export default function PaywallModal({ open, onClose }: PaywallModalProps) {
  const [selectedInterval, setSelectedInterval] = useState<"monthly" | "yearly">("monthly")

  if (!open) return null

  const activePlan = MONARCH_PLANS.find(
    (p) => p.interval === selectedInterval && p.id !== "plan_free"
  )!

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-slate-950 border-2 border-purple-500/60 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.4)] text-center overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-lg border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs uppercase tracking-widest">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>[ SYSTEM MONARCH ACCESS ]</span>
            </div>
          </div>

          <h2 className="font-display text-3xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            UNLOCK SHADOW MONARCH TIER
          </h2>

          <p className="text-slate-300 text-xs font-mono mb-6 max-w-md mx-auto">
            Upgrade to unlock full Shadow Army extractions (ARISE), Interactive Boss Raids, College Exam Gates, and Cloud Sync.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl inline-flex font-mono text-xs">
              <button
                onClick={() => setSelectedInterval("monthly")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedInterval === "monthly"
                    ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly ($9.99/mo)
              </button>
              <button
                onClick={() => setSelectedInterval("yearly")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedInterval === "yearly"
                    ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly ($79.99/yr) <span className="text-amber-400 font-bold ml-1">SAVE 33%</span>
              </button>
            </div>
          </div>

          {/* Plan Feature Box */}
          <div className="p-5 bg-slate-900/90 border border-purple-500/40 rounded-xl text-left mb-6 font-mono text-xs space-y-2.5">
            {activePlan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-200">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => stripeService.redirectToCheckout(activePlan.stripePriceId)}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-xl shadow-[0_0_24px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <span>UPGRADE TO SHADOW MONARCH ({activePlan.price})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[0.65rem] text-slate-500 font-mono mt-3">
            Secured by Stripe &middot; Cancel anytime with 1-click in Customer Portal
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
