// stores/wishlistStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { typWishlistItem, typProduct, typColor } from "@/content/types";

interface WishlistState {
  items: typWishlistItem[];
  addToWishlist: (product: typProduct, selectedColor: typColor) => void;
  removeFromWishlist: (documentId: string, selectedColor: typColor) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product, selectedColor) => {
        const existing = get().items.find(
          (i) =>
            i.product.documentId === product.documentId &&
            i.selectedColor?.documentId === selectedColor?.documentId
        );

        if (!existing) {
          set({
            items: [
              ...get().items,
              {
                id: 0, // temporary id until server returns real one
                documentId: product.documentId,
                product,
                selectedColor,
              },
            ],
          });
        }
      },

      removeFromWishlist: (documentId, selectedColor) =>
        set({
          items: get().items.filter(
            (i) =>
              !(
                i.product.documentId === documentId &&
                i.selectedColor?.documentId === selectedColor?.documentId
              )
          ),
        }),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "guest_wishlist",
      skipHydration: false,
    }
  )
);
