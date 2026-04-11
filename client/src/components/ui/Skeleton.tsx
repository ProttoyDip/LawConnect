export const Skeleton = ({
  className = '',
}: { className?: string }) => (
  <div
    className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
  />
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

