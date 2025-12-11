"use client";
import React from "react";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { useLocale } from "next-intl";
import { OrderItemsList } from "./OrderItemsList";
import { useRouter } from "next/navigation";
import { usePrefetchOrder } from "@/lib/hooks/useOrders";
import { enmOrderStatus } from "@/content/enums";

interface OrderRowProps {
  order: typOrder;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const locale = useLocale();
  const router = useRouter();
  const prefetchOrder = usePrefetchOrder();

  const handleClick = () => {
    router.push(`/profile/orders/${order.documentId}`);
    prefetchOrder(order.documentId, locale);
  };

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-lightGray/40 transition-colors cursor-pointer"
    >
      <td className="py-4 px-4 text-sm font-medium text-gray-900 text-left">
        #{order.id}
      </td>

      <td className="py-4 px-4 text-left">
        <OrderItemsList items={order.orderItems} />
      </td>

      <td className="py-4 px-4 text-center text-sm text-gray-600">
        {formatDateTime(order.date, locale, true)}
      </td>

      <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">
        E£ {order.total.toFixed(2)}
      </td>

      <td className="py-4 px-4 text-center text-xs text-gray-600 capitalize">
        {order.orderStatus === enmOrderStatus.PENDING
          ? "Being processed"
          : order.orderStatus}
      </td>
    </tr>
  );
};
