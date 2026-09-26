import { useState } from "react"
import { Link } from "react-router-dom"
import { Swords, Zap, Crown, ArrowRight, Check, Sparkles, Dumbbell, GraduationCap } from "lucide-react"

import { MONARCH_PLANS } from "../../services/stripeService"
import PaywallModal from "../../components/common/PaywallModal"

export default function LandingPage() {
  const [paywallOpen, setPaywallOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono selection:bg-cyan-500 selection:text-slate-950">
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-900/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="font-display text-xl font-bold tracking-wider uppercase text-white">
              SOLO LEVELING SYSTEM
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <a href="#features" className="text-slate-400 hover:text-cyan-300 hidden sm:inline transition-colors">
              FEATURES
            </a>
            <a href="#pricing" className="text-slate-400 hover:text-cyan-300 hidden sm:inline transition-colors">
              PRICING
            </a>
            <Link
              to="/"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider rounded-lg shadow-[0_0_16px_rgba(56,189,248,0.5)] transition-all"
            >
              LAUNCH SYSTEM
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-5xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-6">
          <Zap className="w-4 h-4 text-cyan-400" /> GAMIFIED SELF-IMPROVEMENT & COLLEGE SYSTEM
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6">
          WAKE UP YOUR <span className="text-cyan-400 drop-shadow-[0_0_24px_rgba(56,189,248,0.8)]">HUNTER SYSTEM</span>
        </h1>

        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10">
          Level up your daily habits, allocate free stat points into STR, VIT, AGI, INT, & PER, raid Dungeon Gates, and extract Shadow Soldiers.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(56,189,248,0.6)] flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <span>AWAKEN YOUR SYSTEM NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setPaywallOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Crown className="w-4 h-4 text-purple-400" />
            <span>VIEW MONARCH TIERS</span>
          </button>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="px-6 py-16 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-cyan-400 uppercase tracking-widest block mb-1">[ SYSTEM ARCHITECTURE ]</span>
            <h2 className="font-display text-3xl font-black uppercase tracking-wide">CORE HUNTER CAPABILITIES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="system-panel p-6 border-slate-800">
              <GraduationCap className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">College Student System</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tailored for Computer Science, Pre-Med, Business, & Engineering students with Semester Exam Gates & Study Blocks.
              </p>
            </div>

            <div className="system-panel p-6 border-slate-800">
              <Swords className="w-8 h-8 text-red-400 mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Dungeon Raids & Boss Arena</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Raid E-Rank to S-Rank Red Gates, engage bosses in turn-based combat, and extract **Shadow Soldiers (ARISE)**!
              </p>
            </div>

            <div className="system-panel p-6 border-slate-800">
              <Dumbbell className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Daily Quests & Penalty Zone</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Non-skippable workout suites with real emergency siren penalty zones and temporary stat debuffs when neglected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section id="pricing" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs text-purple-400 uppercase tracking-widest block mb-1">[ ACCESS TIERS ]</span>
          <h2 className="font-display text-3xl font-black uppercase tracking-wide">SELECT YOUR SYSTEM RANK</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MONARCH_PLANS.slice(0, 2).map((plan) => (
            <div
              key={plan.id}
              className={`system-panel p-8 relative overflow-hidden flex flex-col justify-between ${
                plan.id !== "plan_free"
                  ? "border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                  : "border-slate-800"
              }`}
            >
              <div>
                <span className="text-xs text-slate-400 uppercase font-mono block mb-1">{plan.name}</span>
                <p className="font-display text-4xl font-black text-white mb-6">{plan.price}</p>

                <div className="space-y-3 mb-8 text-xs font-mono text-slate-300">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => (plan.id === "plan_free" ? (window.location.href = "/") : setPaywallOpen(true))}
                className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase font-bold tracking-widest transition-all ${
                  plan.id !== "plan_free"
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                {plan.id === "plan_free" ? "START FREE TRACKING" : "UPGRADE TO MONARCH"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-900 text-xs font-mono text-slate-500 text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Solo Leveling System. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
