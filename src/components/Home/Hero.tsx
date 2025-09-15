"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CategoriesNavBar from "../CategoriesNavBar";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-start bg-gray-100">
      {/* Background Image */}
      <Image
        src="/hero-bg.png"
        alt={t("title")}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 md:ps-16 text-start">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-gray-200">{t("subtitle")}</p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition cursor-pointer">
          {t("button")}
        </button>
      </div>

      {/* ✅ NavBar only on desktop */}
      <div className="hidden md:block">
        <CategoriesNavBar absolute />
      </div>
    </section>
  );
}
