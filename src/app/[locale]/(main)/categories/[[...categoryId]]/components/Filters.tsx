"use client";
import {
  useState,
  useMemo,
  useTransition,
  useEffect,
  startTransition,
} from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useFilters } from "@/lib/hooks/useProducts";
import { typProductAttribute } from "@/content/types";
import * as Slider from "@radix-ui/react-slider";

interface FiltersProps {
  isMobile?: boolean;
}

export default function Filters({ isMobile = false }: FiltersProps) {
  const { data: filters } = useFilters();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Separate state for different filter types
  const selectedMinPrice = searchParams.get("minPrice");
  const selectedMaxPrice = searchParams.get("maxPrice");
  const selectedColors = searchParams.get("attributes")?.split(",") || [];
  const selectedSpecs = searchParams.get("specs")?.split(",") || [];
  const selectedBrands = searchParams.get("brandsId")?.split(",") || [];
  const selectedOffer = searchParams.get("specialOffer") === "true";

  const t = useTranslations("Filters");

  /* ================= PRICE STATE ================= */
  const minPrice = filters.price_range.min;
  const maxPrice = filters.price_range.max;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    selectedMinPrice ? Number(selectedMinPrice) : minPrice,
    selectedMaxPrice ? Number(selectedMaxPrice) : maxPrice,
  ]);

  // Memoize sets for better performance
  const selectedColorsSet = useMemo(
    () => new Set(selectedColors),
    [selectedColors]
  );
  const selectedSpecsSet = useMemo(
    () => new Set(selectedSpecs),
    [selectedSpecs]
  );
  const selectedBrandsSet = useMemo(
    () => new Set(selectedBrands),
    [selectedBrands]
  );

  /* ================= PRICE DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePriceRange(priceRange[0], priceRange[1]);
    }, 500);

    return () => clearTimeout(timer);
  }, [priceRange]);

  function updatePriceRange(min: number, max: number) {
    const params = new URLSearchParams(searchParams.toString());

    const isDefault =
      min === filters.price_range.min && max === filters.price_range.max;

    if (isDefault) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", min.toString());
      params.set("maxPrice", max.toString());
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Helper to update URL with transition
  function updateParam(key: string, value: string | string[] | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      value.length ? params.set(key, value.join(",")) : params.delete(key);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Optimized toggle handlers
  const toggleAttribute = (attributeParam: string) => {
    const newColors = new Set(selectedColorsSet);
    if (newColors.has(attributeParam)) {
      newColors.delete(attributeParam);
    } else {
      newColors.add(attributeParam);
    }
    updateParam("attributes", Array.from(newColors));
  };

  const toggleSpec = (specParam: string) => {
    const newSpecs = new Set(selectedSpecsSet);
    if (newSpecs.has(specParam)) {
      newSpecs.delete(specParam);
    } else {
      newSpecs.add(specParam);
    }
    updateParam("specs", Array.from(newSpecs));
  };

  const toggleBrand = (brandId: string) => {
    const newBrands = new Set(selectedBrandsSet);
    if (newBrands.has(brandId)) {
      newBrands.delete(brandId);
    } else {
      newBrands.add(brandId);
    }
    updateParam("brandsId", Array.from(newBrands));
  };

  const clearAllFilters = () => {
    startTransition(() => router.push(pathname));
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <div
      className={`bg-background ${
        !isMobile && "p-4 rounded-xl shadow-sm border border-lightGray/20"
      } `}
    >
      <div className="mb-5 flex justify-end">
        <button
          onClick={clearAllFilters}
          className="bg-lightGray/40 px-3 py-1 rounded hover:bg-lightGray/60 cursor-pointer disabled:opacity-50"
        >
          {t("clearFilters")}
        </button>
      </div>

      {/* Attributes */}
      {filters?.attributes.length > 0 && (
        <>
          {/* Colors first */}
          {filters.attributes
            .filter(
              (attr: typProductAttribute) =>
                attr.attribute.toLowerCase() === "color"
            )
            .map((attr: any) => (
              <div key={`color-${attr.attribute_id}`} className="mb-5">
                <h3 className="text-xl mb-2">{attr.attribute}</h3>
                <div className="flex flex-wrap gap-2">
                  {attr.values.map((val: any) => {
                    const attributeParam = `${attr.attribute_id}:${val.id}`;
                    const selected = selectedColorsSet.has(attributeParam);
                    return (
                      <div
                        key={`color-value-${val.id}`}
                        onClick={() => toggleAttribute(attributeParam)}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform ${
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

          {/* Other attributes */}
          {filters.attributes
            .filter((attr: any) => attr.attribute.toLowerCase() !== "color")
            .map((attr: any) => (
              <div key={`attr-${attr.attribute_id}`} className="mb-5">
                <h3 className="text-xl mb-2">{attr.attribute}</h3>
                <div className="flex flex-col gap-2 text-sm">
                  {attr.values.map((val: any) => {
                    const attributeParam = `${attr.attribute_id}:${val.id}`;
                    const selected = selectedColorsSet.has(attributeParam);
                    return (
                      <label
                        key={`attr-value-${val.id}`}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleAttribute(attributeParam)}
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
      {minPrice !== maxPrice && (
        <div className="mb-6">
          <h3 className="text-xl mb-2">{t("price")}</h3>

          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>E£{priceRange[0]}</span>
            <span>E£{priceRange[1]}</span>
          </div>

          <Slider.Root
            min={minPrice}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as [number, number])}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="bg-lightGray/40 relative grow rounded-full h-1">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-primary border border-primary rounded-full shadow cursor-pointer pointer-events-auto focus:outline-none" />
            <Slider.Thumb className="block w-4 h-4 bg-primary border border-primary rounded-full shadow cursor-pointer pointer-events-auto focus:outline-none" />
          </Slider.Root>
        </div>
      )}

      {/* Offer */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-xl cursor-pointer">
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
      {filters?.brands && filters.brands.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-xl">{t("brands")}</h3>
          <div className="flex flex-col gap-2 text-sm">
            {filters.brands.map((val: any) => {
              const brandId = val.id.toString();
              const checked = selectedBrandsSet.has(brandId);
              return (
                <label
                  key={val.id}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brandId)}
                  />
                  {val.name}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Specs */}
      {filters?.specs?.map((spec: any) => (
        <div key={spec.id} className="mb-5">
          <h3 className="text-xl mb-2">{spec.spec}</h3>
          <div className="flex flex-col gap-2 text-sm">
            {spec.values.map((val: any) => {
              const specParam = `${spec.id}:${val.id}`;
              const checked = selectedSpecsSet.has(specParam);

              return (
                <label
                  key={val.id}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSpec(specParam)}
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
