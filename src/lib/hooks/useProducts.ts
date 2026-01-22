import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  // getMaxPrice,
  // getMinPrice,
  fetchProducts,
  fetchProductById,
  fetchSimilarProducts,
  fetchProductsByCategoryName,
  fetchSidebarFilters,
} from "../services/products";
import { useLocale } from "next-intl";
import { typProductFilters } from "@/content/types";
import { useSearchParams } from "next/navigation";

export function getFiltersFromUrl(
  searchParams: URLSearchParams
): typProductFilters {
  return {
    categoryId: Number(searchParams.get("categoryId")) || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    
    attributes: searchParams
      .get("attributes")
      ?.split(",")
      .map((s) => {
        const [attribute_id, value_id] = s.split(":").map(Number);
        return { attribute_id, value_id };
      })
      .filter(
        (s): s is { attribute_id: number; value_id: number } =>
          s.attribute_id != null && s.value_id != null
      ) || [],

    brandIds:
      searchParams
        .get("brandsId")
        ?.split(",")
        .map(Number)
        .filter((id) => !isNaN(id)) || [],

    specs:
      searchParams
        .get("specs")
        ?.split(",")
        .map((s) => {
          const [spec_id, value_id] = s.split(":").map(Number);
          return { spec_id, value_id };
        })
        .filter(
          (s): s is { spec_id: number; value_id: number } =>
            s.spec_id != null && s.value_id != null
        ) || [],

    hasOffer: searchParams.get("specialOffer") === "true" ? true : undefined,
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
    queryKey: productsQueryKey(filters, searchQuery, page, pageSize, locale),
    queryFn: () => fetchProducts(locale, filters, searchQuery!, pageSize, page),
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
        fetchProducts(locale, filters, searchQuery!, pageSize, page),
      retry: 1,
      staleTime: Infinity,
    });
  };
}

export const useSpecialOffers = (limit?: number) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["specialOffers", limit, locale],
    queryFn: () => fetchProducts(locale, { hasOffer: true }, undefined, limit),
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
};

export function useProductsById(productId: number) {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["product", productId, locale],
    queryFn: () => fetchProductById(productId, locale), // filters: specialOffer only
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
}

export function useFilters() {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["filters", locale],
    queryFn: () => fetchSidebarFilters(locale), // filters: specialOffer only
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
}

export const useSimilarProducts = (
  productId: number,
  categoryId: number,
) => {
  const locale = useLocale();

  return useSuspenseQuery({
    queryKey: ["similar-products", productId, categoryId, locale],
    queryFn: () => fetchSimilarProducts(locale, productId, categoryId),
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
