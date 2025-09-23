import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { fetchCategories, fetchCategoryById } from "../services/categories";

export function useCategories() {
  const locale = useLocale();

  const queryFn = useCallback(() => fetchCategories(locale), [locale]);

  return useSuspenseQuery({
    queryKey: ["categories", locale],
    queryFn,
    // staleTime: 1000 * 60 * 60, // 1 hour - perfect for categories
    // gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useCategoryById(categoryId?:string) {
  const locale = useLocale();
  return useQuery({
    queryKey: categoryId
      ? ["category", categoryId, locale]
      : ["category-inactive"], // Different key that never fetches
    queryFn: categoryId
      ? () => fetchCategoryById(categoryId, locale)
      : () => Promise.resolve(null), // Never actually called due to enabled
    enabled: !!categoryId,
  });
}