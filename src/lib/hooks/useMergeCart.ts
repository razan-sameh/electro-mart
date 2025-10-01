// hooks/useMergeCart.ts
"use client";

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { typCart, typCartItem, typProduct, typColor } from "@/content/types";
import { mergeCartWithServer } from "../services/cart";
import { useCartStore } from "@/stores/cartStore";

type MergeCartInput = {
  userId: number;
  product: typProduct;
  quantity?: number;
  selectedColor?: typColor;
};

export const useMergeCart = (): UseMutationResult<
  { items: typCartItem[] }, // return type from server
  Error,
  MergeCartInput,
  typCart // rollback context
> => {
  return useMutation({
    mutationFn: ({ userId, product, quantity = 1, selectedColor }: MergeCartInput) =>
      mergeCartWithServer(userId, {
        id: "cart",
        userId,
        items: [{ id: product.id, product, quantity, selectedColor }],
      }),

    onMutate: ({ product, quantity = 1, selectedColor }) => {
      const prevCart = { items: useCartStore.getState().items };

      // تحديث Optimistic
      const existing = prevCart.items.find(
        (i) =>
          String(i.product.id) === String(product.id) &&
          i.selectedColor?.id === selectedColor?.id
      );

      let newItems;
      if (existing) {
        newItems = prevCart.items.map((i) =>
          String(i.product.id) === String(product.id) &&
          i.selectedColor?.id === selectedColor?.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        newItems = [
          ...prevCart.items,
          { id: product.id, product, quantity, selectedColor },
        ];
      }

      useCartStore.setState({ items: newItems });

      return prevCart as typCart; // rollback context
    },

    onError: (_error, _variables, rollback) => {
      if (rollback) {
        useCartStore.setState({ items: rollback.items });
      }
      console.error("❌ تعذر إضافة المنتج إلى السلة. حاول مرة أخرى.");
    },

    onSuccess: (data) => {
      // استبدال cart بالبيانات من السيرفر
      useCartStore.setState({ items: data.items });

      // ⚠️ تحذير لو السيرفر رجّع كميات أقل (مثلاً بسبب stock)
      if (data.items.some((i) => i.quantity < 1)) {
        console.warn("⚠️ بعض المنتجات غير متوفرة حالياً");
      }
    },
  });
};
