// Onboarding quiz: questions, scoring, and the habit/stat projections
// derived from the user's actual answers. Nothing here is randomized —
// every number shown in the reveal screens is computed from real input.

export type StatKey = "WIL" | "STR" | "INT" | "DIL" | "VIT"

export interface QuizOption {
  id: string
  label: string
  // Points this option contributes to each stat (only nonzero ones need listing)
  stats?: Partial<Record<StatKey, number>>
}

export interface QuizQuestion {
  id: string
  prompt: string
  subtext?: string
  type: "single" | "multi" | "slider"
  options?: QuizOption[]
  maxSelect?: number // for multi
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "life-areas",
    prompt: "Which areas of your life need the most attention now?",
    subtext: "Pick up to three. Most important first.",
    type: "multi",
    maxSelect: 3,
    options: [
      { id: "fitness", label: "Health and fitness", stats: { STR: 2, VIT: 1 } },
      { id: "mental", label: "Mental health and wellbeing", stats: { WIL: 2, VIT: 1 } },
      { id: "career", label: "Career and productivity", stats: { INT: 2, DIL: 1 } },
      { id: "discipline", label: "Discipline and habits", stats: { DIL: 2, WIL: 1 } },
      { id: "social", label: "Relationships and social life", stats: { VIT: 2 } },
      { id: "study", label: "Study and learning", stats: { INT: 2 } },
      { id: "growth", label: "Purpose and growth", stats: { WIL: 2 } },
      { id: "rebuild", label: "Rebuilding from zero", stats: { WIL: 1, DIL: 1, STR: 1 } },
    ],
  },
  {
    id: "life-satisfaction",
    prompt: "How would you describe your life right now?",
    type: "single",
    options: [
      { id: "satisfied", label: "I am satisfied with my life" },
      { id: "want-better", label: "I am fine, but I want better" },
      { id: "getting-by", label: "Neither good nor bad, getting by" },
      { id: "low", label: "Low, and rarely happy" },
    ],
  },
  {
    id: "attempts",
    prompt: "How many times have you tried to change it?",
    type: "single",
    options: [
      { id: "first", label: "This is the first time" },
      { id: "once-twice", label: "Once or twice" },
      { id: "few", label: "Three to five" },
      { id: "lost-count", label: "I have lost count" },
    ],
  },
  {
    id: "costly-habit",
    prompt: "Which habit is costing you the most?",
    type: "single",
    options: [
      { id: "phone", label: "Phone and social media" },
      { id: "gaming", label: "Video games" },
      { id: "junk-food", label: "Junk food" },
      { id: "procrastination", label: "Putting everything off" },
      { id: "none", label: "Nothing specific comes to mind" },
    ],
  },
  {
    id: "proud-moment",
    prompt: "When did you last feel proud of yourself?",
    type: "single",
    options: [
      { id: "today", label: "Today" },
      { id: "few-days", label: "A few days ago" },
      { id: "long-time", label: "It has been a while" },
    ],
  },
  {
    id: "sleep",
    prompt: "How do you sleep?",
    type: "single",
    options: [
      { id: "well", label: "Well, and I wake up rested", stats: { VIT: 2 } },
      { id: "could-be-better", label: "Could be better", stats: { VIT: 1 } },
      { id: "struggle", label: "I struggle often" },
      { id: "mess", label: "My schedule is a mess" },
    ],
  },
  {
    id: "eating",
    prompt: "How do you eat most days?",
    type: "single",
    options: [
      { id: "well", label: "Pretty well", stats: { VIT: 2 } },
      { id: "inconsistent", label: "I try, but I am not consistent", stats: { VIT: 1 } },
      { id: "fast-food", label: "Mostly fast food" },
      { id: "no-thought", label: "I do not think about it" },
    ],
  },
  {
    id: "slip-trigger",
    prompt: "What makes you slip back?",
    type: "single",
    options: [
      { id: "stress", label: "Stress" },
      { id: "boredom", label: "Boredom" },
      { id: "alone", label: "Being alone" },
      { id: "nights", label: "Nights" },
      { id: "people", label: "The people around me" },
    ],
  },
  {
    id: "self-assessment",
    prompt: "Which describes you best today?",
    type: "single",
    options: [
      { id: "struggle-basics", label: "I struggle to even start the basics", stats: { DIL: 0 } },
      { id: "need-structure", label: "I do the basics, but I need structure", stats: { DIL: 1 } },
      { id: "sharpen", label: "I am already disciplined, I want to sharpen", stats: { DIL: 2 } },
      { id: "high-performance", label: "I want a high-performance plan", stats: { DIL: 3, WIL: 1 } },
    ],
  },
  {
    id: "day-structure",
    prompt: "What are your days like?",
    type: "single",
    options: [
      { id: "routine", label: "The same, same routine" },
      { id: "mostly-similar", label: "Similar, with the odd surprise" },
      { id: "changing", label: "They change every week" },
      { id: "shift", label: "Shift work or nights" },
      { id: "mess", label: "Right now, a mess" },
    ],
  },
  {
    id: "values",
    prompt: "What matters most to you right now?",
    subtext: "Pick up to three.",
    type: "multi",
    maxSelect: 3,
    options: [
      { id: "energy", label: "Health and energy", stats: { STR: 1, VIT: 1 } },
      { id: "peace", label: "Peace of mind", stats: { WIL: 1 } },
      { id: "achieving", label: "Achieving what I set out to do", stats: { DIL: 1 } },
      { id: "freedom", label: "Freedom and independence", stats: { WIL: 1 } },
      { id: "purpose", label: "Faith and purpose", stats: { WIL: 1 } },
      { id: "belonging", label: "People and belonging", stats: { VIT: 1 } },
      { id: "growth", label: "Growing as a person", stats: { INT: 1 } },
    ],
  },
  {
    id: "identity",
    prompt: "Which of the two feels most yours?",
    type: "single",
    options: [
      { id: "discipline-identity", label: "I want to become someone who lives with discipline" },
      { id: "results", label: "I want to reach my goals and see results" },
    ],
  },
  {
    id: "push-level",
    prompt: "How hard do you want us to push?",
    type: "single",
    options: [
      { id: "step-by-step", label: "No pressure, step by step" },
      { id: "steady", label: "Steady growth" },
      { id: "push-me", label: "Push me, I can take it" },
      { id: "all-or-nothing", label: "All or nothing, maximum challenge" },
    ],
  },
  {
    id: "confidence",
    prompt: "How confident are you about keeping a routine?",
    subtext: "There is no right answer.",
    type: "slider",
  },
]
