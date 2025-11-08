// lib/services/wishlist.ts
import { WishlistAdapter } from "@/adapters/WishlistAdapter";
import { WishlistItemsAdapter } from "@/adapters/WishlistItemsAdapter";
import { typWishlistItem, typProduct, typColor } from "@/content/types";
import { STRAPI_URL } from "../apiClient";

const wishlistAdapter = WishlistAdapter.getInstance(STRAPI_URL);
const wishlistItemsAdapter = WishlistItemsAdapter.getInstance(STRAPI_URL);

// Fetch wishlist
export async function fetchWishlist(locale: string) {
  const res = await fetch(`/api/wishlist?locale=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch wishlist");

  const data = await res.json();
  if (!data.data) return { id: "empty", items: [] };

  return wishlistAdapter.adapt(data.data);
}

// Merge local wishlist to server
export async function mergeWishlist(items: typWishlistItem[], locale: string) {
  const mywishlist = await fetchWishlist(locale);
  const res = await fetch("/api/wishlist", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wishlist_items: items,mywishlist }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("❌ Wishlist error:", error);
    throw new Error(error.error || "Failed to merge wishlist");
  }

  return res.json();
}
// Add item to wishlist
export async function addWishlistItem(
  product: typProduct,
  selectedColor: typColor
) {
  const res = await fetch("/api/wishlist/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: product.documentId,
      productColorId: selectedColor.documentId,
    }),
  });

  if (!res.ok) throw new Error("Failed to add to wishlist");

  const data = await res.json();
  return wishlistItemsAdapter.adapt(data.data);
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
