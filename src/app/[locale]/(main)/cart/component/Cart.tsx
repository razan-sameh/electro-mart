"use client";

import React from "react";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";

function Cart() {
  const { cart, isGuest, isLoading} = useUnifiedCart();

  if (isLoading) {
    return <p className="text-gray-500 text-center mt-12">Loading cart...</p>;
  }

  if (!cart || cart.length === 0) {
    return <p className="text-gray-500 text-center mt-12">Your cart is empty</p>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🛒 Cart Items */}
        <div className="flex-1">
          <CartList items={cart} />
        </div>

        {/* 💳 Order Summary */}
        <div className="w-full lg:w-[392px] flex-shrink-0">
          <CartSummary items={cart} />
          {isGuest && (
            <p className="text-sm text-gray-400 mt-4">
              You’re shopping as a guest — log in to sync your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
