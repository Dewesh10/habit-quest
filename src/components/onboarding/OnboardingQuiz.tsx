import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { QUIZ_QUESTIONS } from "../../data/onboardingQuiz"
import type { QuizAnswers } from "../../utils/onboardingScoring"

interface OnboardingQuizProps {
  onComplete: (answers: QuizAnswers) => void
  onBack: () => void
}

export default function OnboardingQuiz({ onComplete, onBack }: OnboardingQuizProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const question = QUIZ_QUESTIONS[step]
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100

  function goNext(nextAnswers: QuizAnswers = answers) {
    if (step === QUIZ_QUESTIONS.length - 1) {
      onComplete(nextAnswers)
    } else {
      setStep((s) => s + 1)
    }
  }

  function goBack() {
    if (step === 0) {
      onBack()
    } else {
      setStep((s) => s - 1)
    }
  }

  function selectSingle(optionId: string) {
    const next = { ...answers, [question.id]: optionId }
    setAnswers(next)
    setTimeout(() => goNext(next), 250)
  }

  function toggleMulti(optionId: string) {
    const current = (answers[question.id] as string[]) ?? []
    const max = question.maxSelect ?? 3
    let next: string[]
    if (current.includes(optionId)) {
      next = current.filter((id) => id !== optionId)
    } else {
      if (current.length >= max) return
      next = [...current, optionId]
    }
    setAnswers({ ...answers, [question.id]: next })
  }

  function setSlider(value: number) {
    setAnswers({ ...answers, [question.id]: value })
  }

  const sliderValue = (answers[question.id] as number) ?? 3
  const sliderLabels = ["Uncertain", "Hesitant", "Willing", "Ready", "Determined", "Unstoppable"]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col px-6 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={goBack}
          aria-label="Back"
          className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-400"
            style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(56,189,248,0.7)" }}
          />
        </div>
      </div>

      <div key={question.id} className="flex-1 route-fade-in">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-white italic mb-2 leading-tight">
          {question.prompt}
        </h1>
        {question.subtext && (
          <p className="text-slate-500 text-sm mb-6">{question.subtext}</p>
        )}
        {!question.subtext && <div className="mb-6" />}

        {question.type === "single" && question.options && (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectSingle(opt.id)}
                className="text-left px-5 py-4 rounded-xl border border-blue-900/40 bg-slate-900/60 hover:border-blue-500/60 hover:bg-blue-500/5 text-slate-200 font-medium transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {question.type === "multi" && question.options && (
          <div className="flex flex-col gap-3">
            {question.options.map((opt) => {
              const selected = ((answers[question.id] as string[]) ?? []).includes(opt.id)
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleMulti(opt.id)}
                  className={`text-left px-5 py-4 rounded-xl border font-medium transition-colors ${
                    selected
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-blue-900/40 bg-slate-900/60 text-slate-200 hover:border-blue-500/60"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}

        {question.type === "slider" && (
          <div className="mt-8">
            <p className="font-display text-6xl font-bold text-cyan-300 text-center mb-2">
              {sliderValue}
            </p>
            <p className="text-cyan-300/80 text-center text-sm tracking-widest uppercase mb-8">
              {sliderLabels[sliderValue - 1] ?? "Determined"}
            </p>
            <input
              type="range"
              min={1}
              max={6}
              value={sliderValue}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>None</span>
              <span>Total</span>
            </div>
          </div>
        )}
      </div>

      {(question.type === "multi" || question.type === "slider") && (
        <button
          onClick={() => goNext()}
          disabled={
            question.type === "multi" &&
            ((answers[question.id] as string[]) ?? []).length === 0
          }
          className="mt-6 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold py-3.5 rounded-xl transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  )
}
