import { useSuspenseQuery } from "@tanstack/react-query";
import { getMaxPrice, getMinPrice, fetchProducts, fetchProductById, fetchSimilarProducts } from "../services/products";
import { useLocale } from "next-intl";
import { typProductFilters } from "@/content/types";
import { useSearchParams } from "next/navigation";

function getFiltersFromUrl(searchParams: URLSearchParams): typProductFilters {
  return {
    categoryId: searchParams.get("categoryId") || undefined,
    colorsId: searchParams.get("colorsId")?.split(",") || [],
    brandsId: searchParams.get("brandsId")?.split(",") || [],
    specificationValuesId:
      searchParams.get("specificationValuesId")?.split(",") || [],
    price: searchParams.get("price")
      ? Number(searchParams.get("price"))
      : undefined,
    specialOffer:
      searchParams.get("specialOffer") === "true" ? true : undefined,
  };
}
export const useProducts = (categoryId?: string, page: number = 1, pageSize: number = 9) => {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const filters = getFiltersFromUrl(searchParams);
  filters.categoryId = categoryId; // merge path + query
  const searchQuery = searchParams.get("q") || undefined;
  return useSuspenseQuery({
    queryKey: ["products", filters, searchQuery, page, pageSize, locale], // React Query automatically serializes the filters object
    queryFn: () => fetchProducts(locale, filters, searchQuery, undefined,page, pageSize),
    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSpecialOffers = (limit?: number) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["specialOffers", limit, locale],
    queryFn: () =>
      fetchProducts(locale, { specialOffer: true }, undefined, limit), // filters: specialOffer only
  });
};

export const usePriceRange = (categoryId?: string) => {
  const locale = useLocale();
  return useSuspenseQuery({
    queryKey: ["price-range", categoryId, locale],
    queryFn: async () => {
      const [minPrice, maxPrice] = await Promise.all([
        getMinPrice(locale, categoryId),
        getMaxPrice(locale, categoryId),
      ]);

      return { minPrice, maxPrice };
    },
  });
};

export function useProductsById(productId:string) {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["product", locale,productId],
    queryFn:() =>
      fetchProductById(locale, productId), // filters: specialOffer only
  });
}

export const useSimilarProducts = (
  productId: string,
  categoryId: string,
  brandId?: string
) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["similar-products", productId, categoryId, brandId, locale],
    queryFn: () => fetchSimilarProducts(locale, productId, categoryId, brandId),
  });
};
