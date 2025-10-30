"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function ProgressTabs({ step }: { step: number }) {
  const t = useTranslations("Checkout");

  const tabs = [
    { id: 0, title: t("addressTitle"), subtitle: t("addressSubtitle") },
    { id: 1, title: t("paymentTitle"), subtitle: t("paymentSubtitle") },
    { id: 2, title: t("overviewTitle"), subtitle: t("overviewSubtitle") },
  ];

  return (
    <div className="bg-background p-4 rounded shadow flex items-center justify-between">
      {tabs.map((tab) => {
        const active = tab.id === step;
        const done = tab.id < step;
        return (
          <div key={tab.id} className="flex-1 text-center">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                active
                  ? "bg-blue-600 text-white"
                  : done
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {done ? "✓" : tab.id + 1}
            </div>
            <div className="mt-2 text-sm font-medium">{tab.title}</div>
            <div className="text-xs text-gray-500">{tab.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
