"use client";
import {
  FaTimes,
  FaChevronRight,
  FaChevronDown,
  FaChevronLeft,
} from "react-icons/fa";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslations } from "next-intl";
import { useCategories } from "@/lib/hooks/useCategories";
import { typCategory } from "@/content/types";
import { Link, useRouter } from "@/i18n/navigation";
import { renderIcon } from "@/content/iconMap";
import MobileDrawer from "@/components/reusable/MobileDrawer";

export default function CategoriesDrawer({
  setMenuOpen,
  isOpen,
}: {
  setMenuOpen: (v: boolean) => void;
  isOpen: boolean;
}) {
  const { data: categories = [] } = useCategories();
  const { languageOptions, currentLanguage, changeLanguage, locale } =
    useLanguage();
  const [showLanguages, setShowLanguages] = useState(false);
  const t = useTranslations("Header");
  const allCategories = [
    { id: "all", name: t("allCategories") },
    ...categories,
  ];
  const router = useRouter();

  const handleSelectCategory = (categoryId: string | null) => {
    const updatedCat = categoryId === "all" ? null : categoryId;
    router.push(updatedCat ? `/categories/${updatedCat}` : `/categories`);
    setMenuOpen(false);
  };

  return (
    <MobileDrawer setMenuOpen={setMenuOpen} isOpen={isOpen}>
      <Link
        href="/"
        className="text-lg font-bold text-blue-600"
        onClick={() => setMenuOpen(false)}
      >
        ELECTRIC<span className="text-secondary">.</span>MART
      </Link>
      <h3 className="text-blue-600 font-semibold my-4">{t("products")}</h3>
      <nav className="flex flex-col space-y-4 text-icon">
        {allCategories.map((item: typCategory) => (
          <button
            key={item.id}
            className="flex items-center gap-3 hover:text-blue-600 transition-colors"
            onClick={() => handleSelectCategory(item.id)} // ✅ close drawer after click
          >
            {item.icon && renderIcon(item.icon, 20)} {item.name}
          </button>
        ))}
      </nav>

      {/* Language selector */}
      <div className="mt-auto pt-6 text-icon">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setShowLanguages(!showLanguages)}
        >
          <span className="flex items-center gap-2">
            {currentLanguage.icon} {t("language")} ({currentLanguage.label})
          </span>
          {showLanguages ? (
            <FaChevronDown />
          ) : locale === "ar" ? (
            <FaChevronLeft />
          ) : (
            <FaChevronRight />
          )}
        </button>

        {showLanguages && (
          <div className="mt-2 flex flex-col space-y-2 ps-6">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                className="flex items-center gap-2 text-start hover:text-blue-600"
                onClick={() => {
                  changeLanguage(lang.code.toLowerCase());
                  setShowLanguages(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </MobileDrawer>
  );
}
