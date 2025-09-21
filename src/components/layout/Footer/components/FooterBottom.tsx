"use client";
import { useTranslations } from "next-intl";

export default function FooterBottom() {
  const t = useTranslations("Footer.bottom");

  return (
    <div className="border-t border-lightGray mt-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-content">
        <p>{t("rights")}</p>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <a href="#" className="hover:underline">{t("privacy")}</a>
          <a href="#" className="hover:underline">{t("cookies")}</a>
          <a href="#" className="hover:underline">{t("terms")}</a>
          <a href="#" className="hover:underline">{t("imprint")}</a>
        </div>
      </div>
    </div>
  );
}
