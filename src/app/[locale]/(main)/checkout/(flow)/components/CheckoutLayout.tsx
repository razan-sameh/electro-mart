// components/CheckoutLayout.tsx
import React from "react";
import ProgressTabs from "./ProgressTabs";

export default function CheckoutLayout({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-body py-10">
      <div className="max-w-5xl mx-auto px-4">
        <ProgressTabs step={step} />
      </div>
        <div className="mt-6">{children}</div>
    </div>
  );
}
