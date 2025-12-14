"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { typWishlist, typProduct, typColor } from "@/content/types";
import { useAuth } from "./useAuth";
import { useLocale } from "next-intl";
import { useWishlistStore } from "@/stores/wishlistStore";
import {
  fetchWishlist,
  mergeWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} from "../services/wishlist";

export const WISHLIST_QUERY_KEY = ["wishlist"];

type MergeWishlistInput = {
  product: typProduct;
  selectedColor: typColor;
};

export function useWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const locale = useLocale();

  // 🧾 Fetch wishlist
  const wishlistQuery = useQuery<typWishlist>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const data: typWishlist = await fetchWishlist(locale);
      return data ?? { id: "empty", items: [] };
    },
    enabled: !!isAuthenticated,
    retry: 1, // 👈 Avoid infinite retry loops
  });

  // 🔄 Merge local → server
  const mergeMutation = useMutation({
    mutationFn: ({ product, selectedColor }: MergeWishlistInput) =>
      mergeWishlist(
        [{ id: -1, documentId: "wishlist", product, selectedColor }],
        locale
      ),

    onMutate: ({ product, selectedColor }) => {
      const prevWishlist = { items: [...useWishlistStore.getState().items] };

      const existing = prevWishlist.items.find(
        (i) =>
          String(i.product.documentId) === String(product.documentId) &&
          i.selectedColor?.documentId === selectedColor?.documentId
      );

      let newItems;
      if (existing) {
        newItems = prevWishlist.items; // already exists, no change
      } else {
        newItems = [
          ...prevWishlist.items,
          {
            id: -1,
            documentId: product.documentId,
            product,
            selectedColor,
          },
        ];
      }

      useWishlistStore.setState({ items: newItems });
      return prevWishlist as typWishlist;
    },

    onError: (_error, _variables, rollback) => {
      if (rollback) useWishlistStore.setState({ items: rollback.items });
      console.error("❌ Failed to merge guest wishlist.");
    },

    onSuccess: (data) => {
      useWishlistStore.getState().clearWishlist();
      queryClient.setQueryData<typWishlist>(WISHLIST_QUERY_KEY, data);
    },
  });

  // ➕ Add item
  const addMutation = useMutation({
    mutationFn: ({ product, selectedColor }: MergeWishlistInput) =>
      addWishlistItem(product, selectedColor),

    onMutate: async ({ product, selectedColor }) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<typWishlist>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData<typWishlist>(WISHLIST_QUERY_KEY, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: [
            ...old.items,
            {
              id: Date.now(),
              documentId: product.documentId,
              product,
              selectedColor,
            },
          ],
        };
      });

      return { previousWishlist };
    },

    onSuccess: (data) => {
      if (!data) return;
      queryClient.setQueryData<typWishlist>(WISHLIST_QUERY_KEY, (old) => {
        if (!old) return { id: "temp", items: [data] };

        const existingIndex = old.items.findIndex(
          (item) =>
            String(item.product.documentId) === data.product.documentId &&
            item.selectedColor?.documentId === data.selectedColor?.documentId
        );

        if (existingIndex !== -1) {
          const newItems = [...old.items];
          newItems[existingIndex] = data;
          return { ...old, items: newItems };
        }

        return { ...old, items: [...old.items, data] };
      });
    },

    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData<typWishlist>(
          WISHLIST_QUERY_KEY,
          context.previousWishlist
        );
      }
    },
  });

  // ❌ Remove item
  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeWishlistItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<typWishlist>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData<typWishlist>(WISHLIST_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.id !== itemId),
        };
      });

      return { previousWishlist };
    },

    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData<typWishlist>(
          WISHLIST_QUERY_KEY,
          context.previousWishlist
        );
      }
    },
  });

  // 🧹 Clear all
  const clearMutation = useMutation({
    mutationFn: clearWishlist,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<typWishlist>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData<typWishlist>(WISHLIST_QUERY_KEY, (old) => {
        if (!old) return old;
        return { ...old, items: [] };
      });

      return { previousWishlist };
    },

    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData<typWishlist>(
          WISHLIST_QUERY_KEY,
          context.previousWishlist
        );
      }
    },
  });

  return {
    wishlist: wishlistQuery.data,
    isLoading: wishlistQuery.isLoading,
    isError: wishlistQuery.isError,
    refetch: wishlistQuery.refetch,
    isFetching: wishlistQuery.isFetching,

    mergeMutation: mergeMutation.mutateAsync,
    addItem: addMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    clearWishlist: clearMutation.mutateAsync,

    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
