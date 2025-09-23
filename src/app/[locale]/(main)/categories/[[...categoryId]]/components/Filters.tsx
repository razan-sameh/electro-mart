"use client";
import { typProductFilters, typSpecificationType } from "@/content/types";
import { useCategoryWithSpecs } from "@/lib/hooks/useCategories";
import { useColors } from "@/lib/hooks/useColors";
import { useState, useEffect } from "react";

interface FiltersProps {
  specificationTypes: typSpecificationType[];
  filters: typProductFilters;
  dispatch: React.Dispatch<any>;
  minPrice: number;
  maxPrice: number;
  showPriceFilter: boolean;
}

export default function Filters({
  specificationTypes,
  filters,
  dispatch,
  minPrice,
  maxPrice,
  showPriceFilter,
}: FiltersProps) {
  const { data: colors } = useColors();
  // const { data: catwithspecs } = useCategoryWithSpecs(categoryID!);
  const [tempPrice, setTempPrice] = useState(maxPrice);

  // Update tempPrice when maxPrice changes or when filters.price changes
  useEffect(() => {
    if (filters.price) {
      // If we have an active price filter, use it
      setTempPrice(filters.price);
    } else {
      // Otherwise use maxPrice
      setTempPrice(maxPrice);
    }
  }, [maxPrice, filters.price]);
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-lightGray/20">
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => dispatch({ type: "CLEAR" })}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Color */}
      <div className="mb-5">
        <h3 className="font-medium mb-2">Color</h3>
        <div className="flex gap-2 flex-wrap">
          {colors?.map((color) => {
            const selected = filters.colorsId?.includes(color.id);
            return (
              <div
                key={color.id}
                onClick={() => dispatch({ type: "SET_COLOR", payload: color.id })}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  selected ? "border-blue-500 scale-110" : "border-lightGray/20"
                }`}
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
            );
          })}
        </div>
      </div>

      {/* Price */}
      {showPriceFilter && (
        <div className="mb-5">
          <h3 className="font-medium mb-2">Price</h3>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={tempPrice}
              onChange={(e) => setTempPrice(Number(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => dispatch({ type: "SET_PRICE", payload: tempPrice })}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Go
            </button>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>€{minPrice}</span>
            <span>€{tempPrice}</span>
            <span>€{maxPrice}</span>
          </div>
        </div>
      )}

      {/* Dynamic Specs */}
      {specificationTypes?.map((specType) => (
        <div key={specType.id} className="mb-5">
          <h3 className="font-medium mb-2">{specType.name}</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {specType.specificationValues?.map((val) => (
              <label key={val.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={val.id}
                  checked={filters.specificationValuesId?.includes(val.id) || false}
                  onChange={() => dispatch({ type: "SET_SPEC", payload: val.id })}
                />
                {val.name}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
