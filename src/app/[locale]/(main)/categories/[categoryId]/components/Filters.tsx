"use client";
import { useCategoryWithSpecs } from "@/lib/hooks/useCategories";
import { useColors } from "@/lib/hooks/useColors";

export default function Filters({ categoryID }: { categoryID: string }) {
  const { data: colors } = useColors();
  const { data: catwithspecs } = useCategoryWithSpecs(categoryID!);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-lightGray/20">
      {/* Color */}
      <div className="mb-5">
        <h3 className="font-medium mb-2">Color</h3>
        <div className="flex gap-2">
          {colors?.map((color) => (
            <div
              key={color.id}
              className="w-6 h-6 rounded-full border-2 border-lightGray/20 cursor-pointer"
              style={{ backgroundColor: color.hexCode }}
              title={color.name}
            />
          ))}
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

      {/* Dynamic Specifications */}
      {catwithspecs?.specificationTypes?.map((specType) => (
        <div key={specType.id} className="mb-5">
          <h3 className="font-medium mb-2">{specType.name}</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            {specType.specificationValues?.map((val) => (
              <label key={val.id} className="flex items-center gap-2">
                <input type="checkbox" value={val.id} />
                {val.name}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
