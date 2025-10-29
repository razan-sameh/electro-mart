"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CartSummary from "@/components/reusable/CartSummary";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import DeliverySection from "./DeliverySection";
import PaymentMethodSection from "./PaymentMethodSection";
import PaymentResultModal from "./PaymentResultModal";
import CartItemCard from "@/components/reusable/CartItemCard";
import { useCheckoutStore } from "@/stores/checkoutStore";

export default function OverviewStep({
  items,
  shippingAddress,
  paymentMethod,
  isClearCart,
}: any) {
  const [loading, setLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const { clearCart } = useUnifiedCart();
  const router = useRouter();
  const { resetCheckout } = useCheckoutStore();

  const handleConfirmOrder = async (isRetry = false) => {
    if (!paymentMethod) return alert("No payment method found");

    if (isRetry) setRetryLoading(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/pay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: items,
          shippingAddress,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.replace(
          `/checkout/success?orderId=${data.orderId}&amount=${data.amount}`
        );

        setTimeout(async () => {
          if (isClearCart) await clearCart();
          resetCheckout();
        }, 500);
      } else {
        // ❌ لو فشل، أظهري المودال
        setStatus("failed");
      }
    } catch (err) {
      setStatus("failed");
    } finally {
      isRetry ? setRetryLoading(false) : setLoading(false);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-10">
          <DeliverySection shippingAddress={shippingAddress} />
          <section>
            <h2 className="font-semibold text-lg mb-4">Order summary</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <CartItemCard
                  key={`${item.id}-${item.selectedColor?.id || "default"}`}
                  item={item}
                />
              ))}
            </div>
          </section>
          <PaymentMethodSection />
        </div>

        <div>
          <CartSummary
            items={items}
            buttonText={"Submit and Pay"}
            onButtonClick={() => handleConfirmOrder(false)}
            loading={loading}
          />
        </div>
      </div>

      <PaymentResultModal
        status={status === "failed" ? "failed" : null} // ❗ يعرض فقط عند الفشل
        shippingAddress={shippingAddress}
        retryLoading={retryLoading}
        onRetry={() => handleConfirmOrder(true)}
        onGoHome={() => router.push("/")}
      />
    </>
  );
}
