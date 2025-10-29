// app/checkout/shipping/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useCheckoutStore } from "@/stores/checkoutStore";
import AddressForm from "./components/AddressForm";
import { useBuyNow } from "@/lib/hooks/useBuyNow";

export default function ShippingPage() {
  const router = useRouter();
  const { cartItems } = useUnifiedCart();
  const { setShippingAddress, shippingAddress } = useCheckoutStore();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const { data: buyNowItems } = useBuyNow();
  const itemsToCheckout = isBuyNow ? buyNowItems : cartItems;

  return (
    <AddressForm
      onNext={(address) => {
        setShippingAddress(address);
        isBuyNow
          ? router.push("/checkout/payment?isBuyNow=1")
          : router.push("/checkout/payment");
      }}
      items={itemsToCheckout}
      initial={shippingAddress}
    />
  );
}
