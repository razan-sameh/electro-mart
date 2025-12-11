"use client";

import { typOrderItem } from "@/content/types";
import { useTranslations } from "next-intl";

type Props = {
  item: typOrderItem;
};

export default function OrderItemCard({ item }: Props) {
  const t = useTranslations("OrderDetail");

  return (
    <div className="bg-body rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 w-full">
      <img
        src={item.product.imagesUrl[0]}
        alt={item.product.name}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 w-full">
        <p className="font-medium">{item.product.name}</p>

        {/* Quantity × Unit Price */}
        <p className="text-sm text-content">
          {t("quantityXPrice", {
            quantity: item.quantity,
            unitPrice: item.UnitPrice,
            subtotal: item.subtotal
          })}
        </p>

        {/* Discount */}
        {item.discountValue > 0 && (
          <p className="text-xs text-secondary">
            {t("discount", { discountValue: item.discountValue })}
          </p>
        )}

        {/* Total */}
        <p className="text-content text-sm">E£{item.total}</p>

        {/* Color */}
        <p className="text-content text-xs">
          {t("color")}: {item.selectedColor.name}
        </p>
      </div>
    </div>
  );
}
