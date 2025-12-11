"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { enmPaymentStatus } from "@/content/enums";

export default function PaymentSummary({ order }: { order: any }) {
  const t = useTranslations("OrderDetail.PaymentSummary");
  const payment = order?.payment;
  const getStatusTextColor = (status: enmPaymentStatus) => {
    switch (status) {
      case enmPaymentStatus.FAILED:
        return "text-secondary";
      case enmPaymentStatus.SUCCEEDED:
        return "text-success";
      case enmPaymentStatus.PROCESSING:
        return "text-primary";
      default:
        return "text-content";
    }
  };
  const getStatusBGColor = (status: enmPaymentStatus) => {
    switch (status) {
      case enmPaymentStatus.FAILED:
        return "bg-secondary/10";
      case enmPaymentStatus.SUCCEEDED:
        return "bg-success/10";
      case enmPaymentStatus.PROCESSING:
        return "bg-primary/10";
      default:
        return "bg-content/10";
    }
  };
  const getStatusLabel = (status: enmPaymentStatus) => {
    switch (status) {
      case enmPaymentStatus.FAILED:
        return status;
      case enmPaymentStatus.SUCCEEDED:
        return t("paid");
      case enmPaymentStatus.PROCESSING:
        return t("statusProcessing");
      default:
        return status;
    }
  };
  return (
    <div className="bg-body rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
        <h2 className="font-semibold">{t("title")}</h2>
        <span className={`text-sm ${getStatusTextColor(
          payment?.paymentStatus
        )} font-medium ${getStatusBGColor(
          payment?.paymentStatus
        )} px-3 py-1 rounded-full self-start sm:self-auto mt-2`}>
          {getStatusLabel(payment?.paymentStatus)}
        </span>
      </div>

      <div className="text-sm space-y-1">
        <div className="flex justify-between items-center">
          <p>{t("paymentMethod")}</p>
          <p>
            {payment?.paymentMethod.brand} {payment?.paymentMethod.last4}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p>{t("subtotal")}</p>
          <p>E£ {order?.subtotal}</p>
        </div>
        <div className="flex justify-between items-center text-secondary">
          <p>{t("discount")}</p>
          <p>E£ -{order?.discountTotal}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>{t("shippingFee")}</p>
          <p>{t("free")}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3">
        <p className="font-bold">{t("total")}</p>
        <p className="font-semibold text-lg">E£ {order?.total}</p>
      </div>
    </div>
  );
}
