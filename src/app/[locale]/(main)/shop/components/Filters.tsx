"use client";

export default function Filters() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-3">Filters</h2>

      {/* Color */}
      <div className="mb-5">
        <h3 className="font-medium mb-2">Color</h3>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-black border cursor-pointer" />
          <div className="w-6 h-6 rounded-full bg-gray-400 border cursor-pointer" />
          <div className="w-6 h-6 rounded-full bg-white border cursor-pointer" />
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <h3 className="font-medium mb-2">Price</h3>
        <input type="range" min="300" max="7000" className="w-full" />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>€300</span>
          <span>€7000</span>
        </div>
      </div>

      {/* Classification */}
      <div className="mb-5">
        <h3 className="font-medium mb-2">Classification</h3>
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          <label><input type="checkbox" /> For video editing</label>
          <label><input type="checkbox" /> For gaming</label>
          <label><input type="checkbox" /> Industrial use</label>
        </div>
      </div>
    </div>
  );
}
