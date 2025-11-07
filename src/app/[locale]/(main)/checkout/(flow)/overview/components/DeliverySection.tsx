import React from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { typShippingAddress } from "@/content/types";
import { useAuth } from "@/lib/hooks/useAuth";

interface DeliverySectionProps {
  shippingAddress: typShippingAddress | null;
}
export default function DeliverySection({
  shippingAddress,
}: DeliverySectionProps) {
  const t = useTranslations("Checkout");
  const { user } = useAuth();

  return (
    <section>
      <h2 className="font-semibold text-lg mb-4">
        {t("DeliveryAddressTitle")}
      </h2>
      <div className="text-sm space-y-3 border border-lightGray/60 rounded-lg p-5">
        <p className="font-bold">{user?.username}</p>

        <div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <strong>{t("Address")}:</strong>
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
            <strong>{t("Email")}:</strong>
          </div>
          <p>{user?.email}</p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <strong>{t("Phone")}:</strong>
          </div>
          <p>
            {shippingAddress?.phone.dialCode}
            {shippingAddress?.phone.number}
          </p>
        </div>
      </div>
    </section>
  );
}
