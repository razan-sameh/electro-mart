"use client";

import { useTranslations } from "next-intl";
import { typCartItem } from "@/content/types";
import { calculateDiscountedPrice } from "@/content/utils";
import Loader from "./Loader";

interface Props {
  items: typCartItem[];
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  showInfoList?: boolean;
  loading?: boolean;
}

export default function CartSummary({
  items,
  buttonText,
  onButtonClick,
  showButton = true,
  showInfoList = true,
  loading = false,
}: Props) {
  const t = useTranslations("CartSummary");

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountedTotal = items.reduce(
    (sum, item) => sum + calculateDiscountedPrice(item.product) * item.quantity,
    0
  );
  const discount = subtotal - discountedTotal;
  const discountPercent =
    subtotal > 0 ? ((discount / subtotal) * 100).toFixed(0) : "0";

  return (
    <div className="border border-lightGray/60 rounded-lg px-6 bg-background py-8 flex flex-col justify-evenly">
      {/* Summary */}
      <div className="space-y-4 text-sm">
        <p className="flex justify-between border-b border-lightGray/60 pb-2">
          <span>{t("subtotal")}</span>
          <span>E£{subtotal.toFixed(2)}</span>
        </p>
        <p className="flex justify-between border-b border-lightGray/60 pb-2">
          <span>{t("shippingCost")}</span>
          <span>{t("free")}</span>
        </p>
        <p className="flex justify-between text-red-600 border-b border-lightGray/60 pb-2">
          <span>{t("discountAmount")}</span>
          <span>
            -E£{discount.toFixed(2)} ({discountPercent}%)
          </span>
        </p>
        <p className="flex justify-between font-semibold text-lg">
          <span>{t("total")}</span>
          <span>E£{discountedTotal.toFixed(2)}</span>
        </p>
      </div>

      {/* Button + Info */}
      {(showButton || showInfoList) && (
        <div className="flex flex-col gap-6 mt-4">
          {showButton && (
            <button
              className="w-full bg-primary hover:bg-primary/80 text-white py-2 my-4 rounded-lg font-medium transition flex items-center justify-center"
              onClick={onButtonClick}
              disabled={loading}
            >
              {loading ? (
                <Loader size={20} color="#fff" />
              ) : (
                buttonText || t("continueButton")
              )}
            </button>
          )}

          {showInfoList && (
            <ul className="text-xs text-gray-500 space-y-1">
              <li className="pb-2">{t("info1")}</li>
              <li className="pb-2">{t("info2")}</li>
              <li className="pb-2">{t("info3")}</li>
              <li className="pb-2">{t("info4")}</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
