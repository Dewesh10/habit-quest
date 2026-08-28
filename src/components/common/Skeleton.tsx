interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-800/60 rounded-md animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonPanel({ className = "" }: SkeletonProps) {
  return (
    <div className={`system-panel p-4 ${className}`} aria-hidden="true">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-8 w-full mb-2" />
      <Skeleton className="h-2 w-full" />
    </div>
  )
}
