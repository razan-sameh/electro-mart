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
import { typCartItem, typOrderItem } from "@/content/types";
import CartItemCard from "@/components/reusable/CartItemCard";
import { useConfirmOrder, useDraftOrderId } from "@/lib/hooks/useCheckout";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";

export default function OverviewStep() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  // const { orderId } = useCheckoutStore();
  const { data: orderId } = useDraftOrderId();
  const { data: order, isPending } = useOrderById(orderId!);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);
  const { mutateAsync: confirmOrder, isPending: isConfirmPending } =
    useConfirmOrder();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variantId");
  const quantity = searchParams.get("quantity");
  const { cart } = useCart();
  const itemsToCheckout =
    isBuyNow && productId && variantId && quantity
      ? (cart?.items ?? [])
          .filter(
            (item) =>
              item.product.id === Number(productId) &&
              item.variant.id === Number(variantId),
          )
          .map((item) => ({ ...item, quantity: Number(quantity) }))
      : (cart?.items ?? []);

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
        if (isBuyNow) {
          router.replace(
            `/checkout/success?isBuyNow=1&productId=${itemsToCheckout[0].product.id}&variantId=${itemsToCheckout[0].variant.id}&quantity=${itemsToCheckout[0].quantity}&orderId=${order.id}`,
          );
        } else router.replace(`/checkout/success?orderId=${order.id}`);
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2 space-y-10">
          {/* 🚚 Delivery */}
          <DeliverySection
            shippingAddress={order.shippingAddress}
            phone={order.phone}
          />

          {/* 🧾 Items */}
          <section>
            <h2 className="font-semibold text-lg mb-4">{t("OrderSummary")}</h2>

            <div className="space-y-4">
              {itemsToCheckout.map((item: typCartItem) => (
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
            items={itemsToCheckout}
            buttonText={t("SubmitAndPay")}
            onButtonClick={() => handleConfirmOrder(false)}
            loading={isConfirmPending}
            quantity={isBuyNow ? Number(quantity) : undefined}
          />
        </div>
      </div>

      {/* ❌ Failure */}
      <PaymentResultModal
        status={status === "failed" ? "failed" : null}
        shippingAddress={order.shippingAddress}
        retryLoading={isConfirmPending}
        onRetry={() => handleConfirmOrder(true)}
        onGoHome={() => router.push("/")}
      />
    </>
  );
}
