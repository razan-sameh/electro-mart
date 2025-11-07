"use client";

import React from "react";
import { useOrder } from "@/lib/hooks/useOrders";
import OrderHeader from "./OrderHeader";
import ShipmentSection from "./ShipmentSection";
import OrderItemsSection from "./OrderItemsSection";
import PaymentSummary from "./PaymentSummary";

export default function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) return <div>Loading order...</div>;
  if (error) return <div>Error loading order</div>;
  if (!order) return <div>No order found</div>;

  return (
    <div className="mx-auto p-4 sm:p-6 space-y-6 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-semibold">Order Detail</h1>

      <div className="bg-background rounded-2xl shadow-md p-4 sm:p-6 space-y-6">
        <OrderHeader order={order} orderId={orderId} />
        <ShipmentSection order={order} />
        <OrderItemsSection orderItems={order.orderItems} />
        <PaymentSummary order={order} />
      </div>
    </div>
  );
}
