"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { typWishlist } from "@/content/types";
import { useLocale } from "next-intl";
import {
  fetchWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist,
} from "@/lib/services/wishlist";

export const WISHLIST_QUERY_KEY = ["wishlist"];

export function useWishlist() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  const wishlistQuery = useQuery<typWishlist>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      const data: typWishlist = await fetchWishlist(locale);
      return data;
    },
    retry: 1,
    staleTime: Infinity,
  });

  // ➕ Add item
  const addMutation = useMutation({
    mutationFn: (variantId: number) => addWishlistItem(variantId),

    onMutate: async (variantId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<typWishlist>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData<typWishlist>(WISHLIST_QUERY_KEY, (old) => {
        if (!old) return old;

        // prevent duplicates
        const exists = old.items.some((item) => item.variant?.id === variantId);
        if (exists) return old;

        return {
          ...old,
          items: [
            ...old.items,
            {
              id: Date.now(),
              variant: { id: variantId } as any,
              product: {} as any,
            } as any,
          ],
        };
      });

      return { previousWishlist };
    },

    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previousWishlist);
      }
    },

    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(WISHLIST_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  // ❌ Remove item
  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeWishlistItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previousWishlist =
        queryClient.getQueryData<typWishlist>(WISHLIST_QUERY_KEY);

      queryClient.setQueryData(
        WISHLIST_QUERY_KEY,
        (old: typWishlist | undefined) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.filter((i) => i.id !== itemId),
          };
        },
      );

      return { previousWishlist };
    },

    onError: (err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previousWishlist);
      }
    },

    // onSuccess: (data) => {
    //   queryClient.setQueryData(WISHLIST_QUERY_KEY, data);
    //   queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    // },
  });

  // 🧹 Clear wishlist
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
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previousWishlist);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  return {
    wishlist: wishlistQuery.data,
    isLoading: wishlistQuery.isLoading,
    isFetching: wishlistQuery.isFetching,
    isError: wishlistQuery.isError,
    refetch: wishlistQuery.refetch,
    addItem: addMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    clearWishlist: clearMutation.mutateAsync,
  };
}
