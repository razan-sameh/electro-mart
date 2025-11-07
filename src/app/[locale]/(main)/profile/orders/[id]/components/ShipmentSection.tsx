import React from "react";
import { FaTruck } from "react-icons/fa";

export default function ShipmentSection({ order }: { order: any }) {
  const shipping = order?.ShippingAddress;
  const user = order?.user;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="bg-body rounded-2xl p-4 shadow-sm flex-1 space-y-2">
        <h2 className="font-semibold text-content flex items-center gap-2">
          <FaTruck /> Shipment
        </h2>
        <p className="text-sm text-content">{user?.username}</p>
        <p className="text-sm text-content">Email: {user?.email}</p>
        <p className="text-sm text-content">
          Delivery Address: {shipping?.streetAddress}, {shipping?.city},{" "}
          {shipping?.country}
        </p>
        <p className="text-sm text-content">
          Phone:{" "}
          {shipping?.phone
            ? `+${shipping.phone.dialCode} ${shipping.phone.number}`
            : "No phone available"}
        </p>
      </div>
    </div>
  );
}
