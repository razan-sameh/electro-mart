// OrderCard.tsx
import React from "react";
import { useLocale } from "next-intl";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { OrderItemsList } from "./OrderItemsList";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";
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

  return (
    <div className="relative p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className={`text-sm font-semibold capitalize ${getStatusColor(order.orderStatus as enmOrderStatus)}`}>
            {getStatusLabel(order.orderStatus as enmOrderStatus)}
          </p>
          <span className="text-xs text-gray-500">{t("orderNumber")}</span>
          <p className="text-sm text-gray-900 font-medium">#{order.orderNumber}</p>
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

        <Link href={`/profile/orders/${order.id}`}>
          {isRTL ? (
            <HiOutlineChevronLeft className="w-5 h-5 text-gray-500 mt-1" />
          ) : (
            <HiOutlineChevronRight className="w-5 h-5 text-gray-500 mt-1" />
          )}
        </Link>
      </div>

      <OrderItemsList items={order.items} />
    </div>
  );
};