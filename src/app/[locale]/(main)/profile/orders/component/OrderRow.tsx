import React from "react";
import { typOrder } from "@/content/types";
import { formatDateTime } from "@/content/utils";
import { useLocale } from "next-intl";

interface OrderRowProps {
  order: typOrder;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  order,

}) => {
    const locale = useLocale();
  
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-colors">
      {/* Checkbox and Order Number */}
      <div className="col-span-3 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900"># {order.id}</span>
      </div>

      {/* Products */}
      <div className="col-span-4 flex flex-col gap-2">
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={item.product.imagesUrl[0]}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </span>
              <span className="text-xs text-gray-500">×{item.quantity}</span>
              {item.product.colors && item.product.colors.length > 0 && (
                <span className="text-xs text-gray-500">
                  {item.product.colors[0].name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Date */}
      <div className="col-span-2">
        <span className="text-sm text-gray-600">
          {formatDateTime(order.date, locale,true)}
        </span>
      </div>

      {/* Total Payment */}
      <div className="col-span-2">
        <span className="text-sm font-medium text-gray-900">
          E£ {order.totalPayment.toFixed(2)}
        </span>
      </div>

      {/* Status */}
      <div className="col-span-1">
        <span className="text-xs text-gray-600 capitalize">
          {order.orderStatus === "processing"
            ? "Being processed"
            : order.orderStatus}
        </span>
      </div>
    </div>
  );
};
