// app/checkout/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import CheckoutLayout from "./components/CheckoutLayout";

export default function CheckoutRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // نحدد الخطوة الحالية بناءً على الـ URL
  const step = pathname.includes("shipping")
    ? 0
    : pathname.includes("payment")
    ? 1
    : pathname.includes("overview")
    ? 2
    : 0;

  return (
    <CheckoutLayout step={step}>
      <div className="max-w-7xl mx-auto p-8 items-start">
        <div className="w-full space-y-6">{children}</div>
      </div>
    </CheckoutLayout>
  );
}
