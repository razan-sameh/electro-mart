// stores/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { typCartItem, typProduct, typColor } from "@/content/types";

interface CartState {
  items: typCartItem[];
  addToCart: (product: typProduct, quantity?: number, selectedColor?: typColor) => void;
  removeFromCart: (id: string, selectedColor?: typColor) => void;
  updateQuantity: (id: string, quantity: number, selectedColor?: typColor) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1, selectedColor) => {
        const existing = get().items.find(
          (i) =>
            i.id === product.id &&
            i.selectedColor?.id === selectedColor?.id
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === product.id && i.selectedColor?.id === selectedColor?.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { id: product.id, product, quantity, selectedColor },
            ],
          });
        }
      },
      removeFromCart: (id, selectedColor) =>
        set({
          items: get().items.filter(
            (i) => !(i.id === id && i.selectedColor?.id === selectedColor?.id)
          ),
        }),
      updateQuantity: (id, quantity, selectedColor) =>
        set({
          items: get().items.map((i) =>
            i.id === id && i.selectedColor?.id === selectedColor?.id
              ? { ...i, quantity }
              : i
          ),
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "guest_cart", // مفتاح localStorage
      skipHydration: false,
    }
  )
);
