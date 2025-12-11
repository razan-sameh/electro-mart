"use client";
import React from "react";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { useLocale, useTranslations } from "next-intl";
import { OrderItemsList } from "./OrderItemsList";
import { usePrefetchOrder } from "@/lib/hooks/useOrders";
import { enmOrderStatus } from "@/content/enums";
import { useRouter } from "@/i18n/navigation";

interface OrderRowProps {
  order: typOrder;
  getStatusLabel: (v: enmOrderStatus) => string;
  getStatusColor: (v: enmOrderStatus) => string;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  order,
  getStatusColor,
  getStatusLabel,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const prefetchOrder = usePrefetchOrder();
  const t = useTranslations("Orders");
  const handleClick = () => {
    router.push(`/profile/orders/${order.documentId}`);
    prefetchOrder(order.documentId, locale);
  };

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-lightGray/40 transition-colors cursor-pointer"
    >
      <td className="py-4 px-4 text-sm font-medium text-gray-900 text-center">
        #{order.id}
      </td>

      <td className="py-4 px-4 text-start">
        <OrderItemsList items={order.orderItems} />
      </td>

      <td className="py-4 px-4 text-center text-sm text-gray-600">
        {formatDateTime(order.date, locale, true)}
      </td>

      <td className="py-4 px-4 text-center text-sm font-medium text-gray-900">
        E£ {order.total.toFixed(2)}
      </td>

      <td
        className={`py-4 px-4 text-center text-xs capitalize ${getStatusColor(
          order.orderStatus
        )}`}
      >
        {getStatusLabel(order.orderStatus)}
      </td>
    </tr>
  );
};
