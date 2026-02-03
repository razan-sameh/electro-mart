"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import CheckoutLayout from "./components/CheckoutLayout";
import { useCheckoutStep, useDraftOrderId } from "@/lib/hooks/useCheckout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const STEP_ROUTES = [
  "/cart",
  "/checkout/shipping",
  "/checkout/payment",
  "/checkout/overview",
];

export default function CheckoutRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: orderId, isFetching : isDraftOrderIdLoading } = useDraftOrderId();
  const { data: backendStep, isLoading } = useCheckoutStep(orderId!);

  useEffect(() => {        
    if (!isDraftOrderIdLoading && !orderId) {      
      router.replace("/cart");
      return;
    }

    if (backendStep !== undefined) {
      const targetRoute = STEP_ROUTES[backendStep];
      if (pathname !== targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [backendStep, orderId, pathname, router]);

  return (
    <>
      {isLoading && isDraftOrderIdLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner />
        </div>
      ) : (
        <CheckoutLayout step={backendStep ?? 0}>
          <div className="max-w-7xl mx-auto p-8 items-start">
            <div className="w-full space-y-6">{children}</div>
          </div>
        </CheckoutLayout>
      )}
    </>
  );
}
