import { useEffect, useRef, useState } from "react"

export function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(target)
  const prevTarget = useRef(target)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const from = prevTarget.current
    const to = target
    if (from === to) return

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        prevTarget.current = to
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}
