"use client";
import CartItemCard from "@/components/reusable/CartItemCard";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useRouter } from "@/i18n/navigation";

interface Props {
  onClose: () => void;
}

export default function CartDropdown({ onClose }: Props) {
  const { cartItems: items, isGuest, isLoading } = useUnifiedCart();
  const router = useRouter();

  const total = Array.isArray(items)
    ? items.reduce((sum, item) => {
        const price = item?.product?.price ?? 0;
        const quantity = item?.quantity ?? 0;
        return sum + price * quantity;
      }, 0)
    : 0;

  const handleCheckout = async () => {
    onClose();
    if (isGuest) router.push("/login?redirect=/checkout/shipping");
    else router.push("/checkout/shipping");
  };

  function handleReviewItems() {
    onClose();
    router.push("/cart");
  }

  return (
    <div className="absolute right-0 mt-2 sm:w-96 md:w-[400px] bg-background shadow-xl rounded-lg p-4 z-50 max-w-md">
      {/* Items */}
      <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-6 text-sm sm:text-base">
            Loading cart...
          </p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <CartItemCard
              key={`${item.id}-${item.selectedColor?.documentId || "default"}`}
              item={item}
            />
          ))
        ) : (
          <p className="text-center py-6 text-sm sm:text-base">
            Your cart is empty
          </p>
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <>
          <div className="mt-3 sm:mt-4 pt-3 text-xs sm:text-sm  border-t border-lightGray/60">
            <div className="flex justify-between">
              <span>Shipping fee:</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total amount:</span>
              <span>€ {total}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-4">
            <button
              className="flex-1 border border-primary text-primary rounded-lg py-2 text-xs sm:text-sm font-medium transition"
              onClick={handleReviewItems}
            >
              Review Items
            </button>
            <button
              className="flex-1 rounded-lg py-2 text-xs sm:text-sm font-medium bg-primary text-white hover:bg-primary/90 transition"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
