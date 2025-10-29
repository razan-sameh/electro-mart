"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} from "@/lib/services/cart";
import type { typCart, typColor, typProduct } from "@/content/types";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "./useAuth";

type MergeCartInput = {
  product: typProduct;
  quantity: number;
  selectedColor: typColor;
};

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // 🧾 Fetch cart
  const cartQuery = useQuery<typCart>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const data: typCart = await fetchCart();
      // Normalize: ensure we always return a typCart object
      return data ?? { id: "empty", items: [] };
    },
    enabled: !!isAuthenticated,
  });

  // 🔄 Merge local → server
  const mergeMutation = useMutation({
    mutationFn: ({ product, quantity = 1, selectedColor }: MergeCartInput) =>
      mergeCart([
        { id: -1, documentId: "cart", product, quantity, selectedColor },
      ]),

    onMutate: ({ product, quantity = 1, selectedColor }) => {
      const prevCart = { items: [...useCartStore.getState().items] };

      const existing = prevCart.items.find(
        (i) =>
          String(i.product.documentId) === String(product.documentId) &&
          i.selectedColor?.documentId === selectedColor?.documentId
      );

      let newItems;
      if (existing) {
        newItems = prevCart.items.map((i) =>
          String(i.product.documentId) === String(product.documentId) &&
          i.selectedColor?.documentId === selectedColor?.documentId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [
          ...prevCart.items,
          {
            id: -1,
            documentId: product.documentId,
            product,
            quantity,
            selectedColor,
          },
        ];
      }

      useCartStore.setState({ items: newItems });
      return prevCart as typCart;
    },

    onError: (_error, _variables, rollback) => {
      if (rollback) {
        useCartStore.setState({ items: rollback.items });
      }
      console.error("❌ Failed to merge guest cart.");
    },

    onSuccess: (data) => {
      useCartStore.getState().clearCart();
      queryClient.setQueryData<typCart>(CART_QUERY_KEY, data);
    },
  });

// ➕ Add item
  const addMutation = useMutation({
    mutationFn: ({
      product,
      quantity,
      selectedColor,
    }: {
      product: typProduct;
      quantity: number;
      selectedColor: typColor;
    }) => addCartItem(product, quantity, selectedColor),

    onMutate: async ({ product, quantity, selectedColor }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<typCart>(CART_QUERY_KEY);

      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: [
            ...old.items,
            {
              id: Date.now(), // temporary id
              documentId: product.documentId,
              product,
              quantity,
              selectedColor,
            },
          ],
        };
      });

      return { previousCart };
    },

    onSuccess: (data) => {
      if (data) {
        // ✅ Replace the temporary item with the real one from server
        queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
          if (!old) {
            return { id: "temp", items: [data] };
          }

          // Find and replace the optimistic item with the server response
          const existingIndex = old.items.findIndex(
            (item) =>
              String(item.product.documentId) === String(data.product.documentId) &&
              item.selectedColor?.documentId === data.selectedColor?.documentId
          );

          if (existingIndex !== -1) {
            // Replace the optimistic item with real server data
            const newItems = [...old.items];
            newItems[existingIndex] = data;
            return {
              ...old,
              items: newItems,
            };
          }

          // If not found (shouldn't happen), just add it
          return {
            ...old,
            items: [...old.items, data],
          };
        });
      }
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<typCart>(CART_QUERY_KEY, context.previousCart);
      }
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

    onSuccess: (updatedItem) => {
      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        };
      });
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<typCart>(CART_QUERY_KEY, context.previousCart);
      }
    },
  });

  // ❌ Remove item
  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<typCart>(CART_QUERY_KEY);

      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.filter((item) => item.id !== itemId),
        };
      });

      return { previousCart };
    },

    onSuccess: (data) => {
      queryClient.setQueryData<typCart>(CART_QUERY_KEY, (old) => {
        if (!old) return old;

        // تأكيد حذف العنصر المحذوف إذا السيرفر رجّع العنصر اللي تم حذفه
        return {
          ...old,
          items: old.items.filter((item) => item.id !== data.id),
        };
      });
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<typCart>(CART_QUERY_KEY, context.previousCart);
      }
    },
  });

  // 🧹 Clear all
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

    onSuccess: (data) => {
      if (data) {
        console.log({ data }, "sucess");

        queryClient.setQueryData<typCart>(CART_QUERY_KEY, data);
      }
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData<typCart>(CART_QUERY_KEY, context.previousCart);
      }
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    refetch: cartQuery.refetch,
    isFetching: cartQuery.isFetching,

    // Actions
    mergeMutation: mergeMutation.mutateAsync,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    clearCart: clearMutation.mutateAsync,

    // Mutation states
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
