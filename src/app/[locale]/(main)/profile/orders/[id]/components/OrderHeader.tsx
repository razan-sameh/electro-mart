"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { enmOrderStatus } from "@/content/enums";

interface OrderHeaderProps {
  order: any;
  orderId: string;
}

export default function OrderHeader({ order, orderId }: OrderHeaderProps) {
  const t = useTranslations("OrderDetail");
  const getStatusTextColor = (status: enmOrderStatus) => {
    switch (status) {
      case enmOrderStatus.CANCELLED:
        return "text-secondary";
      case enmOrderStatus.DELIVERED:
        return "text-success";
      case enmOrderStatus.PENDING:
        return "text-primary";
      case enmOrderStatus.SHIPPED:
        return "text-secondary";
      default:
        return "text-content";
    }
  };
  const getStatusBGColor = (status: enmOrderStatus) => {
    switch (status) {
      case enmOrderStatus.CANCELLED:
        return "bg-secondary/10";
      case enmOrderStatus.DELIVERED:
        return "bg-success/10";
      case enmOrderStatus.PENDING:
        return "bg-primary/10";
      case enmOrderStatus.SHIPPED:
        return "bg-secondary/10";
      default:
        return "bg-content/10";
    }
  };
  const getStatusLabel = (status: enmOrderStatus) => {
    switch (status) {
      case enmOrderStatus.CANCELLED:
        return status;
      case enmOrderStatus.DELIVERED:
        return t("delivered");
      case enmOrderStatus.PENDING:
        return t("statusProcessing");
      case enmOrderStatus.SHIPPED:
        return status;
      default:
        return status;
    }
  };
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <p className="text-content">{t("orderId")}:</p>
        <p className="font-bold">#{orderId}</p>
      </div>
      <span
        className={`text-sm ${getStatusTextColor(
          order.orderStatus
        )} font-medium ${getStatusBGColor(
          order.orderStatus
        )} px-3 py-1 rounded-full self-start sm:self-auto`}
      >
        {getStatusLabel(order.orderStatus)}
      </span>
    </div>
  );
}
