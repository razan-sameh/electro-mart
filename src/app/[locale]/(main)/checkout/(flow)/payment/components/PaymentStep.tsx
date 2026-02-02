"use client";

import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardForm } from "./CardForm";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useBuyNow } from "@/lib/hooks/useBuyNow";
import Loader from "@/components/ui/Loader";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useCart } from "@/lib/hooks/useCart";

const strip_pk = process.env.NEXT_PUBLIC_STRIPE_PK;
const stripePromise = loadStripe(strip_pk!);

export default function PaymentStep() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cart } = useCart();
  const { data: buyNowItems } = useBuyNow();
  const { orderId, setPaymentMethod, setClientSecret, clientSecret } =
    useCheckoutStore();

  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const itemsToCheckout = isBuyNow ? buyNowItems! : cart?.items!;
  const total = cart?.items?.reduce((sum, item) => {
    const price = Number(item?.total ?? 0);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  useEffect(() => {
    if (!orderId) return; // orderId لازم موجود
    if (!cart?.items?.length) return; // cart لازم يكون فيه items
    if (total! <= 0) return; // total لازم يكون أكبر من 0

    fetch("/api/checkout/create-setup-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, amount: total }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch(console.error);
  }, [orderId, cart?.items]);

  if (!clientSecret) {
    return <Loader text={t("preparingPayment")} />;
  }

  const handleBack = () => router.back();
  const handleSaved = (pm: any) => {
    setPaymentMethod(pm);
    isBuyNow
      ? router.push("/checkout/overview?isBuyNow=1")
      : router.push("/checkout/overview");
  };

  return (
    <div className="space-y-4">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          locale: locale === "ar" ? "ar" : "en",
          appearance: {
            variables: {
              colorBackground: isDark ? "#000000" : "#FFFFFF",
              colorText: isDark ? "#ece7e7" : "#4b4b4b",
            },
          },
        }}
      >
        <CardForm
          clientSecret={clientSecret}
          onSaved={handleSaved}
          items={itemsToCheckout}
          amount={total!}
        />
      </Elements>

      <button onClick={handleBack} className="px-3 py-2 border rounded">
        {t("back")}
      </button>
    </div>
  );
}
