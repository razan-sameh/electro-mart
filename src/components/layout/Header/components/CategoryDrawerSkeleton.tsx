"use client";

export default function CategoryDrawerSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      {/* Icon placeholder */}
      <div className="w-5 h-5 bg-gray-300 rounded-full" />

      {/* Text placeholder */}
      <div className="h-3 w-32 bg-gray-200 rounded" />
    </div>
  );
}
