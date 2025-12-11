import React from "react";
import { useLocale } from "next-intl";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { OrderItemsList } from "./OrderItemsList";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";
import { usePrefetchOrder } from "@/lib/hooks/useOrders";
import { useTranslations } from "next-intl";
import { enmOrderStatus } from "@/content/enums";
import { Link } from "@/i18n/navigation";

interface OrderCardProps {
  order: typOrder;
  getStatusLabel: (v: enmOrderStatus) => string;
  getStatusColor: (v: enmOrderStatus) => string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  getStatusColor,
  getStatusLabel,
}) => {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const prefetchOrder = usePrefetchOrder();

  const handleClick = () => {
    prefetchOrder(order.documentId, locale);
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
          <span className="text-xs text-gray-500">{t("orderNumber")}</span>
          <p className="text-sm text-gray-900 font-medium">#{order.id}</p>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{t("date")}</span>
            <span className="text-sm text-gray-900 font-medium">
              {formatDateTime(order.date, locale, true)}
            </span>
            <span className="text-xs text-gray-500">{t("total")}</span>
            <span className="text-sm text-gray-900 font-medium">
              E£ {order.total.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Locale-based arrow */}
        <Link
          href={`/profile/orders/${order.documentId}`}
          onClick={handleClick}
        >
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
