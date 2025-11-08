"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import { useWishlist } from "@/lib/hooks/useWishlist";

export function useMergeGuestWishlistToUser() {
  const { mergeMutation } = useWishlist();
  const guestWishlist = useWishlistStore((s) => s.items);

  const merge = async () => {
    if (!guestWishlist?.length) return;

    // Send all guest wishlist items to server
    for (const item of guestWishlist) {
      await mergeMutation({
        product: item.product,
        selectedColor: item.selectedColor!,
      });
    }

    // Clear local guest wishlist after merging
    useWishlistStore.getState().clearWishlist();
  };

  return { merge };
}
