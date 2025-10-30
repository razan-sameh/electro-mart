"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ProductAds() {
  const t = useTranslations("ProductDetails");

  return (
    <section className="relative w-full h-[30vh] bg-gray-100">
      <img
        src="/ads/ads1.png"
        alt="ads1"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-end p-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-white text-lg">{t("yourNextFavorite")}</span>
          <span className="text-white text-lg mb-4">{t("clickAway")}</span>
          <Link
            href="/categories"
            className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
