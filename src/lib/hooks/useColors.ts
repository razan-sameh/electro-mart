import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { fetchColors } from "../services/colors";

export function useColors() {
  const locale = useLocale();

  const queryFn = useCallback(() => fetchColors(locale), [locale]);

  return useSuspenseQuery({
    queryKey: ["product-colors", locale],
    queryFn,
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
