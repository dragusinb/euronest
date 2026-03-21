interface SkeletonProps {
  className?: string;
  lines?: number;
  type?: 'text' | 'card' | 'circle';
}

function SkeletonBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
}

export default function Skeleton({ className = '', lines = 3, type = 'text' }: SkeletonProps) {
  if (type === 'circle') {
    return (
      <div
        className={`animate-pulse rounded-full bg-gray-200 h-12 w-12 ${className}`}
      />
    );
  }

  if (type === 'card') {
    return (
      <div className={`animate-pulse rounded-xl border border-gray-100 overflow-hidden ${className}`}>
        <div className="bg-gray-200 h-40 w-full" />
        <div className="p-4 space-y-3">
          <SkeletonBar className="h-4 w-3/4" />
          <SkeletonBar className="h-3 w-full" />
          <SkeletonBar className="h-3 w-5/6" />
        </div>
      </div>
    );
  }

  // text type
  const widths = ['w-full', 'w-5/6', 'w-4/6', 'w-3/4', 'w-2/3'];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonBar
          key={i}
          className={`h-3.5 ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}
