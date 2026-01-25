// lib/services/wishlist.ts
import { WishlistAdapter } from "@/adapters/WishlistAdapter";

const wishlistAdapter = WishlistAdapter.getInstance();

// Fetch wishlist
export async function fetchWishlist(locale: string) {
  const res = await fetch(`/api/wishlist?locale=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist");

  const data = await res.json();

  return wishlistAdapter.adapt(data.data);
}

// Add item to wishlist
export async function addWishlistItem(
  variantId: number
) {
  const res = await fetch("/api/wishlist/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      variantId: variantId
    }),
  });

  if (!res.ok) throw new Error("Failed to add to wishlist");
}

// Remove item from wishlist
export async function removeWishlistItem(itemId: number) {
  const res = await fetch(`/api/wishlist/items/${itemId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove wishlist item");
  return res.json();
}

// Clear entire wishlist
export async function clearWishlist() {
  const res = await fetch("/api/wishlist", {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to clear wishlist");

  const data = await res.json();
  return wishlistAdapter.adapt(data.data);
}
