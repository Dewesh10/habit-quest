import { useState } from "react"
import NameCapture from "./NameCapture"
import OnboardingQuiz from "./OnboardingQuiz"
import OnboardingReveal from "./OnboardingReveal"
import OathRitual from "./OathRitual"
import type { QuizAnswers } from "../../utils/onboardingScoring"
import { buildSuggestedHabits } from "../../utils/onboardingScoring"
import { storageService } from "../../services/storageService"
import type { Habit } from "../../types"

type Stage = "name" | "quiz" | "reveal" | "oath"

interface OnboardingFlowProps {
  onFinished: () => void
}

function makeId(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 6)
  )
}

export default function OnboardingFlow({ onFinished }: OnboardingFlowProps) {
  const [stage, setStage] = useState<Stage>("name")
  const [name, setName] = useState("")
  const [answers, setAnswers] = useState<QuizAnswers>({})

  function handleNameSubmit(value: string) {
    setName(value)
    storageService.saveUserName(value)
    setStage("quiz")
  }

  function handleQuizComplete(finalAnswers: QuizAnswers) {
    setAnswers(finalAnswers)
    setStage("reveal")
  }

  function handleRevealDone(suggested: ReturnType<typeof buildSuggestedHabits>) {
    const habits: Habit[] = suggested.map((h, index) => ({
      id: makeId(h.name),
      name: h.name,
      icon: h.icon,
      category: h.category as Habit["category"],
      color: h.color,
      frequency: h.frequency,
      xpValue: h.xpValue,
      createdAt: new Date().toISOString().slice(0, 10),
      archived: false,
      order: index,
    }))
    storageService.saveHabits(habits)
    setStage("oath")
  }

  function handleOathSigned() {
    storageService.setOnboarded(true)
    onFinished()
  }

  if (stage === "name") {
    return <NameCapture onSubmit={handleNameSubmit} />
  }

  if (stage === "quiz") {
    return (
      <OnboardingQuiz
        onComplete={handleQuizComplete}
        onBack={() => setStage("name")}
      />
    )
  }

  if (stage === "reveal") {
    return (
      <OnboardingReveal
        name={name}
        answers={answers}
        onDone={handleRevealDone}
      />
    )
  }

  return <OathRitual name={name} onSigned={handleOathSigned} />
}
