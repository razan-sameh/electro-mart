"use client";
import { useColors } from "@/lib/hooks/useColors";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePriceRange } from "@/lib/hooks/useProducts";
import { useSpecification } from "@/lib/hooks/useSpecification";
import { useBrands } from "@/lib/hooks/useBrands";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

interface FiltersProps {
  categoryId?: string;
  isMobile?: boolean;
}
export default function Filters({
  categoryId,
  isMobile = false,
}: FiltersProps) {
  const { data: colors } = useColors();
  const { data: brands } = useBrands();
  const priceRangeQuery = usePriceRange(categoryId!);
  const specificationTypes = useSpecification(categoryId!);
  // Access min and max like this
  const minPrice = priceRangeQuery.data?.minPrice ?? 0;
  const maxPrice = priceRangeQuery.data?.maxPrice ?? 1000;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedPrice = searchParams.get("price");
  const selectedColors = searchParams.get("colorsId")?.split(",") || [];
  const selectedSpecs =
    searchParams.get("specificationValuesId")?.split(",") || [];
  const selectedBrands = searchParams.get("brandsId")?.split(",") || [];
  const selectedOffer = searchParams.get("specialOffer") === "true"; // check if URL has specialOffer
  const t = useTranslations("Filters");

  const [tempPrice, setTempPrice] = useState(
    selectedPrice ? Number(selectedPrice) : maxPrice
  );

  // helper to update URL
  function updateParam(key: string, value: string | string[] | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(","));
      else params.delete(key);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={`bg-background 
        ${!isMobile && "p-4 rounded-xl shadow-sm border border-lightGray/20"}
      `}
    >
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => router.push(pathname)} // clear all filters
          className="bg-lightGray/40 px-3 py-1 rounded hover:bg-lightGray/60 cursor-pointer"
        >
          {t("clearFilters")}
        </button>
      </div>

      {/* Color */}
      <div className="mb-5">
        <h3 className="text-xl mb-2">{t("color")}</h3>
        <div className="flex gap-2 flex-wrap">
          {colors?.map((color) => {
            const selected = selectedColors.includes(color.documentId);
            return (
              <div
                key={color.documentId}
                onClick={() => {
                  let newColors = new Set(selectedColors);
                  if (selected) newColors.delete(color.documentId);
                  else newColors.add(color.documentId);
                  updateParam("colorsId", Array.from(newColors));
                }}
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
      {minPrice != maxPrice && (
        <div className="mb-5">
          <h3 className="text-xl mb-2">{t("price")}</h3>
          <div className="flex text-sm text-gray-500 mt-1">
            <span className="text-icon">
              E£{minPrice} - E£{tempPrice}
            </span>
          </div>
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
              onClick={() => updateParam("price", tempPrice.toString())}
              className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 cursor-pointer"
            >
              {t("go")}
            </button>
          </div>
        </div>
      )}

      <div className="mb-5">
        <label className="flex items-center gap-2 text-xl ">
          <input
            type="checkbox"
            checked={selectedOffer}
            onChange={(e) => {
              updateParam("specialOffer", e.target.checked ? "true" : null);
            }}
          />
          {t("specialOffers")}
        </label>
      </div>

      <div className="mb-5">
        <h3 className="mb-2 text-xl">{t("brands")}</h3>
        <div className="flex flex-col gap-2 text-sm ">
          {brands?.map((val) => {
            const checked = selectedBrands.includes(val.id);
            return (
              <label key={val.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={val.id}
                  checked={checked}
                  onChange={() => {
                    let newBrands = new Set(selectedBrands);
                    if (checked) newBrands.delete(val.id);
                    else newBrands.add(val.id);
                    updateParam("brandsId", Array.from(newBrands));
                  }}
                />
                {val.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* Dynamic Specs */}
      {specificationTypes?.map((specType) => (
        <div key={specType.id} className="mb-5">
          <h3 className="text-xl mb-2">{specType.name}</h3>
          <div className="flex flex-col gap-2 text-sm">
            {specType.specificationValues?.map((val) => {
              const checked = selectedSpecs.includes(val.id);
              return (
                <label key={val.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={val.id}
                    checked={checked}
                    onChange={() => {
                      let newSpecs = new Set(selectedSpecs);
                      if (checked) newSpecs.delete(val.id);
                      else newSpecs.add(val.id);
                      updateParam(
                        "specificationValuesId",
                        Array.from(newSpecs)
                      );
                    }}
                  />
                  {val.name}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
