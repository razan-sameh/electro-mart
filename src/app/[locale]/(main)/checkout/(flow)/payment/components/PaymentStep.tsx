"use client";
import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardForm } from "./CardForm";
import { typCartItem } from "@/content/types";
import { useCheckoutStore } from "@/stores/checkoutStore";
import Loader from "@/components/reusable/Loader";

const stripePromise = loadStripe(
  "pk_test_51SMBVSPaP6reRDRxVdU06TkBuK5OlJIuFzqRzxQ7YRWZpJrmdryXZpWgel5Q6nBnM3xpRCXGNBzL8qj4EhJ9uvWe00oDBet9nQ"
);

export default function PaymentStep({
  // clientSecret,
  onBack,
  onSaved,
  items,
}: {
  // clientSecret: string | null;
  onBack: () => void;
  onSaved: (pm: any) => void;
  items: typCartItem[];
}) {
  const { clientSecret } = useCheckoutStore();

  if (!clientSecret) {
    return <Loader text="Preparing payment..." />;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CardForm clientSecret={clientSecret} onSaved={onSaved} items={items} />
        <button onClick={onBack} className="px-3 py-2 border rounded">
          Back
        </button>
    </Elements>
  );
}
