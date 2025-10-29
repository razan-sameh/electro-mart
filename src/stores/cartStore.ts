// stores/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { typCartItem, typProduct, typColor } from "@/content/types";

interface CartState {
  items: typCartItem[];
  addToCart: (product: typProduct, quantity: number, selectedColor: typColor) => void;
  removeFromCart: (documentId: string, selectedColor: typColor) => void;
  updateQuantity: (documentId: string, quantity: number, selectedColor: typColor) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1, selectedColor) => {
        const existing = get().items.find(
          (i) =>
            i.documentId === product.documentId && // use documentId
            i.selectedColor?.documentId === selectedColor?.documentId
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.documentId === product.documentId &&
              i.selectedColor?.documentId === selectedColor?.documentId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                documentId: product.documentId,
                product,
                quantity,
                selectedColor,
                id: 0,
              }, // id can be temporary
            ],
          });
        }
      },
      removeFromCart: (documentId, selectedColor) =>
        set({
          items: get().items.filter(
            (i) =>
              !(
                i.documentId === documentId &&
                i.selectedColor?.documentId === selectedColor?.documentId
              )
          ),
        }),
      updateQuantity: (documentId, quantity, selectedColor) =>
        set({
          items: get().items.map((i) =>
            i.documentId === documentId &&
            i.selectedColor?.documentId === selectedColor?.documentId
              ? { ...i, quantity }
              : i
          ),
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "guest_cart",
      skipHydration: false,
    }
  )
);
