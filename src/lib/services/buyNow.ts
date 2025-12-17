import { BuyNowAdapter } from "@/adapters/BuyNowAdapter";

const buyNowAdapter = BuyNowAdapter.getInstance();

export async function fetchBuyNow() {
  const res = await fetch(`/api/buy-now`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  if (!data || !data.session) {
    return null; // or return [] if your app expects an array
  }
  const cartData = data.session;
  const result = buyNowAdapter.adapt(cartData);
  return [result];
}
