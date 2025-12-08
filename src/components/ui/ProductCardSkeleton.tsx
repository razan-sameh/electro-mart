"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-lightGray/20 rounded-lg shadow w-full animate-pulse">
      {/* Image Placeholder */}
      <div className="relative">
        <div className="w-full h-36 bg-gray-200 rounded-t-lg" />

        {/* Discount badge */}
        <div className="absolute top-2 left-0 w-16 h-5 bg-gray-300 rounded-e-sm" />
      </div>

      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-3 w-3/4 bg-gray-200 rounded" />

        {/* Price */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-10 bg-gray-200 rounded" />
        </div>

        {/* Rating */}
        <div className="flex justify-end items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
