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

  const prefetch = (orderId: string, locale: string) => {
    queryClient.prefetchQuery({
      queryKey: ["order", orderId, locale],
      queryFn: () => fetchOrderById(locale, orderId),
      retry: 1, // 👈 Avoid infinite retry loops
    });
  };

  return prefetch;
}

export function useOrder(orderId: string) {
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["order", orderId, locale],
    queryFn: async () => {
      // Try to get from cached orders first
      const cachedOrders = queryClient.getQueryData<any>([
        "orders",
        locale,
        1,
        10,
      ]);
      const cachedOrder: typOrder = cachedOrders?.orders?.find(
        (o: any) => o.id === orderId
      );
      if (cachedOrder) return cachedOrder;

      // Otherwise fetch from API
      return await fetchOrderById(locale, orderId);
    },
    retry: 1, // 👈 Avoid infinite retry loops
  });
}
