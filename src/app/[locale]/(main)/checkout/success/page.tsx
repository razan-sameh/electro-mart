"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useOrder } from "@/lib/hooks/useOrders";
import { formatDateTime } from "@/content/utils";
import { useLocale } from "next-intl";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCart } from "@/lib/hooks/useCart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");
  const isBuyNow = params.get("isBuyNow") === "1";
  const { data: order, isLoading, error } = useOrder(orderId!);
  const locale = useLocale();
  const { resetCheckout } = useCheckoutStore();
  const { clearCart } = useCart();

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  useLayoutEffect(() => {
    async function clear() {
      if (!isBuyNow) await clearCart();
      resetCheckout();
    }
    clear();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-red-500">Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-[#f9f9f9] px-4 py-10">
      {/* Card */}
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md text-center">
        {/* Blue icon */}
        <div className="flex justify-center mb-4">
          <img
            src="/order-success-icon.png"
            alt="Success"
            className="w-20 h-20"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold mb-1">
          Thanks for your purchase!
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Your order is confirmed and on its way soon.
        </p>

        {/* Order Details */}
        <div className="text-sm space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Order date</span>
            <span className="font-medium">
              {formatDateTime(order.date, locale, true)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Order number</span>
            <span className="font-medium">{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total price</span>
            <span className="font-medium">E£{order.total}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total items</span>
            <span className="font-medium">{order.orderItems?.length ?? 0}</span>
          </div>
        </div>

        {/* Go Home Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg transition-all"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
