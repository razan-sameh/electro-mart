import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { OrderItemsList } from "./OrderItemsList";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";
import { usePrefetchOrder } from "@/lib/hooks/useOrders";

interface OrderCardProps {
  order: typOrder;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const locale = useLocale();
  const isRTL = locale === "ar"; // ✅ adjust if you support more RTL languages
  const prefetchOrder = usePrefetchOrder();
  const handleClick = () => {
    prefetchOrder(order.documentId, locale);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cancelled":
        return "text-red-600";
      case "delivered":
        return "text-green-600";
      case "processing":
        return "text-blue-600";
      case "returned":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "processing" ? "Being processed" : status;
  };

  return (
    <div className="relative p-4 mb-4">
      {/* Top section: Status + Arrow */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <p
            className={`text-sm font-semibold capitalize ${getStatusColor(
              order.orderStatus
            )}`}
          >
            {getStatusLabel(order.orderStatus)}
          </p>
          <span className="text-xs text-gray-500">Order number</span>
          <p className="text-sm text-gray-900 font-medium">#{order.id}</p>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Date</span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDateTime(order.date, locale, true)}
            </span>
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-sm text-gray-900 font-medium">
              E£ {order.total.toFixed(0)}
            </span>
          </div>
        </div>

        {/* ✅ Locale-based arrow inside Link */}
        <Link href={`/profile/orders/${order.documentId}`} onClick={handleClick}>
          {isRTL ? (
            <HiOutlineChevronLeft className="w-5 h-5 text-gray-500 mt-1" />
          ) : (
            <HiOutlineChevronRight className="w-5 h-5 text-gray-500 mt-1" />
          )}
        </Link>
      </div>

      {/* Product Cards */}
      <OrderItemsList items={order.orderItems} />
    </div>
  );
};
