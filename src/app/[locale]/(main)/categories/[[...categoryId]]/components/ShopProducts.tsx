// components/ShopProducts.tsx
"use client";
import ProductCard from "@/components/reusable/ProductCard";
import { typProduct } from "@/content/types";
import { useCategoryById } from "@/lib/hooks/useCategories";
import {
  getFiltersFromUrl,
  usePrefetchProducts,
  useProducts,
} from "@/lib/hooks/useProducts";
import Pagination from "../../../../../../components/reusable/Pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ShopProductsProps {
  categoryId?: number;
}
export default function ShopProducts({ categoryId }: ShopProductsProps) {
  const [paginate, setPaginate] = useState(1);
  const pageSize = 18;
  const { data: category } = useCategoryById(categoryId!);
  const { data: productsWithMeta } = useProducts(
    categoryId!,
    paginate,
    pageSize
  );
  const products = productsWithMeta?.data || [];
  const meta = productsWithMeta?.meta;
  const prefetchProducts = usePrefetchProducts();
  const searchParams = useSearchParams();
  const filtersKeyString = JSON.stringify(getFiltersFromUrl(searchParams));
  const searchQuery = searchParams.get("q") || undefined;
  
  useEffect(() => {    
    setPaginate(1);
  }, [categoryId, searchQuery, filtersKeyString]);

  // prefetch next page
  useEffect(() => {
    if (meta?.total && paginate < Math.ceil(meta.total / pageSize)) {
      prefetchProducts(paginate + 1, pageSize, categoryId);
    }
  }, [paginate, categoryId, pageSize]);

  return (
    <main className="flex-1 flex flex-col min-h-screen">
      {category && (
        <h1 className="text-2xl font-semibold mb-4">
          {category.name || "All Products"}
        </h1>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products?.map((item: typProduct) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>

      {/* Push pagination to the bottom */}
      <div className="mt-auto">
        {meta?.total > pageSize && (
          <Pagination
            setPaginate={setPaginate}
            currentPage={paginate}
            pageSize={pageSize}
            itemsLength={meta?.total || 0}
          />
        )}
      </div>
    </main>
  );
}
