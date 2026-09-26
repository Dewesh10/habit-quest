import { EyeOff, Flame, Hand, Sparkles, Lock, CheckCircle2, Zap } from "lucide-react"
import type { Skill } from "../../types"
import CornerBrackets from "../../components/common/CornerBrackets"


interface SkillsProps {
  skills: Skill[]
  onUnlockSkill?: (skillId: string) => void
}

const ICON_MAP: Record<string, React.ReactNode> = {
  EyeOff: <EyeOff className="w-6 h-6 text-indigo-400" />,
  Flame: <Flame className="w-6 h-6 text-red-400" />,
  Hand: <Hand className="w-6 h-6 text-cyan-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-purple-400" />,
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
            Player Skills Tree
          </h1>
          <p className="text-slate-400 text-sm mt-0.5 font-mono">
            Passive abilities & Monarch authority powers
          </p>
        </div>
        <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded font-mono text-xs text-purple-300">
          UNLOCKED: {skills.filter((s) => s.unlocked).length} / {skills.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`system-panel p-6 relative overflow-hidden transition-all ${
              skill.unlocked
                ? "border-purple-500/40 shadow-[0_0_24px_rgba(168,85,247,0.25)]"
                : "border-slate-800 opacity-70"
            }`}
          >
            <CornerBrackets />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    skill.unlocked
                      ? "bg-purple-950/50 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  {ICON_MAP[skill.icon] || <Zap className="w-6 h-6 text-cyan-400" />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg font-display tracking-wide">
                    {skill.name}
                  </h3>
                  <span
                    className={`text-[0.65rem] font-mono uppercase px-2 py-0.5 rounded border ${
                      skill.unlocked
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}
                  >
                    {skill.unlocked ? "ACTIVE PASSIVE" : "LOCKED SKILL"}
                  </span>
                </div>
              </div>

              {skill.unlocked ? (
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              ) : (
                <Lock className="w-5 h-5 text-slate-600" />
              )}
            </div>

            <p className="text-slate-300 text-sm font-mono mb-4 leading-relaxed">
              {skill.description}
            </p>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>CONDITION:</span>
                <span className="text-cyan-400">{skill.unlockCondition}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>EFFECT:</span>
                <span className="text-purple-300 font-bold">{skill.effect}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
