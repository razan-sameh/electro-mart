import { typCartItem, typShippingAddress } from "@/content/types";

export async function updateShipping(
  items: typCartItem[],
  data: typShippingAddress,
  phone: string,
  draftOrderId?: number | null,
) {
  const res = await fetch("/api/checkout/shipping", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shippingAddress: data,
      items,
      phone: phone,
      orderId: draftOrderId || null,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create draft order");
  }

  const { orderIdDB } = await res.json();
  
  return orderIdDB;
}

export async function createOrder(
  items: typCartItem[],
  draftOrderId?: number,
) {  
  const res = await fetch("/api/checkout/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items,
      draftOrderId: draftOrderId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create draft order");
  }

  const { orderId } = await res.json();
  
  return orderId;
}

export async function confirmOrder(orderId: number) {
  const res = await fetch("/api/checkout/place-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: orderId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create draft order");
  }

  const { success, order } = await res.json();
  return { success, order };
}

export async function getCheckoutStep(orderId: number) {
  const res = await fetch(`/api/checkout?orderId=${orderId}`);
  const data = await res.json();  
  return data.step;
}

export async function getDraftOrderId() {
  const res = await fetch(`/api/checkout/draft-order`);
  const data = await res.json();
  return data.orderId;
}
