// lib/services/orders.ts
import { STRAPI_URL } from "../apiClient";
import { OrderAdapter } from "@/adapters/OrderAdapter";

const orderAdapter = OrderAdapter.getInstance(STRAPI_URL);

export async function fetchOrders(locale: string, page = 1, pageSize = 10) {
  const res = await fetch(
    `/api/orders?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch orders");

  const data = await res.json();
  const orders = orderAdapter.adaptMany(data.data);

  return {
    orders,
    meta: data.meta,
  };
}
