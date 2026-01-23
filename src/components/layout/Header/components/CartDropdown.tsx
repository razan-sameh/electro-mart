"use client";

import CartItemCard from "@/components/reusable/CartItemCard";
import { useCart } from "@/lib/hooks/useCart";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { typCartItem } from "@/content/types";
import Loader from "@/components/ui/Loader";

interface Props {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: Props) {
  const { cart, isFetching } = useCart();
  const router = useRouter();
  const t = useTranslations("CartDropdown");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const total =
    cart?.items?.reduce((acc, item: typCartItem) => {
      return acc + item.unitPrice * item.quantity;
    }, 0) ?? 0;

  const handleCheckout = async () => {
    onClose();
    // if (isGuest) router.push("/login?redirect=/checkout/shipping");
    // else router.push("/checkout/shipping");
  };

  function handleReviewItems() {
    onClose();
    router.push("/cart");
  }

  return (
    <div
      className={`
        absolute mt-2 sm:w-96 md:w-[400px] bg-background shadow-xl rounded-lg p-4 z-50 max-w-md
        ${isRTL ? "left-0" : "right-0"}
        ${isRTL ? "text-right" : "text-left"}
      `}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Items */}
      <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
        {isFetching ? (
          <Loader size={18} />
        ) : cart?.items?.length! > 0 ? (
          cart?.items?.map((item) => (
            <CartItemCard
              key={`${item.id}-${item.variant?.id ?? "no-variant"}`}
              item={item}
            />
          ))
        ) : (
          <p className="text-center py-6 text-sm sm:text-base">{t("empty")}</p>
        )}
      </div>

      {/* Summary */}
      {cart?.items?.length! > 0 && (
        <>
          <div className="mt-3 sm:mt-4 pt-3 text-xs sm:text-sm border-t border-lightGray/60">
            <div className="flex justify-between">
              <span>{t("shippingFee")}</span>
              <span className="text-green-600 font-semibold">{t("free")}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>{t("totalAmount")}</span>
              <span>E£ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-4">
            <button
              className="flex-1 border border-primary text-primary rounded-lg py-2 text-xs sm:text-sm font-medium transition"
              onClick={handleReviewItems}
            >
              {t("reviewItems")}
            </button>
            <button
              className="flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium bg-primary text-white hover:bg-primary/90 transition"
              onClick={handleCheckout}
            >
              {t("checkout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
