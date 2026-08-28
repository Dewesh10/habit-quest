import { Skeleton } from "../common/Skeleton"

export default function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-64 mb-6" />

      <div className="system-panel p-6 mb-6">
        <Skeleton className="h-3 w-28 mb-3" />
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-2 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      <div className="system-panel p-4 mb-6">
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>

      <div className="system-panel p-4 mb-6">
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-2 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="system-panel p-4">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="system-panel p-4">
          <Skeleton className="h-3 w-28 mb-3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <div className="system-panel overflow-hidden">
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}
