"use client";
import CheckoutLayout from "./components/CheckoutLayout";
import { useCheckoutStep, useDraftOrderId } from "@/lib/hooks/useCheckout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CheckoutRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: orderId, isFetching : isDraftOrderIdLoading } = useDraftOrderId();
  const { data: backendStep, isLoading } = useCheckoutStep(orderId);

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
