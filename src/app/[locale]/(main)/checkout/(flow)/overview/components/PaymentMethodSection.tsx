import React from "react";
import { useTranslations } from "next-intl";
import { useCheckoutStore } from "@/stores/checkoutStore";

export default function PaymentMethodSection() {
  const { shippingAddress, cardInfo } = useCheckoutStore();
  const t = useTranslations("Checkout");

  return (
    <section>
      <h2 className="font-semibold text-lg mb-4">
        {t("PaymentMethod")}
      </h2>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg uppercase">{cardInfo?.brand}</p>
          <p className="text-sm mt-2">
            **** **** **** {cardInfo?.last4 || "5028"}
          </p>
          {/* <p className="text-xs mt-1">{shippingAddress?.streetAddress}</p> */}
        </div>
        <p className="text-sm">
          {cardInfo?.exp_month}/{cardInfo?.exp_year}
        </p>
      </div>
    </section>
  );
}
