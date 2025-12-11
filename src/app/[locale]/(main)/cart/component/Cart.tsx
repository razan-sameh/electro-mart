"use client";

import React from "react";
import CartList from "./CartList";
import CartSummary from "../../../../../components/reusable/CartSummary";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function Cart() {
  const { cartItems: cart, isGuest, isLoading } = useUnifiedCart();
  const router = useRouter();
  const t = useTranslations("Cart");

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (!cart || cart.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-12">Your cart is empty</p>
    );
  }
  const handleCheckout = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (!data.user) router.push("/login?redirect=/checkout/shipping");
    else router.push("/checkout/shipping");
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🛒 Cart Items */}
          <div className="flex-1">
            <CartList items={cart} />
          </div>

          {/* 💳 Order Summary */}
          <div className="w-full lg:w-[392px] flex-shrink-0">
            <CartSummary items={cart} onButtonClick={handleCheckout} />
            {isGuest && (
              <p className="text-sm text-gray-400 mt-4">
                You’re shopping as a guest — log in to sync your cart.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
