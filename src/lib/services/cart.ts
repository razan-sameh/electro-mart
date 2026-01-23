// lib/services/cart.ts
import { CartAdapter } from "@/adapters/CartAdapter";
import { typCartItem, typColor, typProduct } from "@/content/types";
import { CartItemsAdapter } from "@/adapters/CartItemsAdapter";
const cartAdapter = CartAdapter.getInstance();
const cartItemsAdapter = CartItemsAdapter.getInstance();

export async function mergeCart(cartItems: typCartItem[]) {
  const cartRes = await fetch("/api/cart", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart_items: cartItems }),
  });

  if (!cartRes.ok) {
    const error = await cartRes.json();
    console.error("❌ Cart error:", error);
    throw new Error(error.error || "Failed to merge cart");
  }

  return cartRes.json();
}

export async function fetchCart(locale: string) {
  const res = await fetch(`/api/cart?locale=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  
  if (!data.data) {
    return { id: 0, items: [] };
  }
  console.log({data});
  
  const cartData = data.data;

  const result = cartAdapter.adapt(cartData);
  console.log({result});
  
  return result;
}

// Add item to cart
export async function addCartItem(
  variantId: number, quantity: number
) {
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
  // const data = await res.json();
// console.log({data});

  // const addedItem = cartItemsAdapter.adapt(data.data);

  // return addedItem;
}

// Update cart item quantity
export async function updateCartItem(itemId: number, quantity: number) {
  const res = await fetch(`/api/cart/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) throw new Error("Failed to update cart");
  // const data = await res.json();

  // const updatedItem = cartItemsAdapter.adapt(data.data);

  // return updatedItem;
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
