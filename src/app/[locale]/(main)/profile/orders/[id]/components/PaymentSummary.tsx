import React from "react";

export default function PaymentSummary({ order }: { order: any }) {
  const payment = order?.payment;

  return (
    <div className="bg-body rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
        <h2 className="font-semibold">Payment Details</h2>
      <span className="text-sm text-secondary font-medium bg-secondary/10 px-3 py-1 rounded-full self-start sm:self-auto mt-2">
          {payment?.paymentStatus}
        </span>
      </div>
      <div className="text-sm space-y-1">
        <div className="flex justify-between items-center">
          <p>Payment Method</p>
          <p>
            {payment?.paymentMethod.brand} {payment?.paymentMethod.last4}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p>Subtotal</p>
          <p>E£ {order?.subtotal}</p>
        </div>
        <div className="flex justify-between items-center text-secondary">
          <p>Discount</p>
          <p>E£ -{order?.discountTotal}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Shipping Fee</p>
          <p>Free</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-3">
        <p className="font-bold">Total</p>
        <p className="font-semibold text-lg">E£ {order?.total}</p>
      </div>
    </div>
  );
}
