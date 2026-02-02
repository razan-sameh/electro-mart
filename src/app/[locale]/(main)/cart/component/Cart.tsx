"use client";

import React from "react";
import CartList from "./CartList";
import CartSummary from "../../../../../components/reusable/CartSummary";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useCart } from "@/lib/hooks/useCart";
import { FiShoppingBag } from "react-icons/fi";
import { useCreateOrder } from "@/lib/hooks/useCheckout";
import { useCheckoutStore } from "@/stores/checkoutStore";

function Cart() {
  const { cart, isLoading } = useCart();
  const router = useRouter();
  const t = useTranslations("Cart");
  const { mutateAsync: createOrder , isPending } = useCreateOrder();
  const { setOrderId, orderId } = useCheckoutStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart?.items?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="flex items-center justify-center">
          <FiShoppingBag className="w-6 h-6 text-gray-400 me-2" />
          <p className="text-gray-500 text-center text-lg">{t("empty")}</p>
        </div>
        <Link
          href="/categories"
          className="inline-block bg-primary text-white px-6 py-3 mt-2 rounded-lg hover:bg-primary/80 transition"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (!data.user) router.push("/login?redirect=/checkout/shipping");
    else {
      const newOrderId = await createOrder({
        items: cart.items,
        orderId: orderId ?? null,
      });

      setOrderId(newOrderId);
      router.push("/checkout/shipping");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🛒 Cart Items */}
          <div className="flex-1">
            <CartList items={cart?.items} />
          </div>

          {/* 💳 Order Summary */}
          <div className="w-full lg:w-[392px] flex-shrink-0">
            <CartSummary items={cart?.items} onButtonClick={handleCheckout} loading={isPending}/>
            {/* {isGuest && (
              <p className="text-sm text-gray-400 mt-4">{t("guestNotice")}</p>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
