"use client";

import React from "react";
import OrderItemCard from "./OrderItemCard";
import { useTranslations } from "next-intl";

export default function OrderItemsSection({ orderItems }: { orderItems: any[] }) {
  const t = useTranslations("OrderDetail");

  return (
    <div>
      <h2 className="font-semibold mb-2">
        {t("items")} ({orderItems?.length || 0})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {orderItems?.map((item) => (
          <OrderItemCard
            key={`${item.id}-${item.selectedColor?.id || "default"}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}
