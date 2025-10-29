// app/checkout/overview/page.tsx
"use client";
import { useEffect } from "react";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { useUnifiedCart } from "@/hooks/useUnifiedCart";
import OverviewStep from "./components/OverviewStep";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useBuyNow } from "@/lib/hooks/useBuyNow";

export default function OverviewPage() {
  const router = useRouter();
  const { cartItems } = useUnifiedCart();
  const { shippingAddress, paymentMethod, setCardInfo, setLoadingCardInfo } =
    useCheckoutStore();

  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("isBuyNow") === "1";
  const { data: buyNowItems } = useBuyNow();
  const itemsToCheckout = isBuyNow ? buyNowItems : cartItems;

  useEffect(() => {
    // تحقق من الخطوات السابقة
    if (!shippingAddress) {
      // رجوع لصفحة Shipping لو ما اكتملش
      isBuyNow
        ? router.push("/checkout/shipping?isBuyNow=1")
        : router.push("/checkout/shipping");
      return;
    }
    if (!paymentMethod?.id) {
      // رجوع لصفحة Payment لو ما اكتملش
      isBuyNow
        ? router.push("/checkout/payment?isBuyNow=1")
        : router.push("/checkout/payment");
      return;
    }

    // لو كل شيء تمام، جلب معلومات الكارد
    setLoadingCardInfo(true);
    fetch(`/api/payment-method/${paymentMethod.id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed");
        setCardInfo({
          brand: data.brand,
          last4: data.last4,
          exp_month: data.exp_month,
          exp_year: data.exp_year,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch card info:", err);
        setCardInfo(null);
      })
      .finally(() => setLoadingCardInfo(false));
  }, [shippingAddress, paymentMethod, router]);

  return (
    <OverviewStep
      items={itemsToCheckout}
      shippingAddress={shippingAddress}
      paymentMethod={paymentMethod}
      onBack={() =>
        isBuyNow
          ? router.push("/checkout/payment?isBuyNow=1")
          : router.push("/checkout/payment")
      }
      isClearCart={!isBuyNow}
    />
  );
}
