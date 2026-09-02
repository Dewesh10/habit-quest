import { useState } from "react"

interface NameCaptureProps {
  onSubmit: (name: string) => void
}

export default function NameCapture({ onSubmit }: NameCaptureProps) {
  const [name, setName] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1),transparent_60%)]" />
      <div className="relative max-w-sm w-full">
        <span className="inline-block text-[0.65rem] tracking-widest uppercase text-blue-300 border border-blue-900/50 rounded-full px-3 py-1 mb-6">
          Getting to know where you stand
        </span>
        <h1 className="font-display text-2xl md:text-3xl font-bold italic text-white leading-tight mb-3">
          Before the System begins, who are we speaking to?
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Answer honestly. We will use your answers to build a plan made for you.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="bg-slate-900/60 border border-blue-900/40 rounded-xl px-4 py-3.5 text-white text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="bg-blue-500 hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold py-3.5 rounded-xl transition-colors"
          >
            Begin
          </button>
        </form>
      </div>
    </div>
  )
}
