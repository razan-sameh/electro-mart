"use client";

import React from "react";
import { useOrder } from "@/lib/hooks/useOrders";
import OrderHeader from "./OrderHeader";
import ShipmentSection from "./ShipmentSection";
import OrderItemsSection from "./OrderItemsSection";
import PaymentSummary from "./PaymentSummary";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTranslations } from "next-intl";

export default function OrderDetail({ orderId }: { orderId: string }) {
  const t = useTranslations("OrderDetail");
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>{t("errorLoading")}</div>;
  if (!order) return <div>{t("noOrder")}</div>;

  return (
    <div className="mx-auto p-4 sm:p-6 space-y-6 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-semibold">{t("title")}</h1>

      <div className="bg-background rounded-2xl shadow-md p-4 sm:p-6 space-y-6">
        <OrderHeader order={order} orderId={orderId} />
        <ShipmentSection order={order} />
        <OrderItemsSection orderItems={order.orderItems} />
        <PaymentSummary order={order} />
      </div>
    </div>
  );
}
