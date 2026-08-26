import { useCountUp } from "../../hooks/useCountUp"

interface CountUpProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export default function CountUp({ value, duration, suffix = "", className }: CountUpProps) {
  const animated = useCountUp(value, duration)
  return (
    <span className={className}>
      {animated}
      {suffix}
    </span>
  )
}
