import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings2 } from "lucide-react"
import type { CollegeMajor } from "../../types"

interface CustomRoutineModalProps {
  open: boolean
  currentMajor: CollegeMajor
  onSave: (config: {
    major: CollegeMajor
    dailyStudyGoalHours: number
    workoutTarget: number
  }) => void
  onClose: () => void
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

export default function CustomRoutineModal({
  open,
  currentMajor,
  onSave,
  onClose,
}: CustomRoutineModalProps) {
  const [major, setMajor] = useState<CollegeMajor>(currentMajor)
  const [studyHours, setStudyHours] = useState(3)
  const [workoutReps, setWorkoutReps] = useState(100)

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg bg-slate-950 border-2 border-cyan-500/50 rounded-xl p-6 shadow-[0_0_50px_rgba(56,189,248,0.4)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-6 h-6 text-cyan-400" />
            <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
              System Routine Personalizer
            </h2>
          </div>

          <p className="text-slate-400 text-xs font-mono mb-6">
            Customize your academic major, daily study targets, and daily fitness reps.
          </p>

          <div className="space-y-4 font-mono text-xs">
            {/* Major Selection */}
            <div>
              <label className="text-cyan-300 block mb-1">COLLEGE MAJOR / DISCIPLINE:</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value as CollegeMajor)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Study Goal */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>DAILY STUDY GOAL:</span>
                <span className="text-cyan-400 font-bold">{studyHours} Hours / Day</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Fitness Reps Target */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>DAILY FITNESS REPS TARGET:</span>
                <span className="text-cyan-400 font-bold">{workoutReps} Reps</span>
              </div>
              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={workoutReps}
                onChange={(e) => setWorkoutReps(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs uppercase"
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                onSave({ major, dailyStudyGoalHours: studyHours, workoutTarget: workoutReps })
                onClose()
              }}
              className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase shadow-[0_0_16px_rgba(56,189,248,0.5)] transition-all"
            >
              APPLY SYSTEM ROUTINE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
