"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useFilters } from "@/lib/hooks/useProducts";
import { typProductAttribute } from "@/content/types";

interface FiltersProps {
  isMobile?: boolean;
}

export default function Filters({ isMobile = false }: FiltersProps) {
  const { data: filters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedPrice = searchParams.get("price");
  const selectedColors = searchParams.get("attributes")?.split(",") || [];
  const selectedSpecs = searchParams.get("specs")?.split(",") || [];
  const selectedBrands = searchParams.get("brandsId")?.split(",") || [];
  const selectedOffer = searchParams.get("specialOffer") === "true";
  const t = useTranslations("Filters");
  const [tempPrice, setTempPrice] = useState(
    selectedPrice ? Number(selectedPrice) : filters.price_range.max
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
      className={`bg-background ${
        !isMobile && "p-4 rounded-xl shadow-sm border border-lightGray/20"
      }`}
    >
      <div className="mb-5 flex justify-end">
        <button
          onClick={() => {
            router.push(pathname);
            setTempPrice(filters.price_range.max);
          }}
          className="bg-lightGray/40 px-3 py-1 rounded hover:bg-lightGray/60 cursor-pointer"
        >
          {t("clearFilters")}
        </button>
      </div>

      {/* Attributes */}
      {filters?.attributes.length > 0 && (
        <>
          {/* 1️⃣ Colors first */}
          {filters.attributes
            .filter(
              (attr: typProductAttribute) =>
                attr.attribute.toLowerCase() === "color"
            )
            .map((attr: any) => (
              <div key={`color-${attr.attribute_id}`} className="mb-5">
                <h3 className="text-xl mb-2">{attr.attribute}</h3>
                <div className="flex flex-wrap gap-2">
                  {attr.values.map((val: typProductAttribute) => {
                    const attributeParam = `${attr.attribute_id}:${val.id}`;
                    const selected = selectedColors.includes(attributeParam);
                    return (
                      <div
                        key={`color-value-${val.id}`}
                        onClick={() => {
                          const newColors = new Set(selectedColors);
                          selected
                            ? newColors.delete(attributeParam)
                            : newColors.add(attributeParam);
                          updateParam("attributes", Array.from(newColors));
                        }}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                          selected
                            ? "border-blue-500 scale-110"
                            : "border-lightGray/20"
                        }`}
                        style={{ backgroundColor: val.hex_code }}
                        title={val.value}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

          {/* 2️⃣ Other attributes */}
          {filters.attributes
            .filter((attr: any) => attr.attribute.toLowerCase() !== "color")
            .map((attr: any) => (
              <div key={`attr-${attr.attribute_id}`} className="mb-5">
                <h3 className="text-xl mb-2">{attr.attribute}</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {attr.values.map((val: any) => {
                    const attributeParam = `${attr.attribute_id}:${val.id}`;
                    const selected = selectedColors.includes(attributeParam); // may want a separate state for non-color attrs
                    return (
                      <label
                        key={`attr-value-${val.id}`}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {
                            const newValues = new Set(selectedColors); // separate state recommended
                            selected
                              ? newValues.delete(attributeParam)
                              : newValues.add(attributeParam);
                            updateParam("attributes", Array.from(newValues));
                          }}
                        />
                        {val.value}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
        </>
      )}

      {/* Price */}
      {filters.price_range.min != filters.price_range.max && (
        <div className="mb-5">
          <h3 className="text-xl mb-2">{t("price")}</h3>
          <div className="flex text-sm text-gray-500 mt-1">
            <span className="text-icon">
              E£{filters.price_range.min} - E£{tempPrice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={filters.price_range.min}
              max={filters.price_range.max}
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

      {/* Offer */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-xl">
          <input
            type="checkbox"
            checked={selectedOffer}
            onChange={(e) =>
              updateParam("specialOffer", e.target.checked ? "true" : null)
            }
          />
          {t("specialOffers")}
        </label>
      </div>

      {/* Brands */}
      <div className="mb-5">
        <h3 className="mb-2 text-xl">{t("brands")}</h3>
        <div className="flex flex-col gap-2 text-sm">
          {filters?.brands.map((val: any) => {
            const checked = selectedBrands.includes(val.id.toString());
            return (
              <label key={val.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const newBrands = new Set(selectedBrands);
                    checked
                      ? newBrands.delete(val.id.toString())
                      : newBrands.add(val.id.toString());
                    updateParam("brandsId", Array.from(newBrands));
                  }}
                />
                {val.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* Specs */}
      {filters?.specs.map((spec: any) => (
        <div key={spec.id} className="mb-5">
          <h3 className="text-xl mb-2">{spec.spec}</h3>

          <div className="flex flex-col gap-2 text-sm">
            {spec.values.map((val: any) => {
              const specParam = `${spec.id}:${val.id}`;
              const checked = selectedSpecs.includes(specParam);

              return (
                <label key={val.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const newSpecs = new Set(selectedSpecs);

                      checked
                        ? newSpecs.delete(specParam)
                        : newSpecs.add(specParam);

                      updateParam("specs", Array.from(newSpecs));
                    }}
                  />
                  {val.value}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
