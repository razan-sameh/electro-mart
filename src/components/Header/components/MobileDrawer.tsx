"use client";
import { FaTimes, FaChevronRight, FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { useMenuData } from "@/hooks/useMenuData";
import { useLanguageData } from "@/hooks/useLanguageData";
import { useState } from "react";

interface Props {
  setMenuOpen: (open: boolean) => void;
}

export default function MobileDrawer({ setMenuOpen }: Props) {
  const { getMenuItemsWithIcons, handleItemClick } = useMenuData();
  const { languageOptions } = useLanguageData();

  const menuItems = getMenuItemsWithIcons(true);
  const [showLanguages, setShowLanguages] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languageOptions[0]);

  return (
    <div className="fixed inset-0 z-30">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setMenuOpen(false)}
      />
      <div className="absolute left-0 top-0 w-72 bg-white shadow-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            ELECTRIC<span style={{ color: "#FB5F2F" }}>.</span>MART
          </Link>
          <button onClick={() => setMenuOpen(false)}>
            <FaTimes size={22} className="text-gray-600" />
          </button>
        </div>

        <h3 className="text-blue-600 font-semibold mb-4">Products</h3>
        <nav className="flex flex-col space-y-4 text-gray-800">
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
        <div className="mt-auto pt-6 text-gray-700">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => setShowLanguages(!showLanguages)}
          >
            <span className="flex items-center gap-2">
              {currentLanguage.icon} Language ({currentLanguage.label})
            </span>
            {showLanguages ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {/* Languages list (only shown when expanded) */}
          {showLanguages && (
            <div className="mt-2 flex flex-col space-y-2 pl-6">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  className="flex items-center gap-2 text-left hover:text-blue-600"
                  onClick={() => {
                    setCurrentLanguage(lang);
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
