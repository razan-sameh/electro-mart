"use client";
import {
  FaTimes,
  FaChevronRight,
  FaChevronDown,
  FaChevronLeft,
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useMenuData } from "@/hooks/useMenuData";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslations } from "next-intl";

export default function MobileDrawer({
  setMenuOpen,
}: {
  setMenuOpen: (v: boolean) => void;
}) {
  const { getMenuItemsWithIcons, handleItemClick } = useMenuData();
  const { languageOptions, currentLanguage, changeLanguage ,locale } = useLanguage();
  const menuItems = getMenuItemsWithIcons(true);
  const [showLanguages, setShowLanguages] = useState(false);
  const t = useTranslations("Header");

  return (
    <div className="fixed inset-0 z-30">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`absolute top-0 w-72 bg-background shadow-lg p-6 flex flex-col ${
          locale === "ar" ? "right-0" : "left-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            ELECTRIC<span style={{ color: "#FB5F2F" }}>.</span>MART
          </Link>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes size={22} className="text-icon" />
          </button>
        </div>

        <h3 className="text-blue-600 font-semibold mb-4">{t('products')}</h3>
        <nav className="flex flex-col space-y-4 text-icon">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3"
              onClick={() => {
                handleItemClick(item);
                setMenuOpen(false);
              }}
            >
              {item.icon} {item.label}
            </Link>
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
      </div>
    </div>
  );
}
