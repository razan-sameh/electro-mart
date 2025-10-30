"use client";
import { useCart } from "@/lib/hooks/useCart";
import { useCartStore } from "@/stores/cartStore";

export function useMergeGuestCartToUser() {
  const {mergeMutation} = useCart();

  async function merge() {
    const cartItems = useCartStore.getState().items;
    if (cartItems.length === 0) return;

    for (const item of cartItems) {
      await mergeMutation({
        product: item.product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
      });
    }
  }

  return { merge };
}
