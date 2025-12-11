"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
    </div>
  );
}
