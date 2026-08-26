interface SystemNotificationProps {
  message: string
  subtext?: string
  visible: boolean
}

export default function SystemNotification({
  message,
  subtext,
  visible,
}: SystemNotificationProps) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="system-panel px-6 py-3 shadow-[0_0_30px_rgba(56,189,248,0.6)] min-w-[260px] text-center">
        <p className="system-panel-header mb-1">System</p>
        <p className="text-white font-semibold text-sm">{message}</p>
        {subtext && <p className="text-blue-300/80 text-xs mt-1">{subtext}</p>}
      </div>
    </div>
  )
}