// lib/services/orders.ts
import { enmOrderStatus } from "@/content/enums";
import { OrderAdapter } from "@/adapters/OrderAdapter";
import { notFound } from "next/navigation";

const orderAdapter = OrderAdapter.getInstance();

export async function fetchOrders(
  locale: string,
  page = 1,
  pageSize = 10,
  status?: enmOrderStatus
) {
  const params = new URLSearchParams({
    locale,
    page: String(page),
    pageSize: String(pageSize),
  });

  if (status) {
    params.append("order_status", status);
  }

  const res = await fetch(`/api/orders?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch orders");

  const data = await res.json();
  if (!data.data) {
    notFound();
  }
  return {
    orders: orderAdapter.adaptMany(data.data),
    meta: data.meta,
  };
}

// Fetch a single order by ID
export async function fetchOrderById(locale: string, id: string) {
  const res = await fetch(`/api/orders/${id}?locale=${locale}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch order");

  const data = await res.json();
  if (!data.data) {
    notFound();
  }
  return orderAdapter.adapt(data.data);
}
