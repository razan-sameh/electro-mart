"use client";

export default function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center p-3 bg-lightGray/20 border border-lightGray/20 rounded-md animate-pulse">
      {/* Image placeholder */}
      <div className="w-12 h-12 bg-gray-300 rounded-full mb-2" />

      {/* Text placeholder */}
      <div className="h-3 w-16 bg-gray-200 rounded" />
    </div>
  );
}
