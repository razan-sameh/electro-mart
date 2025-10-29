"use client";

import { typCartItem } from "@/content/types";
import { calculateDiscountedPrice } from "@/content/utils";
import Loader from "./Loader";

interface Props {
  items: typCartItem[];
  buttonText?: string;
  onButtonClick?: () => void;
  showInfoList?: boolean; // optional: show/hide the info list at the bottom
  loading?: boolean; // 👈 add this
}

export default function CartSummary({
  items,
  buttonText = "Continue to order",
  onButtonClick,
  showInfoList = true,
  loading = false,
}: Props) {  
  // Subtotal before discounts
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Subtotal after discounts
  const discountedTotal = items.reduce(
    (sum, item) => sum + calculateDiscountedPrice(item.product) * item.quantity,
    0
  );

  // Discount amount
  const discount = subtotal - discountedTotal;

  // Discount percentage (based on subtotal)
  const discountPercent =
    subtotal > 0 ? ((discount / subtotal) * 100).toFixed(0) : "0";

  return (
    <div className="border border-lightGray/60 rounded-lg px-6 bg-background min-h-[532px] flex flex-col justify-evenly">
      {/* Top Section (Summary Numbers) */}
      <div className="space-y-4 text-sm">
        <p className="flex justify-between border-b border-lightGray/60 pb-2">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </p>
        <p className="flex justify-between border-b border-lightGray/60 pb-2">
          <span>Shipping Cost</span>
          <span>Free</span>
        </p>
        <p className="flex justify-between text-red-600 border-b border-lightGray/60 pb-2">
          <span>Discount amount</span>
          <span>
            -€{discount.toFixed(2)} ({discountPercent}%)
          </span>
        </p>
        <p className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>€{discountedTotal.toFixed(2)}</span>
        </p>
      </div>

      {/* Bottom Section (Button + Info) */}
      <div className="flex flex-col gap-6 mt-4">
        <button
          className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg font-medium transition flex items-center justify-center"
          onClick={onButtonClick}
          disabled={loading}
        >
          {loading ? <Loader size={20} color="#fff" /> : buttonText}
        </button>

        {/* Optional Info List */}
        {showInfoList && (
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="pb-2">✔ Free shipping for all orders over €50</li>
            <li className="pb-2">✔ 30 days returns for an exchange product</li>
            <li className="pb-2">✔ Free with select orders</li>
            <li className="pb-2">✔ Support 24/7</li>
          </ul>
        )}
      </div>
    </div>
  );
}
