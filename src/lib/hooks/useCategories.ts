import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { fetchCategories } from "../services/categories";

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
