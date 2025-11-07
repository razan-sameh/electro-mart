import React from "react";

interface OrderHeaderProps {
  order: any;
  orderId: string;
}

export default function OrderHeader({ order, orderId }: OrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <p className="text-content">Order ID:</p>
        <p className="font-bold">#{orderId}</p>
      </div>
      <span className="text-sm text-secondary font-medium bg-secondary/10 px-3 py-1 rounded-full self-start sm:self-auto">
        {order?.orderStatus}
      </span>
    </div>
  );
}
