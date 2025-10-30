"use client";

import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardForm } from "./CardForm";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useBuyNow } from "@/lib/hooks/useBuyNow";
import Loader from "@/components/reusable/Loader";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter as useI18nRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";

const stripePromise = loadStripe(
  "pk_test_51SMBVSPaP6reRDRxVdU06TkBuK5OlJIuFzqRzxQ7YRWZpJrmdryXZpWgel5Q6nBnM3xpRCXGNBzL8qj4EhJ9uvWe00oDBet9nQ"
);

export default function PaymentStep() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useI18nRouter();
  const searchParams = useSearchParams();

  const { cartItems } = useUnifiedCart();
  const { data: buyNowItems } = useBuyNow();
  const { shippingAddress, setPaymentMethod, setClientSecret, clientSecret } =
    useCheckoutStore();

  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const itemsToCheckout = isBuyNow ? buyNowItems! : cartItems;

  useEffect(() => {
    const createSetupIntent = async () => {
      if (!shippingAddress)
        return isBuyNow
          ? router.push("/checkout/shipping?isBuyNow=1")
          : router.push("/checkout/shipping");
      const res = await fetch("/api/create-setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // optionally send any info if needed
      });
      const data = await res.json();
      if (data?.clientSecret) setClientSecret(data.clientSecret);
    };
    createSetupIntent();
  }, [shippingAddress, router]);

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
          locale: `${locale}`,
          appearance: {
            variables: {
              colorBackground: isDark?"#000000" : "#FFFFFF",
              colorText: isDark?"#ece7e7":"#4b4b4b",
            },
          },
        }}
      >
        <CardForm
          clientSecret={clientSecret}
          onSaved={handleSaved}
          items={itemsToCheckout}
        />
      </Elements>

      <button onClick={handleBack} className="px-3 py-2 border rounded">
        {t("back")}
      </button>
    </div>
  );
}
