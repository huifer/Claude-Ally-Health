export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-macos-bg-secondary rounded"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-macos-bg-card border border-macos-border rounded-2xl">
      <LoadingSkeleton className="w-1/3 mb-4" />
      <LoadingSkeleton className="w-2/3 mb-2" />
      <LoadingSkeleton className="w-1/2" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 bg-macos-bg-card border border-macos-border rounded-lg">
          <div className="flex items-center space-x-4">
            <LoadingSkeleton className="w-1/4" />
            <LoadingSkeleton className="w-1/3" />
            <LoadingSkeleton className="flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
