import { Component, type ErrorInfo, type ReactNode } from "react"
import { ShieldAlert, RefreshCw } from "lucide-react"


interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class SystemErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[SystemErrorBoundary] Uncaught React crash:", error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center font-mono">
          <div className="w-full max-w-md p-8 bg-slate-950 border-2 border-red-500 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-full animate-pulse">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h1 className="font-display text-2xl font-black text-red-500 uppercase tracking-wider mb-2">
              SYSTEM ERROR DETECTED
            </h1>

            <p className="text-slate-300 text-xs mb-4">
              CONNECTION TO THE DUNGEON LOST OR ANOMALY OCCURRED.
            </p>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded text-left text-[0.65rem] text-slate-400 mb-6 overflow-x-auto">
              <span className="text-red-400 font-bold block mb-1">&gt; EXCEPTION TRACE:</span>
              <code>{this.state.error?.message || "Unknown System Crash"}</code>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all"
            >
              <RefreshCw className="w-4 h-4" /> RE-INITIALIZE SYSTEM
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
