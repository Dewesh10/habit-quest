import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react"

type ToastVariant = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "border-emerald-500/40 text-emerald-300" },
  error: { icon: XCircle, className: "border-red-500/40 text-red-300" },
  warning: { icon: AlertTriangle, className: "border-amber-500/40 text-amber-300" },
  info: { icon: Info, className: "border-blue-500/40 text-blue-300" },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((variant: ToastVariant, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const value: ToastContextValue = {
    toast: {
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      warning: (m) => push("warning", m),
      info: (m) => push("info", m),
    },
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const config = VARIANT_CONFIG[t.variant]
          const Icon = config.icon
          return (
            <div
              key={t.id}
              role="status"
              className={`system-panel px-4 py-3 flex items-start gap-2.5 animate-toast-in ${config.className}`}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-200">{t.message}</p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx.toast
}
