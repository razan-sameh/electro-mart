// app/checkout/payment/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import { useEffect } from "react";
import { useCheckoutStore } from "@/stores/checkoutStore";
import PaymentStep from "./components/PaymentStep";
import { useBuyNow } from "@/lib/hooks/useBuyNow";

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems } = useUnifiedCart();
  const { shippingAddress, setPaymentMethod, setClientSecret } =
    useCheckoutStore();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const { data: buyNowItems } = useBuyNow();
  const itemsToCheckout = isBuyNow ? buyNowItems : cartItems;

  useEffect(() => {
    const createSetupIntent = async () => {
      if (!shippingAddress)
        return isBuyNow
          ? router.push("/checkout/shipping?isBuyNow=1")
          : router.push("/checkout/shipping");
      const res = await fetch("/api/create-setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // optionally send any info if needed
      });
      const data = await res.json();
      if (data?.clientSecret) setClientSecret(data.clientSecret);
    };
    createSetupIntent();
  }, [shippingAddress, router]);

  return (
    <PaymentStep
      onBack={() => router.back()}
      onSaved={(pm) => {
        setPaymentMethod(pm);
        isBuyNow
          ? router.push("/checkout/overview?isBuyNow=1")
          : router.push("/checkout/overview");
      }}
      items={itemsToCheckout}
    />
  );
}
