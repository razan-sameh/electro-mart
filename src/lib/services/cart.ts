// lib/services/cart.ts
import { CartAdapter } from "@/adapters/CartAdapter";

const cartAdapter = CartAdapter.getInstance();

export async function fetchCart(locale: string) {
  const res = await fetch(`/api/cart?locale=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();

  if (!data.data) {
    return { id: 0, items: [] };
  }

  const cartData = data.data;

  const result = cartAdapter.adapt(cartData);

  return result;
}

// Add item to cart
export async function addCartItem(variantId: number, quantity: number) {
  const res = await fetch("/api/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      variantId: variantId,
      quantity: quantity,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Add to cart error:", text);
    throw new Error(text);
  }
  if (!res.ok) throw new Error("Failed to add to cart");
}

// Update cart item quantity
export async function updateCartItem(itemId: number, quantity: number) {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart");
}

// Remove cart item
export async function removeCartItem(itemId: number) {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to remove item");
  return res.json();
}

// Clear entire cart
export async function clearCart() {
  const res = await fetch("/api/cart", {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to clear cart");
  const data = await res.json();

  const clearCart = cartAdapter.adapt(data.data);

  return clearCart;
}
