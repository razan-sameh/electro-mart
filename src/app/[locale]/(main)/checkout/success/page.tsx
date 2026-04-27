"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useOrderById } from "@/lib/hooks/useOrders";
import { formatDateTime } from "@/content/utils";
import { useLocale } from "next-intl";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useCart } from "@/lib/hooks/useCart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = Number(params.get("orderId"));
  const { data: order, isLoading, error } = useOrderById(orderId!);
  const locale = useLocale();
  const { resetCheckout } = useCheckoutStore();
  const { clearCart, removeItem, updateItem } = useCart();
  const queryClient = useQueryClient();
  const isBuyNow = params.get("isBuyNow") === "1";
  const productId = params.get("productId");
  const variantId = params.get("variantId");
  const quantity = params.get("quantity");
  const { cart } = useCart();

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
      if (isBuyNow) {
        const cartItem = cart?.items.find(
          (item) =>
            item.product.id === Number(productId) &&
            item.variant.id === Number(variantId),
        );

        if (cartItem) {
          const originalQty = cartItem.quantity - Number(quantity);

          if (originalQty <= 0) {
            // Item wasn't in cart before Buy Now — remove it entirely
            await removeItem(cartItem.id);
          } else {
            // Item was already in cart — restore original quantity
            await updateItem({ itemId: cartItem.id, quantity: originalQty });
          }
        }
      } else {
        await clearCart();
      }
      queryClient.setQueryData<number | null>(["draftOrderId"], null);
      queryClient.invalidateQueries({ queryKey: ["checkoutStep", order?.id] });
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
            <span className="font-medium">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total price</span>
            <span className="font-medium">E£{order.total}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total items</span>
            <span className="font-medium">{order.items.length ?? 0}</span>
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
