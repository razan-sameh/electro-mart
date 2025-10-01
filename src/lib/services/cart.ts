// lib/services/cartService.ts
import { typCart } from "@/content/types";
import { apiClient } from "../apiClient";

export async function mergeCartWithServer(userId: number, cart: typCart) {
  const data = await apiClient<{ items: typCart["items"] }>(
    "/cart/merge",
    {
      method: "POST",
      body: JSON.stringify({ userId, items: cart.items }),
    }
  );
  return data;
}
