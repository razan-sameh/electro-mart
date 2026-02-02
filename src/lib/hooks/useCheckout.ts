import { typCartItem, typShippingAddress } from "@/content/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmOrder,
  createOrder,
  getCheckoutStep,
  updateShipping,
} from "../services/checkOut";
import { useCallback } from "react";

export function useUpdateShipping() {
  return useMutation({
    mutationFn: ({
      items,
      shippingAddress,
      phone,
      orderId,
    }: {
      items: typCartItem[];
      shippingAddress: typShippingAddress;
      phone: string;
      orderId?: number | null;
    }) => updateShipping(items, shippingAddress, phone, orderId),
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: ({
      items,
      orderId,
    }: {
      items: typCartItem[];
      orderId?: number | null;
    }) => createOrder(items, orderId),
  });
}

export function useConfirmOrder() {
  return useMutation({
    mutationFn: (orderId: number) => confirmOrder(orderId),
  });
}

export function useCheckoutStep(orderId: number) {
  const queryFn = useCallback(() => getCheckoutStep(orderId), []);
  return useQuery({
    queryKey: ["checkoutStep", orderId],
    queryFn,
    retry: 1, // 👈 Avoid infinite retry loops
    staleTime: Infinity,
  });
}
