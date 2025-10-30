"use client";
import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import CartSummary from "@/components/reusable/CartSummary";
import { typCartItem } from "@/content/types";
import { useTranslations } from "next-intl";

export function CardForm({
  clientSecret,
  onSaved,
  items,
}: {
  clientSecret: string;
  onSaved: (pm: any) => void;
  items: typCartItem[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Checkout");

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (result.error) {
        console.error(result.error.message);
      } else if (result.setupIntent?.payment_method) {
        onSaved({ id: result.setupIntent.payment_method, clientSecret });
      }
    } catch (err: any) {
      console.error(err.message || t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-6">
      {/* LEFT SIDE (Payment Form) */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-semibold mb-4">{t("paymentDetails")}</h2>
        <PaymentElement />
        <button onClick={handleSaveCard} className="hidden" />
      </div>

      {/* RIGHT SIDE (Cart Summary) */}
      <div>
        <CartSummary
          items={items}
          buttonText={t("saveAndContinue")}
          onButtonClick={handleSaveCard}
          loading={loading}
        />
      </div>
    </div>
  );
}
