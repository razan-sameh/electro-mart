"use client";

import React, { useEffect, useState } from "react";
import CartSummary from "@/components/reusable/CartSummary";
import CartItemCard from "@/components/reusable/CartItemCard";
import DeliverySection from "./DeliverySection";
import PaymentMethodSection from "./PaymentMethodSection";
import PaymentResultModal from "./PaymentResultModal";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useRouter as useI18nRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useBuyNow } from "@/lib/hooks/useBuyNow";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function OverviewStep() {
  const t = useTranslations("Checkout");
  const router = useI18nRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("isBuyNow") === "1";

  const { cartItems } = useUnifiedCart();
  const { data: buyNowItems, isLoading } = useBuyNow();
  const {
    shippingAddress,
    paymentMethod,
    setCardInfo,
    setLoadingCardInfo,
    loadingCardInfo,
  } = useCheckoutStore();

  const [loading, setLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);

  const itemsToCheckout = isBuyNow ? buyNowItems : cartItems;
  const isPageLoading =
    isLoading || // buyNow loading
    loadingCardInfo || // card info loading
    !itemsToCheckout || // cart not ready
    itemsToCheckout.length === 0;


  // 🔁 Verify previous steps and fetch card info
  useEffect(() => {
    if (!shippingAddress) {
      isBuyNow
        ? router.push("/checkout/shipping?isBuyNow=1")
        : router.push("/checkout/shipping");
      return;
    }

    if (!paymentMethod?.id) {
      isBuyNow
        ? router.push("/checkout/payment?isBuyNow=1")
        : router.push("/checkout/payment");
      return;
    }
    fetchCardInfo();
  }, [shippingAddress, paymentMethod]);

  const fetchCardInfo = async () => {
    setLoadingCardInfo(true);
    try {
      const res = await fetch(`/api/payment-method/${paymentMethod?.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      setCardInfo({
        brand: data.brand,
        last4: data.last4,
        exp_month: data.exp_month,
        exp_year: data.exp_year,
      });
    } catch (err) {
      console.error("Failed to fetch card info:", err);
      setCardInfo(null);
    } finally {
      setLoadingCardInfo(false);
    }
  };

  // 💳 Confirm Order
  const handleConfirmOrder = async (isRetry = false) => {
    if (!paymentMethod) return alert(t("noPaymentMethod"));

    isRetry ? setRetryLoading(true) : setLoading(true);

    try {
      const res = await fetch("/api/pay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: itemsToCheckout,
          shippingAddress,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        isBuyNow
          ? router.replace(
              `/checkout/success?isBuyNow=1&orderId=${data.orderId}`
            )
          : router.replace(`/checkout/success?orderId=${data.orderId}`);
      } else {
        setStatus("failed");
      }
    } catch (err) {
      setStatus("failed");
    } finally {
      isRetry ? setRetryLoading(false) : setLoading(false);
    }
  };
  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-10">
          {/* 🚚 Delivery info */}
          <DeliverySection shippingAddress={shippingAddress} />

          {/* 🧾 Order summary */}
          <section>
            <h2 className="font-semibold text-lg mb-4">{t("OrderSummary")}</h2>
            <div className="space-y-4">
              {itemsToCheckout?.map((item: any) => (
                <CartItemCard
                  key={`${item.id}-${item.selectedColor?.id || "default"}`}
                  item={item}
                />
              ))}
            </div>
          </section>

          {/* 💳 Payment method */}
          <PaymentMethodSection />
        </div>

        {/* 🧮 Cart Summary & Submit */}
        <div>
          <CartSummary
            items={itemsToCheckout!}
            buttonText={t("SubmitAndPay")}
            onButtonClick={() => handleConfirmOrder(false)}
            loading={loading}
          />
        </div>
      </div>

      {/* ❌ Payment Failure Modal */}
      <PaymentResultModal
        status={status === "failed" ? "failed" : null}
        shippingAddress={shippingAddress}
        retryLoading={retryLoading}
        onRetry={() => handleConfirmOrder(true)}
        onGoHome={() => router.push("/")}
      />
    </>
  );
}
