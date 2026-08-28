import { Skeleton } from "../common/Skeleton"

export default function HabitsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading habits">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="system-panel p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1.5" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
