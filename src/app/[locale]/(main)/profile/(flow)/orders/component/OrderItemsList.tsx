import React from "react";
import { typOrder } from "@/content/types";

interface OrderItemsListProps {
  items: typOrder["items"];
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border border-gray-200 rounded-lg p-3 mb-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={item.productImage}
                alt={item.productTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.productTitle}
              </p>
              <p className="text-xs text-gray-500">×{item.quantity}</p>
              <p className="text-xs text-gray-400">{item.sku}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};