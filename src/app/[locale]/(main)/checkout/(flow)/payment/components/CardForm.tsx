"use client";
import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import CartSummary from "@/components/reusable/CartSummary";
import { typCartItem } from "@/content/types";

export function CardForm({
  clientSecret,
  onSaved,
  items
}: {
  clientSecret: string;
  onSaved: (pm: any) => void;
  items: typCartItem[]
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Card validation failed");
      } else if (result.setupIntent?.payment_method) {
        onSaved({ id: result.setupIntent.payment_method, clientSecret });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-6">
      {/* LEFT SIDE (Payment Form) */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentElement />

        <button onClick={handleSaveCard} className="hidden" />
      </div>

      {/* RIGHT SIDE (Cart Summary with external button) */}
      <div>
        <CartSummary
          items={items} // 🧩 pass your cart items here
          buttonText={"Save and Continue"}
          onButtonClick={handleSaveCard}
          loading={loading}
        />
      </div>
    </div>
  );
}
