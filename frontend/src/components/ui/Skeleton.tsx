'use client';

export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton rounded ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-8">
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="w-64 h-64 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}



