"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { typCart, typCartItem, typColor, typProduct } from "@/content/types";

export function useUnifiedCart() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    cart: serverCart,
    isLoading: isCartLoading,
    isFetching,
    addItem,
    removeItem,
    updateItem,
    clearCart: clearServerCart,
  } = useCart();

  const guestCartStore = useCartStore();

  // 🧩 fix 1: wrap guest cart into typCart shape
  const guestCart: typCart = {
    id: "guest",
    items: guestCartStore.items,
  };

  const [isGuest, setIsGuest] = useState(true);

  // ✅ choose which one to show
  const finalCart: typCart = isGuest
    ? guestCart
    : serverCart || { id: "empty", items: [] };

  useEffect(() => {
    if (!isAuthLoading) {
      setIsGuest(!isAuthenticated);
    }
  }, [isAuthenticated, isAuthLoading]);

  // 2️⃣ Unified actions
  const unifiedAddItem = async ({
    product,
    quantity,
    selectedColor
  }: {
    product: typProduct;
    quantity: number;
    selectedColor: typColor;
  }) => {
    if (isGuest) {
      guestCartStore.addToCart(product, quantity, selectedColor);
    } else {
      await addItem({ product, quantity, selectedColor });
    }
  };

  const unifiedRemoveItem = async (item: typCartItem) => {
    if (isGuest) {
      guestCartStore.removeFromCart(
        item.product.documentId,
        item.selectedColor
      );
    } else {
      await removeItem(item.id);
    }
  };

  const unifiedUpdateQuantity = async (item: typCartItem, quantity: number) => {
    if (isGuest) {
      guestCartStore.updateQuantity(
        item.product.documentId,
        quantity,
        item.selectedColor
      );
    } else {
      await updateItem({ itemId: item.id, quantity });
    }
  };

  const unifiedClearCart = async () => {
    if (isGuest) {
      guestCartStore.clearCart();
    } else {
      await clearServerCart();
    }
  };

  return {
    cartItems: finalCart.items,
    isGuest,
    isLoading: isAuthLoading || isCartLoading,
    isFetching,
    addItem: unifiedAddItem,
    removeItem: unifiedRemoveItem,
    updateQuantity: unifiedUpdateQuantity,
    clearCart: unifiedClearCart,
  };
}
