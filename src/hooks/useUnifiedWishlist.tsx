"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { typWishlist, typWishlistItem, typColor, typProduct } from "@/content/types";

export function useUnifiedWishlist() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    wishlist: serverWishlist,
    isLoading: isWishlistLoading,
    isFetching,
    addItem,
    removeItem,
    clearWishlist: clearServerWishlist,
  } = useWishlist();

  const guestWishlistStore = useWishlistStore();

  // Wrap guest wishlist into typWishlist shape
  const guestWishlist: typWishlist = {
    id: "guest",
    items: guestWishlistStore.items,
  };

  const [isGuest, setIsGuest] = useState(true);

  // Choose which one to show
  const finalWishlist: typWishlist = isGuest
    ? guestWishlist
    : serverWishlist || { id: "empty", items: [] };

  useEffect(() => {
    if (!isAuthLoading) {
      setIsGuest(!isAuthenticated);
    }
  }, [isAuthenticated, isAuthLoading]);

  // Unified actions
  const unifiedAddItem = async ({
    product,
    selectedColor,
  }: {
    product: typProduct;
    selectedColor: typColor;
  }) => {
    if (isGuest) {
      guestWishlistStore.addToWishlist(product, selectedColor);
    } else {
      await addItem({ product, selectedColor });
    }
  };

  const unifiedRemoveItem = async (item: typWishlistItem) => {
    if (isGuest) {
      guestWishlistStore.removeFromWishlist(item.product.documentId, item.selectedColor);
    } else {
      await removeItem(item.id);
    }
  };

  const unifiedClearWishlist = async () => {
    if (isGuest) {
      guestWishlistStore.clearWishlist();
    } else {
      await clearServerWishlist();
    }
  };

  return {
    wishlistItems: finalWishlist.items,
    isGuest,
    isLoading: isAuthLoading || isWishlistLoading,
    isFetching,
    addItem: unifiedAddItem,
    removeItem: unifiedRemoveItem,
    clearWishlist: unifiedClearWishlist,
  };
}
