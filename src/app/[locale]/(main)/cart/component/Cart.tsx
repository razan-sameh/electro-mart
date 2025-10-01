"use client";

import { useCartStore } from "@/stores/cartStore";
import React from "react";
import CartList from "./CartList";
import CartSummary from "./CartSummary";

function Cart() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return <p className="text-gray-500 text-center mt-12">Your cart is empty</p>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <CartList items={items} />
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[392px] flex-shrink-0">
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
