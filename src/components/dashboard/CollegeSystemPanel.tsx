import { useState, useEffect } from "react"
import { GraduationCap, BookOpen, CheckCircle2, Trophy, Award, Play, Pause, RotateCcw, Timer } from "lucide-react"
import type { CollegeProfile, CollegeMajor } from "../../types"
import CornerBrackets from "../common/CornerBrackets"
import { soundEngine } from "../../utils/soundEngine"

interface CollegeSystemPanelProps {
  profile: CollegeProfile
  onUpdateProfile: (updated: Partial<CollegeProfile>) => void
  onCompleteAcademicQuest: (questId: string) => void
  onProgressExamGate: (gateId: string, hours: number) => void
}

const MAJORS: CollegeMajor[] = [
  "Computer Science & Engineering",
  "Pre-Med & Healthcare",
  "Business & Finance",
  "Law & Legal Studies",
  "Natural Sciences & Math",
  "Arts & Design",
  "General Academic",
]

function PomodoroChamber() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000)
    } else if (seconds === 0 && isActive) {
      setIsActive(false)
      soundEngine.playPomodoroTick()
      soundEngine.speakSystemDirective("Pomodoro Focus Chamber cleared. INT and PER stat points awarded.")
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeDisplay = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`

  return (
    <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-purple-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg bg-purple-950/80 border border-purple-500/50">
          <Timer className="w-6 h-6 text-purple-400 animate-pulse" />
        </div>
        <div>
          <span className="text-[0.65rem] font-mono text-purple-300 uppercase tracking-widest block">
            POMODORO FOCUS CHAMBER
          </span>
          <p className="text-white text-xs text-slate-400">25-min Deep Focus Dungeon &middot; Granting +2 INT on completion</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-mono text-3xl font-extrabold text-cyan-300 tracking-wider">
          {timeDisplay}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick()
              setIsActive(!isActive)
            }}
            className={`p-2.5 rounded-lg font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)] ${
              isActive
                ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? "PAUSE" : "START"}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick()
              setIsActive(false)
              setSeconds(25 * 60)
            }}
            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CollegeSystemPanel({
  profile,
  onUpdateProfile,
  onCompleteAcademicQuest,
  onProgressExamGate,
}: CollegeSystemPanelProps) {
  const [isEditingMajor, setIsEditingMajor] = useState(false)

  const completedQuestsCount = profile.academicQuests.filter((q) => q.completed).length

  return (
    <div className="system-panel p-5 md:p-6 mb-6 relative overflow-hidden border-purple-500/30">
      <CornerBrackets />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="system-panel-header">ACADEMIC SYSTEM</span>
            <span className="text-[0.65rem] font-mono text-purple-300 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
              COLLEGE STUDENT MODE
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            {isEditingMajor ? (
              <select
                value={profile.major}
                onChange={(e) => {
                  onUpdateProfile({ major: e.target.value as CollegeMajor })
                  setIsEditingMajor(false)
                }}
                className="bg-slate-900 border border-purple-500/50 rounded px-2 py-1 text-xs font-mono text-white"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <h2
                onClick={() => setIsEditingMajor(true)}
                className="font-display text-xl font-bold text-white tracking-wide cursor-pointer hover:text-purple-300 transition-colors"
                title="Click to edit major"
              >
                {profile.major} &middot; {profile.year}
              </h2>
            )}
          </div>
        </div>

        {/* GPA Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/40 rounded-lg font-mono text-xs">
          <Award className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300">TARGET GPA:</span>
          <span className="text-purple-300 font-bold text-sm">{profile.targetGPA.toFixed(1)} / 4.0</span>
        </div>
      </div>

      {/* Pomodoro Focus Dungeon Chamber */}
      <PomodoroChamber />

      {/* Academic Daily Quests Grid */}
      <div className="mb-6">
        <h3 className="text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Today's Academic Directives ({completedQuestsCount}/{profile.academicQuests.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.academicQuests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3.5 rounded-lg border transition-all ${
                quest.completed
                  ? "bg-slate-900/40 border-emerald-500/30"
                  : "bg-slate-900/80 border-purple-900/40 hover:border-purple-500/40"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[0.6rem] font-mono uppercase text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-900">
                    {quest.category}
                  </span>
                  <p className="text-white text-sm font-semibold mt-1">{quest.title}</p>
                </div>
                {quest.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span>TARGET: {quest.hoursTarget} hr(s)</span>
                <span className="text-amber-400">+{quest.intReward} INT &middot; +{quest.goldReward} Gold</span>
              </div>

              {!quest.completed && (
                <button
                  onClick={() => onCompleteAcademicQuest(quest.id)}
                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs uppercase tracking-wider rounded shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all"
                >
                  LOG & COMPLETE
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Semester Exam Dungeon Gates */}
      <div>
        <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Trophy className="w-4 h-4" /> Semester Exam Raid Gates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.examGates.map((gate) => {
            const pct = Math.min(100, Math.round((gate.currentStudyHours / gate.requiredStudyHours) * 100))
            const isReady = gate.currentStudyHours >= gate.requiredStudyHours

            return (
              <div key={gate.id} className="p-4 rounded-lg bg-slate-900 border border-amber-500/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-bold font-mono text-sm">{gate.name}</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {gate.difficulty}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                  <span>STUDY PREPARATION:</span>
                  <span className="text-cyan-400 font-bold">
                    {gate.currentStudyHours} / {gate.requiredStudyHours} Hours
                  </span>
                </div>

                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-300 ${
                      gate.cleared ? "bg-emerald-400" : isReady ? "bg-amber-400 animate-pulse" : "bg-purple-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {!gate.cleared && (
                  <button
                    onClick={() => onProgressExamGate(gate.id, 1)}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider rounded transition-all"
                  >
                    +1 HOUR STUDY LOG
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
