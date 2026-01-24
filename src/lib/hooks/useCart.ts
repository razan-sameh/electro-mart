"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/lib/services/cart";
import type { typCart, typCartItem } from "@/content/types";
import { useLocale } from "next-intl";

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  const cartQuery = useQuery<typCart>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const data: typCart = await fetchCart(locale);
      return data ?? { id: 0, items: [] };
    },
    retry: 1,
    staleTime: Infinity,
  });

  // ➕ Add item
  const addMutation = useMutation({
    mutationFn: ({
      variantId,
      quantity,
    }: {
      variantId: number;
      quantity: number;
    }) => addCartItem(variantId, quantity),

    onMutate: async ({ variantId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<typCart>(CART_QUERY_KEY);

      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        const exists = old.items.find((i) => i.variant?.id === variantId);
        if (exists) {
          return {
            ...old,
            items: old.items.map((i) =>
              i.variant?.id === variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          };
        }

        return {
          ...old,
          items: [
            ...old.items,
            {
              id: Date.now(),
              variant: { id: variantId } as any,
              quantity,
              unitPrice: 0,
              totalPrice: 0,
              product: {} as any,
            } as any,
          ],
        };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(CART_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 🔄 Update quantity
  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, quantity),

    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<typCart>(CART_QUERY_KEY);

      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 🗑️ Remove item
  const removeMutation = useMutation({
    mutationFn: (variantId: number) => removeCartItem(variantId),

    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<typCart>(CART_QUERY_KEY);

      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.filter((item) => item.variant?.id !== variantId),
        };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 🧹 Clear cart
  const clearMutation = useMutation({
    mutationFn: clearCart,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<typCart>(CART_QUERY_KEY);

      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;
        return { ...old, items: [] };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isFetching: cartQuery.isFetching,
    isError: cartQuery.isError,
    refetch: cartQuery.refetch,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    clearCart: clearMutation.mutateAsync,
  };
}
