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
  });
}
