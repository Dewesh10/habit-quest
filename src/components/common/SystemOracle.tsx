import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send } from "lucide-react"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { useSettings } from "../../hooks/useSettings"
import { buildUserContext } from "../../utils/insights"
import { generateResponse, SUGGESTED_QUERIES } from "../../utils/systemOracle"

interface ChatMessage {
  id: string
  role: "user" | "system"
  text: string
}

export default function SystemOracle() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      text: "System online. Ask about your progress, weak points, or Gate status, Hunter.",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()
  const { settings, loaded: settingsLoaded } = useSettings()

  const ready = habitsLoaded && completionsLoaded && settingsLoaded

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  function respond(query: string) {
    if (!ready) return
    const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: "user", text: query }
    setMessages((prev) => [...prev, userMsg])

    const context = buildUserContext(habits, completions, settings.monthlyGoal)
    const text = generateResponse(context, query)

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `${Date.now()}-s`, role: "system", text }])
    }, 350)

    setInput("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    respond(input.trim())
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open System AI"
        className={`fixed bottom-20 md:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.6)] transition-transform hover:scale-105 ${
          open ? "scale-0" : "scale-100"
        }`}
      >
        <Sparkles className="w-6 h-6 text-slate-950" />
      </button>

      <div
        role="dialog"
        aria-label="System AI chat"
        aria-hidden={!open}
        style={{ height: "min(70vh, 560px)", maxHeight: "calc(100vh - 2rem)" }}
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-96 sm:bottom-6 sm:right-4 flex flex-col system-panel transition-all duration-300 ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-900/30 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <p className="system-panel-header">System AI</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close System AI"
            className="text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] text-sm px-3 py-2 rounded-lg ${
                m.role === "user"
                  ? "self-end bg-blue-500 text-slate-950 font-medium"
                  : "self-start bg-slate-800/80 text-slate-200 border border-blue-900/30"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q.id}
              onClick={() => respond(q.label)}
              disabled={!ready}
              className="text-[0.7rem] px-2.5 py-1 rounded-full border border-blue-900/40 text-blue-300 hover:bg-blue-500/10 transition-colors disabled:opacity-40"
            >
              {q.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-blue-900/30 shrink-0">
          <label htmlFor="system-oracle-input" className="sr-only">Ask the System</label>
          <input
            id="system-oracle-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the System..."
            disabled={!ready}
            className="flex-1 bg-slate-800 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!ready || !input.trim()}
            aria-label="Send"
            className="bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  )
}
