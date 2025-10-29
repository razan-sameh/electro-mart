// components/ProgressTabs.tsx
import React from "react";

const tabs = [
  { id: 0, title: "Address", subtitle: "Delivery details" },
  { id: 1, title: "Payment", subtitle: "Payment method" },
  { id: 2, title: "Overview", subtitle: "Confirm order" },
];

export default function ProgressTabs({ step }: { step: number }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      {tabs.map((t) => {
        const active = t.id === step;
        const done = t.id < step;
        return (
          <div key={t.id} className="flex-1 text-center">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                active ? "bg-blue-600 text-white" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {done ? "✓" : t.id + 1}
            </div>
            <div className="mt-2 text-sm font-medium">{t.title}</div>
            <div className="text-xs text-gray-500">{t.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
