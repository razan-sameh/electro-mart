import React from "react";
import { useTranslations } from "next-intl";
import { typPayment } from "@/content/types";

export default function PaymentMethodSection({payment}:{payment:typPayment}) {
  const t = useTranslations("Checkout");

  return (
    <section>
      <h2 className="font-semibold text-lg mb-4">
        {t("PaymentMethod")}
      </h2>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-5 flex justify-between items-center">
        <div>
          <p className="font-bold text-lg uppercase">{payment.cardBrand}</p>
          <p className="text-sm mt-2">
            **** **** **** {payment.cardLast4}
          </p>
          {/* <p className="text-xs mt-1">{shippingAddress?.streetAddress}</p> */}
        </div>
        <p className="text-sm">
          {payment.cardExpMonth}/{payment.cardExpYear}
        </p>
      </div>
    </section>
  );
}
