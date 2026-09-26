import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, AlertTriangle, Sparkles, CheckCircle2, Zap } from "lucide-react"
import type { SystemMessageType } from "../../types"


interface SystemMessageModalProps {
  open: boolean
  type?: SystemMessageType
  title: string
  text: string
  subtext?: string
  requiresConfirm?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onClose: () => void
}

export default function SystemMessageModal({
  open,
  type = "quest",
  title,
  text,
  subtext,
  requiresConfirm = false,
  confirmText = "ACCEPT",
  cancelText = "DECLINE",
  onConfirm,
  onClose,
}: SystemMessageModalProps) {
  if (!open) return null

  const getBorderColor = () => {
    switch (type) {
      case "penalty":
        return "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]"
      case "caution":
        return "border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]"
      case "arise":
        return "border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.6)]"
      case "levelup":
        return "border-cyan-400 shadow-[0_0_40px_rgba(56,189,248,0.5)]"
      case "quest":
      default:
        return "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)]"
    }
  }

  const getHeaderBg = () => {
    switch (type) {
      case "penalty":
        return "bg-red-500/20 text-red-400 border-red-500/40"
      case "caution":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40"
      case "arise":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40"
      case "levelup":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "penalty":
        return <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
      case "caution":
        return <AlertTriangle className="w-6 h-6 text-amber-400" />
      case "arise":
        return <Zap className="w-6 h-6 text-purple-400 animate-bounce" />
      case "levelup":
        return <Sparkles className="w-6 h-6 text-cyan-300" />
      default:
        return <CheckCircle2 className="w-6 h-6 text-blue-400" />
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`relative w-full max-w-md bg-slate-950/95 border-2 ${getBorderColor()} rounded-xl overflow-hidden p-6 text-center`}
        >
          {/* Holographic grid overlay */}
          <div className="absolute inset-0 bg-grid-texture opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Header Badge */}
          <div className="flex justify-center mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest ${getHeaderBg()}`}>
              {getIcon()}
              <span>[ SYSTEM DIRECTIVE ]</span>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider mb-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            {title}
          </h2>

          <div className="my-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200 text-sm font-mono leading-relaxed text-left">
            <p className="text-cyan-300 font-semibold mb-1">&gt; NOTICE:</p>
            <p>{text}</p>
            {subtext && <p className="text-slate-400 text-xs mt-2 border-t border-slate-800 pt-2">{subtext}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center mt-6">
            {requiresConfirm ? (
              <>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-400 font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm()
                    onClose()
                  }}
                  className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all transform hover:scale-105"
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all"
              >
                CONFIRM
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
