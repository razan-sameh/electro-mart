// lib/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { fetchOrders } from "../services/orders";

export function useOrders(page = 1, pageSize = 10) {
  const locale = useLocale();

  const queryFn = useCallback(
    () => fetchOrders(locale, page, pageSize),
    [locale, page, pageSize]
  );

  return useQuery({
    queryKey: ["orders", locale, page, pageSize],
    queryFn,
  });
}
