import { typCartItem, typShippingAddress } from "@/content/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmOrder,
  createOrder,
  getCheckoutStep,
  getDraftOrderId,
  updateShipping,
} from "../services/checkOut";

export function useUpdateShipping() {
  const queryClient = useQueryClient();

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
    onSuccess: (orderIdDB) => {      
      queryClient.invalidateQueries({ queryKey: ["checkoutStep", orderIdDB] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      items,
      orderId,
    }: {
      items: typCartItem[];
      orderId?: number;
    }) => createOrder(items, orderId),
    onSuccess: (newOrderId) => {
      // ✅ Update draftOrderId cache
      queryClient.setQueryData<number | null>(["draftOrderId"], newOrderId);

      // ✅ Invalidate checkoutStep for the new order
      queryClient.invalidateQueries({ queryKey: ["checkoutStep", newOrderId] });
    },
  });
}

export function useConfirmOrder() {
  return useMutation({
    mutationFn: (orderId: number) => confirmOrder(orderId),
  });
}

export function useCheckoutStep(orderId?: number | null) {
  return useQuery<number>({
    queryKey: ["checkoutStep", orderId],
    queryFn: () => getCheckoutStep(orderId!),
    enabled: !!orderId, // ✅ only fetch if orderId exists
    staleTime: Infinity,
    retry: 1,
  });
}

export function useDraftOrderId() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["draftOrderId"],
    queryFn: getDraftOrderId,
    retry: 1,
    initialData: () =>
      queryClient.getQueryData<number | null>(["draftOrderId"]),
    staleTime: Infinity,
  });
}
