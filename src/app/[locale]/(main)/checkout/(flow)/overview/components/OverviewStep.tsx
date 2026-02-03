"use client";
import React, { useState } from "react";
import CartSummary from "@/components/reusable/CartSummary";
import DeliverySection from "./DeliverySection";
import PaymentMethodSection from "./PaymentMethodSection";
import PaymentResultModal from "./PaymentResultModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useOrderById } from "@/lib/hooks/useOrders";
import { typOrderItem } from "@/content/types";
import CartItemCard from "@/components/reusable/CartItemCard";
import { useConfirmOrder, useDraftOrderId } from "@/lib/hooks/useCheckout";

export default function OverviewStep() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  // const { orderId } = useCheckoutStore();
  const { data: orderId, isLoading: isDraftOrderIdLoading } = useDraftOrderId();
  const { data: order, isPending } = useOrderById(orderId!);
  const [loading, setLoading] = useState(false);
  const [retryLoading, setRetryLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const { mutateAsync: confirmOrder, isPending: isConfirmPending } =
    useConfirmOrder();

  if (isPending || !order) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  const { items, payment } = order;

  // 💳 Confirm Order
  const handleConfirmOrder = async (isRetry = false) => {
    if (!payment) {
      alert(t("noPaymentMethod"));
      return;
    }

    // isRetry ? setRetryLoading(true) : setLoading(true);

    try {
      const data = await confirmOrder(orderId!);

      if (data.success) {
        router.replace(`/checkout/success?orderId=${order.id}`);
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    } finally {
      // isRetry ? setRetryLoading(false) : setLoading(false);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-10">
          {/* 🚚 Delivery */}
          <DeliverySection
            shippingAddress={order.ShippingAddress}
            phone={order.phone}
          />

          {/* 🧾 Items */}
          <section>
            <h2 className="font-semibold text-lg mb-4">{t("OrderSummary")}</h2>

            <div className="space-y-4">
              {items.map((item: typOrderItem) => (
                <CartItemCard key={item.variant.id} item={item} />
              ))}
            </div>
          </section>

          {/* 💳 Payment */}
          <PaymentMethodSection payment={payment} />
        </div>

        {/* 🧮 Summary */}
        <div>
          <CartSummary
            items={items}
            buttonText={t("SubmitAndPay")}
            onButtonClick={() => handleConfirmOrder(false)}
            loading={isConfirmPending}
          />
        </div>
      </div>

      {/* ❌ Failure */}
      <PaymentResultModal
        status={status === "failed" ? "failed" : null}
        shippingAddress={order.ShippingAddress}
        retryLoading={isConfirmPending}
        onRetry={() => handleConfirmOrder(true)}
        onGoHome={() => router.push("/")}
      />
    </>
  );
}
