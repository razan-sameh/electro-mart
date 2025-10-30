"use client";
import { useSearchParams } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
  const t = useTranslations("Checkout");
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  useEffect(() => {
    const handlePopState = () => {
      router.replace("/"); // redirect to home if they press Back
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-160px)] bg-gray-50 px-4 py-10 overflow-hidden">
      {/* 🎇 Confetti animation */}
      <DotLottieReact
        src="/Confetti.lottie"
        autoplay
        loop={false}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4 relative z-10">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-green-600 mb-3 relative z-10">
        {t("PaymentSuccessful")}
      </h1>

      <p className="text-gray-600 mb-2 relative z-10">
        <strong>{t("OrderID")}:</strong> {orderId}
      </p>
      <p className="text-gray-600 mb-6 relative z-10">
        <strong>{t("AmountPaid")}:</strong> €{amount}
      </p>

      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all relative z-10"
      >
        {t("GoHome")}
      </button>
    </div>
  );
}
