import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { soundEngine } from "../../utils/soundEngine"

export default function SystemVoiceOverlay() {
  const [muted, setMuted] = useState(() => soundEngine.isMuted())

  function handleToggle() {
    const isNowMuted = soundEngine.toggleMute()
    setMuted(isNowMuted)
    if (!isNowMuted) {
      soundEngine.playSystemAlert()
      soundEngine.speakSystemDirective("System voice and sound effects active.")
    }
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={muted ? "Unmute System Voice & Sound" : "Mute System Voice & Sound"}
      title={muted ? "Unmute System Voice & Sound" : "Mute System Voice & Sound"}
      className={`fixed top-4 right-4 z-40 p-2.5 rounded-xl border font-mono text-xs flex items-center gap-2 backdrop-blur-md transition-all shadow-[0_0_16px_rgba(56,189,248,0.3)] ${
        muted
          ? "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white"
          : "bg-cyan-950/80 border-cyan-500/60 text-cyan-300 hover:bg-cyan-900/80"
      }`}
    >
      {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
      <span className="hidden sm:inline font-bold uppercase tracking-wider">
        {muted ? "VOICE OFF" : "SYSTEM VOICE"}
      </span>
    </button>
  )
}
