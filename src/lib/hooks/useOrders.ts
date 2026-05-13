// lib/hooks/useOrders.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchOrderById, fetchOrders } from "../services/orders";
import { typOrder } from "@/content/types";
import { enmOrderStatus } from "@/content/enums";

export function useOrders(page = 1, pageSize = 10, status?: enmOrderStatus) {
  const locale = useLocale();

  return useQuery({
    queryKey: ["orders", locale, page, pageSize, status],
    queryFn: () => fetchOrders(locale, page, pageSize, status),
    retry: 1, // 👈 Avoid infinite retry loops
  });
}

export function usePrefetchOrder() {
  const queryClient = useQueryClient();

  const prefetch = (orderId: number, locale: string) => {
    queryClient.prefetchQuery({
      queryKey: ["order", orderId, locale],
      queryFn: () => fetchOrderById(locale, orderId),
      retry: 1, // 👈 Avoid infinite retry loops
    });
  };

  return prefetch;
}

export function useOrderById(orderId: number) {  
  const locale = useLocale();
  return useQuery({
    queryKey: ["order", orderId, locale],
    queryFn: () => fetchOrderById(locale, orderId),
    retry: 1,
    enabled: !!orderId, 
  });
}
