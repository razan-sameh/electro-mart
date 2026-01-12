"use client";

import { useState } from "react";
import Filters from "./Filters";
import { FaFilter } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function MobileFilters({ categoryId }: { categoryId?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("Filters");

  const openSheet = () => {
    setIsVisible(true);
    setTimeout(() => setIsOpen(true), 10); // small delay to trigger animation
  };

  const closeSheet = () => {
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 300); // match animation duration
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={openSheet}
        className="flex items-center gap-2 px-4 py-2 rounded-xl  border border-lightGray/60"
      >
        <FaFilter className="text-icon" />
        <span className="font-medium">{t('filters')}</span>
      </button>

      {/* Bottom sheet */}
      {isVisible && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Sheet content */}
          <div
            className={`relative bg-background rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto shadow-lg transform transition-transform duration-300 ${
              isOpen ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={closeSheet}
                className="text-icon hover:text-lightGray/90"
              >
                ✕
              </button>
            </div>
            <Filters categoryId={categoryId} isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
}
