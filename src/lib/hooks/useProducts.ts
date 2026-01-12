import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  getMaxPrice,
  getMinPrice,
  fetchProducts,
  fetchProductById,
  fetchSimilarProducts,
  fetchProductsByCategoryName,
} from "../services/products";
import { useLocale } from "next-intl";
import { typProduct, typProductFilters } from "@/content/types";
import { useSearchParams } from "next/navigation";

export function getFiltersFromUrl(searchParams: URLSearchParams): typProductFilters {
  return {
    categoryId: Number(searchParams.get("categoryId")) || undefined,
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
export const productsQueryKey = (
  filters: typProductFilters,
  search: string | undefined,
  page: number,
  pageSize: number,
  locale: string
) => ["products", filters, search, page, pageSize, locale];

export const useProducts = (
  categoryId?: number,
  page: number = 1,
  pageSize: number = 9
) => {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const filters = getFiltersFromUrl(searchParams);
  filters.categoryId = categoryId; // merge path + query
  const searchQuery = searchParams.get("q") || undefined;

  return useSuspenseQuery({
    queryKey: productsQueryKey(filters, searchQuery, page, pageSize, locale), // React Query automatically serializes the filters object
    queryFn: () =>
      fetchProducts(locale, filters, searchQuery, undefined, page, pageSize),
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
};

export function usePrefetchProducts() {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const searchParams = useSearchParams();

  return (page: number, pageSize: number, categoryId?: number) => {
    const filters = getFiltersFromUrl(searchParams);
    filters.categoryId = categoryId;
    const searchQuery = searchParams.get("q") || undefined;
    queryClient.prefetchQuery({
      queryKey: productsQueryKey(filters, searchQuery, page, pageSize, locale),
      queryFn: () =>
        fetchProducts(locale, filters, searchQuery, undefined, page, pageSize),
      retry: 1,
      staleTime: Infinity,
    });
  };
}

export const useSpecialOffers = (limit?: number) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["specialOffers", limit, locale],
    queryFn: () =>
      fetchProducts(locale, { specialOffer: true }, undefined, limit), // filters: specialOffer only
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
};

export const usePriceRange = (categoryId?: number) => {
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
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
};

export function useProductsById(productId: string) {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["product", productId, locale],
    queryFn: () => fetchProductById(locale, productId), // filters: specialOffer only
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
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
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
};

export const useAccessoriesProducts = (limit: number = 5) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["accessories-products", limit, locale],
    queryFn: () => fetchProductsByCategoryName(locale, "Accessories", limit),
    retry: 1,
    staleTime: Infinity,
  });
};
