import React from "react";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { useLocale } from "next-intl";
import { OrderItemsList } from "./OrderItemsList";

interface OrderRowProps {
  order: typOrder;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const locale = useLocale();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
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
        E£ {order.totalPayment.toFixed(2)}
      </td>

      <td className="py-4 px-4 text-center text-xs text-gray-600 capitalize">
        {order.orderStatus === "processing"
          ? "Being processed"
          : order.orderStatus}
      </td>
    </tr>
  );
};
