import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

export default function DeliverySection({ shippingAddress }: any) {
  return (
    <section>
      <h2 className="font-semibold text-lg mb-4">Delivery and billing address</h2>
      <div className="text-sm space-y-3 border border-lightGray/60 rounded-lg p-5">
        <p className="font-bold">{shippingAddress?.name}</p>

        <div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <strong>Address:</strong>
          </div>
          <p>
            {shippingAddress?.streetAddress}, {shippingAddress?.city},{" "}
            {shippingAddress?.country}
            <br />
            {shippingAddress?.postalCode}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500" />
            <strong>Email:</strong>
          </div>
          <p>{shippingAddress?.email}</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <strong>Phone:</strong>
          </div>
          <p>{shippingAddress?.phone}</p>
        </div>
      </div>
    </section>
  );
}
