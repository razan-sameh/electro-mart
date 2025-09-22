"use client";
import { useReducer, useEffect, useState } from "react";
import Filters from "./Filters";
import ShopProducts from "./ShopProducts";
import { useCategoryWithSpecs } from "@/lib/hooks/useCategories";
import { useProducts } from "@/lib/hooks/useProducts";
import { filtersReducer } from "./filtersReducer";

export default function ShopPageClient({ categoryId }: { categoryId: string }) {
  const [filters, dispatch] = useReducer(filtersReducer, { categoryId });
  const { data: products } = useProducts(filters);
  const { data: catwithspecs } = useCategoryWithSpecs(categoryId!);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  useEffect(() => {
    if (products?.length) {
      const prices = products.map((p) => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setShowPriceFilter(min !== max);
    } else {
      setShowPriceFilter(false);
    }
  }, [products]);

  return (
    <div className="flex gap-6 px-6 py-8">
      <aside className="w-64 shrink-0">
        <Filters
          categoryID={categoryId}
          filters={filters}
          dispatch={dispatch}
          minPrice={minPrice}
          maxPrice={maxPrice}
          showPriceFilter={showPriceFilter}
        />
      </aside>

      <ShopProducts categoryName={catwithspecs?.name} products={products} />
    </div>
  );
}
