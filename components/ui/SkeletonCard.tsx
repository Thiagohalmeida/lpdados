// components/ui/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
      <div className="h-16 bg-gray-100 rounded mb-4"></div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-gray-200 rounded-xl"></div>
        <div className="h-10 w-20 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonCardSmall() {
  return (
    <div className="rounded-xl border bg-white shadow-md p-4 animate-pulse">
      <div className="h-4 w-16 bg-gray-200 rounded-full mb-3"></div>
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-12 bg-gray-100 rounded mb-3"></div>
      <div className="h-8 w-20 bg-gray-200 rounded"></div>
    </div>
  );
}
