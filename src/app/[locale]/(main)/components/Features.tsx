"use client";

import { FaTruck, FaUndoAlt, FaGift, FaHeadset, FaLock } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("Features"); // Use the "SpecialOffers" namespace

  const features = [
    {
      icon: <FaTruck className="w-6 h-6 text-gray-600" />,
      title: t("freeShipping"),
      desc: t("freeShippingDesc"),
    },
    {
      icon: <FaUndoAlt className="w-6 h-6 text-gray-600" />,
      title: t("easyReturns"),
      desc: t("easyReturnsDesc"),
    },
    {
      icon: <FaGift className="w-6 h-6 text-gray-600" />,
      title: t("specialGifts"),
      desc: t("specialGiftsDesc"),
    },
    {
      icon: <FaHeadset className="w-6 h-6 text-gray-600" />,
      title: t("support"),
      desc: t("supportDesc"),
    },
    {
      icon: <FaLock className="w-6 h-6 text-gray-600" />,
      title: t("securePayment"),
      desc: t("securePaymentDesc"),
    },
  ];

  return (
    <section className="py-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 bg-lightGray/20 border border-lightGray/20 rounded-md justify-items-center">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3">
          {/* Icon */}
          {f.icon}

          {/* Text */}
          <div>
            <h4 className="font-medium text-sm">{f.title}</h4>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
