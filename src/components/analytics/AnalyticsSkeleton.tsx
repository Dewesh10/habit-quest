import { Skeleton } from "../common/Skeleton"

export default function AnalyticsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading analytics">
      <Skeleton className="h-7 w-40 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="system-panel p-4">
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-2 w-20 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
        <div className="system-panel p-4 lg:col-span-2">
          <Skeleton className="h-3 w-32 mb-1" />
          <Skeleton className="h-2 w-20 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
