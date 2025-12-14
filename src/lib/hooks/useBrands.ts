import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { fetchBrands } from "../services/brands";

export function useBrands() {
  const locale = useLocale();

  const queryFn = useCallback(() => fetchBrands(locale), [locale]);

  return useSuspenseQuery({
    queryKey: ["brands", locale],
    queryFn,
    retry: 1, // 👈 Avoid infinite retry loops
  });
}
